"use client";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  User,
  FileText,
  MessageSquare,
  Send,
  LucideProps,
} from "lucide-react";
import { useAddContactMutation } from "@/services/contactApi";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./PhoneInput.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { useRecaptcha } from "@/hooks/useRecaptcha";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Replace with real PropertyBulbul contact details
const CONTACT_DETAILS: {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  label: string;
  value: string;
  href?: string;
}[] = [
  // {
  //   icon: Phone,
  //   label: "Call us",
  //   value: "+91 98765 43210",
  //   href: "tel:+919876543210",
  // },
  // {
  //   icon: Mail,
  //   label: "Email us",
  //   value: "hello@propertybulbul.com",
  //   href: "mailto:hello@propertybulbul.com",
  // },
  {
    icon: Clock,
    label: "Working hours",
    value: "Mon – Sat, 10:00 AM to 7:00 PM",
  },
  {
    icon: MapPin,
    label: "Serving",
    value: "Chandigarh, Mohali, Panchkula, Zirakpur & Kharar",
  },
];

export default function ContactPage() {
  const [addContact, { isLoading }] = useAddContactMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });
  const phoneValue = watch("phone");
  const { executeRecaptchaToken } = useRecaptcha();

  const onSubmit = async (data: ContactFormData) => {
    try {
      const recaptchaToken = await executeRecaptchaToken();

      if (!recaptchaToken) {
        toast.error("reCAPTCHA verification failed. Please try again.");
        return;
      }

      await addContact({ ...data, recaptchaToken }).unwrap();
      toast.success("Message sent successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* LEFT SIDE INFO */}
        <div className="flex flex-col justify-center space-y-6 sm:space-y-8 order-2 lg:order-1">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-slate-900">
              Get Personalized{" "}
              <span className="text-[#4161df]">Property Guidance</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Looking for the right property in Chandigarh, Mohali, or
              Panchkula? Whether you are a homebuyer, seller, or investor, our
              team combines deep local market knowledge with verified
              opportunities to help you find the perfect match.
            </p>
          </div>

          {/* DIRECT CONTACT DETAILS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {CONTACT_DETAILS.map((item, i) => {
              const Icon = item.icon;
              const content = (
                <>
                  <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#4161df]/10 text-[#4161df]">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-900 leading-snug break-words">
                      {item.value}
                    </p>
                  </div>
                </>
              );

              return item.href ? (
                <a
                  key={i}
                  href={item.href}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:border-[#4161df]/30 hover:bg-[#4161df]/5 transition-colors"
                >
                  {content}
                </a>
              ) : (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/60"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white p-5 sm:p-7 lg:p-8 rounded-2xl lg:rounded-3xl shadow-xl border border-slate-100 flex flex-col justify-center space-y-5 sm:space-y-6 order-1 lg:order-2">
          <div className="text-center">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">
              Let's Find the Right Opportunity Together
            </h2>
            <p className="text-slate-500 text-xs mt-1.5">
              Tell us your requirements and our team will get back to you with
              personalized options — usually within a few hours.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4"
          >
            {/* NAME */}
            <div className="relative">
              <User
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                {...register("name")}
                placeholder="Full Name *"
                aria-label="Full Name"
                autoComplete="name"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#4161df] focus:border-transparent transition text-sm bg-white"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div className="relative">
              <Mail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="email"
                {...register("email")}
                placeholder="Email Address *"
                aria-label="Email Address"
                autoComplete="email"
                inputMode="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#4161df] focus:border-transparent transition text-sm bg-white"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <PhoneInput
                placeholder="Phone Number *"
                value={phoneValue}
                onChange={(value) =>
                  setValue("phone", value || "", { shouldValidate: true })
                }
                defaultCountry="IN"
                international
                className={`phone-input-field w-full rounded-xl border bg-white transition text-sm focus-within:ring-2 focus-within:ring-[#4161df] focus-within:border-transparent ${
                  errors.phone ? "border-red-300" : "border-slate-200"
                }`}
                numberInputProps={{
                  "aria-label": "Phone Number",
                  className:
                    "w-full py-2.5 pl-2 pr-4 outline-none bg-transparent text-slate-900 placeholder-slate-400 text-sm",
                }}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* SUBJECT */}
            <div className="relative">
              <FileText
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                {...register("subject")}
                placeholder="Subject (Optional)"
                aria-label="Subject"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#4161df] focus:border-transparent transition text-sm bg-white"
              />
            </div>

            {/* MESSAGE */}
            <div className="relative">
              <MessageSquare
                className="absolute left-3.5 top-3.5 text-slate-400"
                size={16}
              />
              <textarea
                {...register("message")}
                placeholder="Write your message... *"
                aria-label="Message"
                rows={3}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#4161df] focus:border-transparent transition text-sm bg-white resize-none"
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-3 rounded-lg font-semibold text-sm text-white shadow-lg bg-[#4161df] hover:bg-[#3451c7] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send size={16} />
              {isSubmitting || isLoading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
