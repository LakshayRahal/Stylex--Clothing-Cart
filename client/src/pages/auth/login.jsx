import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";

const initialState = { email: "", password: "" };

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const { toast } = useToast();
  const navigate = useNavigate();

  //Email/password login — works as before
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const token = await result.user.getIdToken();

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/firebase-login`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      navigate("/");
    } catch (error) {
      toast({ title: error.message || "Login failed", variant: "destructive" });
    }
  };

  // Google login — only triggers redirect, result handled in App.jsx
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          You're Welcome!
        </h1>
        <p className="text-muted-foreground mt-1">
          Timeless style and enduring fashion
        </p>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 border py-2 rounded-md font-medium hover:bg-muted transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="h-5 w-5"
        />
        Login with Google
      </button>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">OR</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <CommonForm
        formControls={loginFormControls}
        buttonText="Log in"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

      <div className="flex justify-between text-sm">
        <Link to="/auth/forgot-password" className="hover:underline">
          Forgot password?
        </Link>
        <Link to="/auth/register" className="font-medium hover:underline">
          Sign up for free
        </Link>
      </div>
    </div>
  );
}

export default AuthLogin;