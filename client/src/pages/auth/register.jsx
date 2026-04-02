import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import axios from "axios";

import { auth } from "@/firebase/firebase";
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      /* 1️⃣ Create Firebase user */
      const result = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      /* 2️⃣ Set display name */
      await updateProfile(result.user, {
        displayName: formData.userName,
      });

      /* 3️⃣ Get Firebase token */
      const token = await result.user.getIdToken();

      /* 4️⃣ Sync with backend (MongoDB user) */
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/firebase-login`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Account created successfully",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: error.message || "Registration failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>

      <CommonForm
        formControls={registerFormControls}
        buttonText="Sign Up"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthRegister;
