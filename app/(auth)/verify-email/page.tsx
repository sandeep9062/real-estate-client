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
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Account Created
          </CardTitle>
          <CardDescription className="text-lg">
            Your account is ready
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="text-center text-gray-600">
                  Verifying your email...
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="h-12 w-12 text-green-600" />
                <p className="text-center text-green-600 font-medium">
                  {message}
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continue to Login
                </Button>
              </>
            )}

            {status === "pending" && (
              <>
                <CheckCircle className="h-12 w-12 text-green-600" />
                <p className="text-center text-gray-600 font-medium">
                  {message}
                </p>
                <div className="space-y-2 w-full">
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Go to Login
                  </Button>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="h-12 w-12 text-red-600" />
                <p className="text-center text-red-600 font-medium">
                  {message}
                </p>
                <div className="space-y-2 w-full">
                  <Button
                    onClick={() => router.push("/signup")}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Signup
                  </Button>
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Account Status
              </CardTitle>
              <CardDescription className="text-lg">Loading...</CardDescription>
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
