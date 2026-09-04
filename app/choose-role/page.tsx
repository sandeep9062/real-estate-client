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
import { toast } from "@/hooks/use-toast";
import { useSelectRoleMutation } from "@/services/authApi";
import { setUser } from "@/store/authSlice";
import { setSkippedRoleSelection } from "@/lib/roleSelection";

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

      // Update Redux + localStorage immediately so the frontend role gate
      // (AgentDashboardGate / LandlordDashboardGate) flips without waiting
      // for a token refresh.
      if (body?.user) {
        dispatch(setUser({ user: body.user }));
      }

      toast.success(
        role === "agent"
          ? "Welcome aboard! Your agent workspace is ready."
          : "Welcome! Your landlord dashboard is ready.",
      );

      router.push(role === "agent" ? "/agent-dashboard" : "/landlord/dashboard");
    } catch (err) {
      console.error("select-role error:", err);
      const message =
        (err as any)?.data?.message ||
        (err as any)?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      // If the endpoint says they already picked a role (409), send them where
      // they belong rather than trapping them on this screen.
      if ((err as any)?.status === 409) {
        router.push("/");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image (matches signup/login split-screen layout) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        <Image
          src="/login-page.jpg"
          alt="Property Bulbul RealEstate"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Make PropertyBulbul work for you
            </h1>
            <p className="text-base lg:text-lg">
              Browse, or unlock agent and landlord tools — it takes a few seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - role cards */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <Image
              src="/propertybulbul.png"
              alt="Property Bulbul"
              width={140}
              height={50}
              className="object-contain w-28 sm:w-32 md:w-36"
              priority
            />
          </div>

          <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">
            What brings you to PropertyBulbul?
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
            Choose how you'd like to get started. You can change this later by
            contacting support.
          </p>

          <div className="mt-8 grid gap-4">
            {/* Just browsing */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleBrowsing}
              className="group flex touch-manipulation items-start gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/30 hover:shadow-md active:scale-[0.99]"
            >
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <Search className="h-6 w-6" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900">Just browsing</p>
                <p className="mt-0.5 text-sm text-gray-600">
                  Explore properties and save favourites. You can pick a role
                  anytime.
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#4161df]">
                  Continue browsing
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </div>
            </button>

            {/* List as an Agent */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleRoleSelect("agent")}
              className="group flex touch-manipulation items-start gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/40 hover:shadow-md active:scale-[0.99]"
            >
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4161df]">
                <CircleUserRound className="h-6 w-6" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900">
                  List properties as an Agent
                </p>
                <p className="mt-0.5 text-sm text-gray-600">
                  Get an agent workspace with leads, listing and marketing tools.
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#4161df]">
                  {isSubmitting ? "Setting up..." : "Get started"}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </div>
            </button>

            {/* I'm a Landlord */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleRoleSelect("landlord")}
              className="group flex touch-manipulation items-start gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/40 hover:shadow-md active:scale-[0.99]"
            >
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Building2 className="h-6 w-6" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900">I&apos;m a Landlord</p>
                <p className="mt-0.5 text-sm text-gray-600">
                  List and manage your properties with a dedicated landlord
                  dashboard.
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#4161df]">
                  {isSubmitting ? "Setting up..." : "Get started"}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </div>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-gray-600">
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
        </div>
      </div>
    </div>
  );
}