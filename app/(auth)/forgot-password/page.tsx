"use client";

import Image from "next/image";
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
import { useState } from "react";

// Validation schema
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  // Submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Get the API base URL
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        (typeof window !== "undefined" &&
        (window.location.hostname === "www.propertybulbul.com" ||
          window.location.hostname === "propertybulbul.com")
          ? "https://api.propertybulbul.com/api"
          : "http://localhost:9000/api");

      const response = await fetch(`${apiBaseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
        }),
      });

      const raw = await response.text();
      let result: { success?: boolean; message?: string } = {};
      try {
        result = raw ? JSON.parse(raw) : {};
      } catch {
        toast.error("Server returned an invalid response. Check API URL and try again.");
        return;
      }

      if (response.ok && result.success) {
        setEmailSent(true);
        toast.success("Password reset email sent! Check your inbox.");
      } else {
        toast.error(
          result.message || "Failed to send reset email. Please try again.",
        );
      }
    } catch (error: any) {
      toast.error(
        error.message || "Failed to send reset email. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-50 to-teal-100 relative overflow-hidden">
        <Image
          src="/forgot-password-page.jpg"
          alt="Property Bulbul Password Reset"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Reset Your Password
            </h1>
            <p className="text-base lg:text-lg">
              We'll help you get back into your account
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Reset Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50">
        <Card className="w-full max-w-sm sm:max-w-md shadow-xl">
          <CardHeader className="text-center px-4 sm:px-6 pt-4 sm:pt-6">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Image
                src="/propertybulbul.png"
                alt="Property Bulbul"
                width={140}
                height={50}
                className="object-contain w-28 sm:w-32 md:w-36"
                priority
              />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-sm sm:text-base md:text-lg">
              {emailSent
                ? "Check your email for the reset link"
                : "Enter your email address and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
            {emailSent ? (
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                  <p className="text-green-700 text-sm sm:text-base">
                    If an account with that email exists, a password reset link
                    has been sent. Please check your inbox and spam folder.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="block w-full h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-center leading-[36px] sm:leading-[44px] text-sm sm:text-base"
                >
                  Back to Login
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3 sm:space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john.doe@example.com"
                            className="h-10 sm:h-11 text-sm sm:text-base"
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
                    className="w-full h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base"
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </Form>
            )}
            {!emailSent && (
              <div className="text-center text-xs sm:text-sm text-gray-600">
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

export default ForgotPasswordPage;
