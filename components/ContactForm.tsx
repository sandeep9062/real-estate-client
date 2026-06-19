"use client";
import React from "react";
import {
  Mail,
  Phone,
  Clock,
  User,
  FileText,
  MessageSquare,
  Send,
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
    <div className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* LEFT SIDE INFO */}
        <div className="flex flex-col justify-center space-y-6 sm:space-y-8 order-2 lg:order-1">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-slate-900">
            Contact Our{" "}
            <span className="text-[#4161df]">Real-Estate Experts</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed">
            Have questions about buying, renting, or investing? Our dedicated
            team is here to provide guidance and support.
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white p-6 sm:p-10 lg:p-12 rounded-2xl lg:rounded-3xl shadow-xl border border-slate-100 flex flex-col justify-center space-y-6 sm:space-y-8 order-1 lg:order-2">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              Send us a Message
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              We'll get back to you within 24 hours
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* NAME */}
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                {...register("name")}
                placeholder="Full Name *"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#4161df] focus:border-transparent transition text-sm bg-white"
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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="email"
                {...register("email")}
                placeholder="Email Address *"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#4161df] focus:border-transparent transition text-sm bg-white"
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
                onChange={(value) => setValue("phone", value || "")}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-[#4161df] focus:border-transparent transition text-sm bg-white"
                defaultCountry="IN"
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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                {...register("subject")}
                placeholder="Subject (Optional)"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#4161df] focus:border-transparent transition text-sm bg-white"
              />
            </div>

            {/* MESSAGE */}
            <div className="relative">
              <MessageSquare
                className="absolute left-4 top-4 text-slate-400"
                size={18}
              />
              <textarea
                {...register("message")}
                placeholder="Write your message... *"
                rows={4}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#4161df] focus:border-transparent transition text-sm bg-white resize-none"
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
              className="w-full py-3.5 rounded-xl font-semibold text-base text-white shadow-lg bg-[#4161df] hover:bg-[#3451c7] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {isSubmitting || isLoading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
