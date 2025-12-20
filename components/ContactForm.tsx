

"use client";
import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  User,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useAddContactMutation } from "@/services/contactApi";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./PhoneInput.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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

  const onSubmit = async (data: ContactFormData) => {
    try {
      await addContact(data).unwrap();
      toast.success("Message sent successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className=" py-12 sm:py-18">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 grid lg:grid-cols-2 gap-12">
        {/* LEFT SIDE INFO */}
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
            Contact Our{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Real-Estate Experts
            </span>
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
            Have questions about buying, renting, or investing? Our dedicated team is here to provide guidance and support.
          </p>

          <div className="space-y-5">
            {[
              { icon: Phone, text: "+91 97299 07448" },
              { icon: Mail, text: "bulbulproperty@gmail.com" },
              { icon: MapPin, text: "145, Sector-15, Chandigarh, India" },
              { icon: Clock, text: "Mon - Sat, 9 AM - 7 PM" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full shadow-sm flex items-center justify-center">
                  <item.icon className="text-blue-600" size={20} />
                </div>
                <span className="text-gray-700 text-lg sm:text-base">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center">
            Send us a Message
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* NAME */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register("name")}
                placeholder="Full Name"
                className="w-full pl-14 pr-4 py-3 rounded-2xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 transition"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                {...register("email")}
                placeholder="Email Address"
                className="w-full pl-14 pr-4 py-3 rounded-2xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 transition"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* PHONE */}
            <div>
              <PhoneInput
                placeholder="Phone Number"
                value={phoneValue}
                onChange={(value) => setValue("phone", value || "")}
                className="w-full p-3 rounded-2xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 transition"
                defaultCountry="IN"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            {/* SUBJECT */}
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register("subject")}
                placeholder="Subject (Optional)"
                className="w-full pl-14 pr-4 py-3 rounded-2xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* MESSAGE */}
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 text-gray-400" />
              <textarea
                {...register("message")}
                placeholder="Write your message..."
                rows={4}
                className="w-full pl-14 pr-4 py-3 rounded-2xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 transition"
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-3 rounded-2xl font-semibold text-lg text-white shadow-lg hover:opacity-95 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting || isLoading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
