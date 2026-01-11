"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useResetPasswordMutation } from "@/services/authApi";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link");
    }
  }, [token]);

  const handleResetPassword = async (data: ResetPasswordFormValues) => {
    if (!token) return;

    try {
      const result = await resetPassword({ token, password: data.password }).unwrap();

      setSuccess(true);
      setError("");
      toast.success("Password reset successful!");
    } catch (err: any) {
      const message = err?.data?.message || err.message || "Failed to reset password";
      setError(message);
      toast.error(message);
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
            Password Reset Successful
          </h2>
          <p className="mb-6 text-center text-gray-700">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="w-full p-3 text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Go to Login
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
          Reset Your Password
        </h2>
        <p className="mb-6 text-center text-gray-700">
          Enter your new password below.
        </p>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}

        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="flex flex-col gap-4"
        >
          <div>
            <input
              type="password"
              placeholder="New Password"
              {...register("password")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              {...register("confirmPassword")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700"
            disabled={isLoading || !token}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700">
          <button
            onClick={() => router.push('/auth')}
            className="text-indigo-600 hover:underline"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
