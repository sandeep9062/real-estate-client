"use client";

import React from "react";
import { MdCall } from "react-icons/md";
import { BsFillChatDotsFill, BsWhatsapp } from "react-icons/bs";
import { HiChatBubbleBottomCenter } from "react-icons/hi2";
import Image from "next/image";

// Constants for easy maintenance
const PHONE_NUMBER = "9729907448";
const WHATSAPP_MESSAGE =
  "Hi, Property Bulbul ! I'm interested in your real estate services in the Tricity area and would like to know more about available properties.";

interface ModeProps {
  icon: React.ReactNode;
  title: string;
  detail: string;
  buttonLabel: string;
}

const ContactMode = ({ icon, title, detail, buttonLabel }: ModeProps) => {
  const handleContactAction = () => {
    switch (title) {
      case "Call":
        window.location.href = `tel:${PHONE_NUMBER}`;
        break;
      case "Chat":
        // Direct WhatsApp integration
        const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
        window.open(waUrl, "_blank");
        break;
      case "Video Call":
        // Usually redirects to a meeting link or WhatsApp Video
        window.open(`https://wa.me/${PHONE_NUMBER}`, "_blank");
        break;
      case "Message":
        // SMS link
        window.location.href = `sms:${PHONE_NUMBER}?body=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-50 text-[#4161df] rounded-lg group-hover:bg-[#4161df] group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg text-gray-900">{title}</span>
          <span className="text-gray-500 text-sm">{detail}</span>
        </div>
      </div>
      <button
        onClick={handleContactAction}
        className="w-full bg-gray-50 hover:bg-[#4161df] hover:text-white text-[#4161df] font-semibold py-2.5 rounded-lg transition-all duration-300 border border-indigo-100 hover:border-[#4161df]"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

const Contact = () => {
  return (
    <section id="contact-us" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Content & Actions */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="text-[#4161df] font-bold uppercase tracking-widest text-sm">
                Connect with us
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 mt-2 mb-4">
                We're Here to Help You Find Home
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
                Whether you're looking for a luxury flat in Mohali or a
                commercial space in Chandigarh, our experts are just a click
                away.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <ContactMode
                icon={<MdCall size={24} />}
                title="Call"
                detail="+91 97299 07448"
                buttonLabel="Call Now"
              />
              <ContactMode
                icon={<BsWhatsapp size={24} />}
                title="Chat"
                detail="WhatsApp Support"
                buttonLabel="Start Chat"
              />
              <ContactMode
                icon={<BsFillChatDotsFill size={24} />}
                title="Video Call"
                detail="Schedule a Meet"
                buttonLabel="Book Slot"
              />
              <ContactMode
                icon={<HiChatBubbleBottomCenter size={24} />}
                title="Message"
                detail="Direct SMS"
                buttonLabel="Send SMS"
              />
            </div>
          </div>

          {/* Right Side: Image with Decorative Border */}
          <div className="relative group flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl border-[10px] border-white ring-1 ring-gray-200">
              <Image
                src="/chandigarh.jpg"
                alt="Chandigarh Real Estate"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay for a more professional look */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm font-medium opacity-90">
                  Serving Tricity Since 2022
                </p>
                <p className="text-xl font-bold">
                  Chandigarh • Mohali • Panchkula
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
