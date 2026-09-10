"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CircleUserRound,
  Search,
  ShieldCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useSelectRoleMutation } from "@/services/authApi";
import { setUser } from "@/store/authSlice";
import { setSkippedRoleSelection } from "@/lib/roleSelection";

const roleOptions = [
  {
    key: "browse" as const,
    icon: Search,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-700",
    title: "Just browsing",
    description:
      "Explore properties and save favourites. You can pick a role anytime.",
    cta: "Continue browsing",
  },
  {
    key: "agent" as const,
    icon: CircleUserRound,
    iconBg: "bg-indigo-50",
    iconColor: "text-[#4161df]",
    title: "List properties as an Agent",
    description:
      "Get an agent workspace with leads, listing and marketing tools.",
    cta: "Get started",
  },
  {
    key: "landlord" as const,
    icon: Building2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    title: "I'm a Landlord",
    description:
      "List and manage your properties with a dedicated landlord dashboard.",
    cta: "Get started",
  },
];

export default function ChooseRolePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectRole] = useSelectRoleMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBrowsing = () => {
    setSkippedRoleSelection();
    router.push("/");
  };

  const handleRoleSelect = async (role: "agent" | "landlord") => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = await selectRole({ role }).unwrap();
      const body = result as any;

      if (body?.user) {
        dispatch(setUser({ user: body.user }));
      }

      toast.success(
        role === "agent"
          ? "Welcome aboard! Your agent workspace is ready."
          : "Welcome! Your landlord dashboard is ready.",
      );

      router.push(
        role === "agent" ? "/agent-dashboard" : "/landlord/dashboard",
      );
    } catch (err) {
      console.error("select-role error:", err);
      const message =
        (err as any)?.data?.message ||
        (err as any)?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      if ((err as any)?.status === 409) {
        router.push("/");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClick = (key: "browse" | "agent" | "landlord") => {
    if (key === "browse") return handleBrowsing();
    return handleRoleSelect(key);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image (matches signup page treatment) */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-white">
        <Image
          src="/chooserole-image.png"
          alt="Property Bulbul RealEstate"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
          priority
          className="object-cover"
        />

        {/* Narrow scrim, just enough to guarantee contrast where the text sits */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-start pt-20 lg:pt-24 px-10 lg:px-14 max-w-[320px] lg:max-w-sm">
          <span className="w-10 h-[3px] rounded-full bg-[#4161df] mb-5" />
          <h1 className="text-3xl lg:text-4xl font-bold leading-[1.15] tracking-tight text-slate-900">
            Make PropertyBulbul
            <br />
            work for you
          </h1>
          <p className="mt-4 text-base lg:text-lg text-slate-600">
            Browse, or unlock agent and landlord tools — it takes a few seconds.
          </p>
        </div>
      </div>

      {/* Right side - role selection */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white">
        <Card className="w-full max-w-sm sm:max-w-lg shadow-xl">
          {/* Back to Home — matches signup page's in-card placement */}
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
          <CardHeader className="relative text-center px-4 sm:px-6 pt-4 sm:pt-6">
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
              What brings you here?
            </CardTitle>
            <CardDescription className="text-sm sm:text-base md:text-lg">
              Choose how you&apos;d like to get started. You can change this
              later by contacting support.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
            {roleOptions.map(
              ({
                key,
                icon: Icon,
                iconBg,
                iconColor,
                title,
                description,
                cta,
              }) => (
                <button
                  key={key}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleClick(key)}
                  className="group flex w-full touch-manipulation items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4161df]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/50 focus-visible:ring-offset-2 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none"
                >
                  <span
                    className={`inline-flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor} transition-transform duration-200 group-hover:scale-105`}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm sm:text-base text-gray-900">
                      {title}
                    </p>
                    <p className="mt-0.5 text-xs sm:text-sm text-gray-600">
                      {description}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#4161df]">
                      {isSubmitting && key !== "browse" ? "Setting up..." : cta}
                      <ArrowRight
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </div>
                </button>
              ),
            )}

            <div className="pt-2 text-center text-xs text-gray-600">
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2 text-[#4161df]">
                  <ShieldCheck className="h-4 w-4 animate-pulse" aria-hidden />
                  Setting up your account…
                </span>
              ) : (
                <>
                  Need help?{" "}
                  <Link
                    href="/contact"
                    className="text-[#4161df] hover:underline font-medium"
                  >
                    Contact us
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
