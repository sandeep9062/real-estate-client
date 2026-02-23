"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Suspense, useState } from "react";

// Validation schema
const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      if (!token) {
        toast.error("Invalid reset token. Please try again.");
        return;
      }

      // Get the API base URL
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        (typeof window !== "undefined" &&
        (window.location.hostname === "www.propertybulbul.com" ||
          window.location.hostname === "propertybulbul.com")
          ? "https://api.propertybulbul.com/api"
          : "http://localhost:9000/api");

      const response = await fetch(`${apiBaseUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token: token,
          password: values.password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSuccess(true);
        toast.success(
          "Password reset successfully! You can now sign in with your new password.",
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(
          result.message || "Failed to reset password. Please try again.",
        );
      }
    } catch (error: any) {
      toast.error(
        error.message || "Failed to reset password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Invalid Reset Link
            </CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:underline font-medium"
              >
                Request a new reset link
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-orange-50 to-red-100 relative overflow-hidden">
        <Image
          src="/mcdi4.jpeg"
          alt="Property Bulbul Password Reset"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Secure Your Account</h1>
            <p className="text-lg">Create a strong new password</p>
          </div>
        </div>
      </div>

      {/* Right side - Reset Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Reset Password
            </CardTitle>
            <CardDescription className="text-lg">
              {isSuccess
                ? "Password reset successfully!"
                : "Enter your new password below"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isSuccess ? (
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-green-700">
                    Your password has been reset successfully. Redirecting to
                    login...
                  </p>
                </div>
                <Link
                  href="/login"
                  className="block w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-center leading-[44px]"
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          New Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Confirm New Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              </Form>
            )}
            {!isSuccess && (
              <div className="text-center text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
