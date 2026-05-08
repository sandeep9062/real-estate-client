"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const VerifyEmailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "pending"
  >("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (email) {
      setStatus("pending");
      setMessage(
        `Account created successfully! You can now sign in with your credentials.`,
      );
    } else {
      setStatus("error");
      setMessage("No email provided");
    }
  }, [email]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50">
      <Card className="w-full max-w-sm sm:max-w-md shadow-xl">
        <CardHeader className="text-center px-4 sm:px-6 pt-4 sm:pt-6">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Image
              src="/propertybulbul.png"
              alt="Property Bulbul"
              width={144}
              height={48}
              className="object-contain w-28 sm:w-32 md:w-36"
              priority
            />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
            Account Created
          </CardTitle>
          <CardDescription className="text-sm sm:text-base md:text-lg">
            Your account is ready
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            {status === "loading" && (
              <>
                <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-blue-600" />
                <p className="text-center text-sm sm:text-base text-gray-600">
                  Verifying your email...
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
                <p className="text-center text-sm sm:text-base text-green-600 font-medium">
                  {message}
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                >
                  Continue to Login
                </Button>
              </>
            )}

            {status === "pending" && (
              <>
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
                <p className="text-center text-sm sm:text-base text-gray-600 font-medium">
                  {message}
                </p>
                <div className="space-y-2 w-full">
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                  >
                    Go to Login
                  </Button>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-600" />
                <p className="text-center text-sm sm:text-base text-red-600 font-medium">
                  {message}
                </p>
                <div className="space-y-2 w-full">
                  <Button
                    onClick={() => router.push("/signup")}
                    variant="outline"
                    className="w-full h-10 sm:h-11 text-sm sm:text-base"
                  >
                    Back to Signup
                  </Button>
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                  >
                    Go to Login
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const VerifyEmailPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50">
          <Card className="w-full max-w-sm sm:max-w-md shadow-xl">
            <CardHeader className="text-center px-4 sm:px-6 pt-4 sm:pt-6">
              <div className="flex justify-center mb-4">
                <Image
                  src="/propertybulbul.png"
                  alt="Property Bulbul"
                  width={144}
                  height={48}
                  className="object-contain w-28 sm:w-32 md:w-36"
                  priority
                />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                Account Status
              </CardTitle>
              <CardDescription className="text-sm sm:text-base md:text-lg">
                Loading...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmailPage;
