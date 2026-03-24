import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);

      toast({
        title: "Password reset link sent",
        description: "Check your email to reset your password.",
      });

      setEmail("");
    } catch (err) {
      toast({
        title: "Failed to send reset link",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Forgot your password?</h1>
        <p className="text-muted-foreground mt-2">
          Enter your email and we’ll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={submitHandler} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary py-2 font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {/* Footer */}
      <div className="text-center text-sm">
        <Link to="/auth/login" className="hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
