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
import { hasSkippedRoleSelection } from "@/lib/roleSelection";
import PhoneCaptureModal from "@/components/PhoneCaptureModal";
import { useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";

// Validation schema
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const PasswordInput = ({ field }: { field: any }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        className="h-10 sm:h-11 text-sm sm:text-base pr-10"
        {...field}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>
    </div>
  );
};

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  // Redirect target for after the phone modal. Kept in a ref (not state) so
  // the modal's onSave callback can never read a stale value — the redirect
  // is computed inside completeGoogleAuthWithPhone while the modal's save
  // handler is still awaiting it.
  const pendingRedirectRef = useRef("/");
  // Google ID token awaiting a phone number (phone is mandatory for every
  // account). The phone-capture modal completes the auth with it.
  const [pendingGoogleIdToken, setPendingGoogleIdToken] = useState<
    string | null
  >(null);

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
              favRoommateProfiles: result.user.favRoommateProfiles || [],
              bookedVisits: result.user.bookedVisits || [],
              ownedProperties: result.user.ownedProperties || [],
            },
          }),
        );
        toast.success("Logged in successfully!");

        const shouldChooseRole =
          (result.user.role || "user") === "user" && !hasSkippedRoleSelection();
        router.push(shouldChooseRole ? "/choose-role" : "/");
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

  // Authenticate with Google. Phone is mandatory (stored WITH country code),
  // so when a Google user has no phone on file the backend answers with code
  // "PHONE_REQUIRED" and the phone-capture modal completes the auth via
  // completeGoogleAuthWithPhone.
  const authenticateWithGoogle = async (idToken: string) => {
    const apiBaseUrl = getApiBaseUrl();

    const res = await fetch(`${apiBaseUrl}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        idToken,
      }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      if (result.code === "PHONE_REQUIRED") {
        setPendingGoogleIdToken(idToken);
        setShowPhoneModal(true);
        return;
      }
      toast.error(result.message || "Google authentication failed");
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
            favRoommateProfiles: result.user.favRoommateProfiles || [],
            bookedVisits: result.user.bookedVisits || [],
            ownedProperties: result.user.ownedProperties || [],
          },
        }),
      );
      toast.success("Logged in with Google successfully!");

      // A freshly created Google account must ALWAYS pick a role — the
      // "skip" flag only applies to returning users who deliberately
      // deferred role selection on this device.
      const isNewUser = Boolean(result.isNewUser);
      const shouldChooseRole =
        isNewUser ||
        ((result.user.role || "user") === "user" && !hasSkippedRoleSelection());
      router.push(shouldChooseRole ? "/choose-role" : "/");
    } else {
      toast.error("Google authentication failed. Please try again.");
    }
  };

  // Google Sign In success handler
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsGoogleLoading(true);

    try {
      await authenticateWithGoogle(credentialResponse.credential);
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

  // Called by the phone-capture modal — completes Google auth with a phone
  // number (stored with country code, e.g. +919876543210) and logs the user
  // in. The redirect happens in the modal's onSave callback.
  const completeGoogleAuthWithPhone = async (phone: string) => {
    if (!pendingGoogleIdToken) {
      throw new Error(
        "Google session expired. Please sign in with Google again.",
      );
    }

    const apiBaseUrl = getApiBaseUrl();

    const res = await fetch(`${apiBaseUrl}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        idToken: pendingGoogleIdToken,
        phone,
      }),
    });

    const result = await res.json();

    if (!res.ok || !result.success || !result.user) {
      throw new Error(
        result.message || "Couldn't save your phone. Please try again.",
      );
    }

    dispatch(
      loginSuccess({
        user: {
          _id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          image: result.user.image || undefined,
          phone: result.user.phone || phone,
          role: result.user.role || "user",
          favProperties: result.user.favProperties || [],
          favRoommateProfiles: result.user.favRoommateProfiles || [],
          bookedVisits: result.user.bookedVisits || [],
          ownedProperties: result.user.ownedProperties || [],
        },
      }),
    );

    // Pre-compute the redirect so the modal's onSave can route correctly.
    // New accounts always go through role selection, skip flag or not.
    // Written to the ref (not state) — see pendingRedirectRef above.
    const isNewUser = Boolean(result.isNewUser);
    const shouldChooseRole =
      isNewUser ||
      ((result.user.role || "user") === "user" && !hasSkippedRoleSelection());
    pendingRedirectRef.current = shouldChooseRole ? "/choose-role" : "/";
    setPendingGoogleIdToken(null);
  };

  // Phone-capture modal callback — the phone has been saved, resume the
  // redirect. Reads the ref so it always sees the value computed by
  // completeGoogleAuthWithPhone (a state closure here would be stale).
  const proceedAfterPhoneModal = () => {
    setShowPhoneModal(false);
    router.push(pendingRedirectRef.current);
  };

  return (
    <div className="min-h-screen flex">
      {showPhoneModal && (
        <PhoneCaptureModal
          onSubmitPhone={completeGoogleAuthWithPhone}
          onSave={proceedAfterPhoneModal}
        />
      )}
      {/* Left side - Image */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-white">
        <Image
          src="/login-image.png"
          alt="Property Bulbul RealEstate"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover", objectPosition: "75% center" }}
          priority
          className="object-cover"
        />

        {/* Narrow scrim, just enough to guarantee contrast where the text sits */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-start pt-20 lg:pt-24 px-10 lg:px-14 max-w-[300px] lg:max-w-sm">
          <span className="w-10 h-[3px] rounded-full bg-[#4161df] mb-5" />
          <h1 className="text-3xl lg:text-4xl font-bold leading-[1.15] tracking-tight text-slate-900">
            Pick up right
            <br />
            where you left off
          </h1>
          <p className="mt-4 text-base lg:text-lg text-slate-600">
            Your shortlisted homes and saved searches are waiting.
          </p>
        </div>
      </div>
      {/* Right side - Login Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white">
        <Card className="w-full max-w-sm sm:max-w-md shadow-xl">
          <CardHeader className="text-center px-4 sm:px-6 pt-4 sm:pt-6">
            {/* Back to Home */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
              <Link
                href="/"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Back to home"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>
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
                        <PasswordInput field={field} />
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
