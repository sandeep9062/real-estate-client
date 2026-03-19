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
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/authSlice";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

// Validation schema
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  // Get API base URL
  const getApiBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== "undefined" &&
      (window.location.hostname === "www.propertybulbul.com" ||
        window.location.hostname === "propertybulbul.com")
        ? "https://api.propertybulbul.com/api"
        : "http://localhost:9000/api")
    );
  };

  // Submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const apiBaseUrl = getApiBaseUrl();

      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.code === "RATE_LIMITED") {
          toast.error("Too many login attempts. Please try again later.");
        } else {
          toast.error(result.message || "Failed to login.");
        }
        return;
      }

      if (result.user) {
        dispatch(
          loginSuccess({
            user: {
              _id: result.user._id,
              name: result.user.name,
              email: result.user.email,
              image: result.user.image || undefined,
              phone: result.user.phone || "",
              role: result.user.role || "user",
              favProperties: result.user.favProperties || [],
              bookedVisits: result.user.bookedVisits || [],
              ownedProperties: result.user.ownedProperties || [],
            },
          }),
        );
        toast.success("Logged in successfully!");
        router.push("/");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign In success handler
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsGoogleLoading(true);

    try {
      const apiBaseUrl = getApiBaseUrl();

      const res = await fetch(`${apiBaseUrl}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          idToken: credentialResponse.credential,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        toast.error(result.message || "Google authentication failed");
        setIsGoogleLoading(false);
        return;
      }

      if (result.user) {
        dispatch(
          loginSuccess({
            user: {
              _id: result.user._id,
              name: result.user.name,
              email: result.user.email,
              image: result.user.image || undefined,
              phone: result.user.phone || "",
              role: result.user.role || "user",
              favProperties: result.user.favProperties || [],
              bookedVisits: result.user.bookedVisits || [],
              ownedProperties: result.user.ownedProperties || [],
            },
          }),
        );
        toast.success("Logged in with Google successfully!");
        router.push("/");
      } else {
        toast.error("Google authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("Google auth error:", error);
      toast.error("Failed to authenticate with Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Google Sign In error handler
  const handleGoogleError = () => {
    toast.error("Google Sign In failed. Please try again.");
    setIsGoogleLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        <Image
          src="/login-page.jpg"
          alt="Property Bulbul RealEstate"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Welcome to Property Bulbul
            </h1>
            <p className="text-base lg:text-lg">
              Your journey to success starts here
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login Card */}
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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm sm:text-base md:text-lg">
              Sign in to Property Bulbul
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
            {/* Google Sign In Button */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text="continue_with"
                width={320}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="h-10 sm:h-11 text-sm sm:text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-xs sm:text-sm text-[#4161df] hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 sm:h-11 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-colors shadow-sm text-sm sm:text-base"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="text-center text-xs sm:text-sm text-[#4161df]">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-[#4161df] hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
