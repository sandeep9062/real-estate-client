"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "../services/authApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage({
  onBackToLogin,
}: {
  onBackToLogin: () => void;
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleForgotPassword = async (data: ForgotPasswordFormValues) => {
    try {
      const result = await forgotPassword(data.email).unwrap();
      setSuccess(true);
      setError("");
      toast.success("Password reset email sent successfully!");

      // In development mode, show the reset link for testing
      if (result.resetLink) {
        console.log("🔗 Development Mode - Reset Link:", result.resetLink);
        toast.info("Check console for reset link (development mode)");
      }
    } catch (err: any) {
      setError(err.data?.message || "Failed to send reset email");
      toast.error(err.data?.message || "Failed to send reset email");
    }
  };

  if (success) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-gray-100 bg-center bg-cover"
        style={{ backgroundImage: "url('/real-estate-login.jpg')" }}
      >
        <div className="w-full max-w-sm p-6 sm:p-10 mx-4 sm:mx-0 shadow-xl bg-white/30 backdrop-blur-md rounded-xl">
          <h2 className="mb-6 text-3xl font-bold text-center text-gray-900">
            Check Your Email
          </h2>
          <p className="mb-6 text-center text-gray-700">
            We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
          </p>
          <button
            onClick={onBackToLogin}
            className="w-full p-3 text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100 bg-center bg-cover"
      style={{ backgroundImage: "url('/real-estate-login.jpg')" }}
    >
      <div className="w-full max-w-sm p-6 sm:p-10 mx-4 sm:mx-0 shadow-xl bg-white/30 backdrop-blur-md rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-900">
          Forgot Password
        </h2>
        <p className="mb-6 text-center text-gray-700">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}

        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="flex flex-col gap-4"
        >
          <div>
            <input
              type="email"
              placeholder="Email address"
              {...register("email")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700">
          Remember your password?{" "}
          <button
            onClick={onBackToLogin}
            className="text-indigo-600 hover:underline"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
