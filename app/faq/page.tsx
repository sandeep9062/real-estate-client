"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { ChevronDown, ChevronUp, Send, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQData {
  general: FAQItem[];
  listings: FAQItem[];
}

const FAQPage = () => {
  const [activeTab, setActiveTab] = useState<"general" | "listings">("general");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqData: FAQData = {
    general: [
      {
        q: "How do I search for properties on Property Bulbul?",
        a: "To find properties, visit our homepage and enter your desired location. You can filter the results by location, property type, price range, and much more.",
      },
      {
        q: "How can I view property details?",
        a: "Click on any property card to view comprehensive details including photos, amenities, and pricing.",
      },
      {
        q: "How do I inquire about a property?",
        a: "Use the 'Inquire' button on the property page to contact the owner or agent directly.",
      },
      {
        q: "Can I schedule property visits?",
        a: "Yes, you can request a visit through the property detail page or by messaging the agent.",
      },
      {
        q: "How do I make an offer?",
        a: "Once you've found a property, you can submit an offer directly through our secure platform portal.",
      },
    ],
    listings: [
      {
        q: "How can I submit my listing?",
        a: "You can submit a listing from our homepage: \n• Login: Use your registered mobile number.\n• Add Property: Click 'Submit Listing' in the top right.\n• Assign Agent: Nearby agents will send requests.\n• Agent Approval: Approve via the Property Bulbul app.",
      },
      {
        q: "For how long does my listing stay posted?",
        a: "Standard listings stay active for 30 days unless renewed or sold.",
      },
      {
        q: "Can I submit listings for free?",
        a: "We offer both free basic listings and premium featured options.",
      },
    ],
  };

  // Handle Input Changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Form Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ fullName: "", email: "", message: "" });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <main className="relative bg-gray-50/50">
      {/* BACKGROUND BLOB EFFECT */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 pointer-events-none"
      >
        <div className="blur-[106px] h-48 bg-gradient-to-br from-blue-600 to-purple-400" />
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300" />
      </div>

      {/* HERO SECTION */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-extrabold text-4xl md:text-6xl tracking-tighter text-slate-900"
              >
                Frequently Asked{" "}
                <span className="text-[#4161df]">Questions</span>
              </motion.h1>
              <p className="text-gray-600 text-lg max-w-md mx-auto lg:mx-0">
                Find answers to the most common questions about buying and
                selling in Tricity.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-80 h-80 lg:w-[34rem] lg:h-[34rem] rounded-full border-8 border-white shadow-2xl overflow-hidden"
              >
                <Image
                  src="/faq-page.jpg"
                  alt="FAQ"
                  fill
                  className="object-conver"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ CONTENT SECTION */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* ACCORDION COLUMN */}
          <div className="lg:col-span-2">
            <div className="flex gap-4 mb-10">
              {(["general", "listings"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setOpenIndex(0);
                  }}
                  className={`px-8 py-3 rounded-full font-bold transition-all ${
                    activeTab === tab
                      ? "bg-[#4161df] text-white shadow-lg"
                      : "bg-white text-gray-500 border hover:bg-gray-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {faqData[activeTab].map((item, index) => (
                <div
                  key={`${activeTab}-${index}`}
                  className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="w-full flex justify-between items-center p-5 text-left transition-colors hover:bg-gray-50"
                  >
                    <span
                      className={`text-lg font-bold ${openIndex === index ? "text-[#4161df]" : "text-gray-800"}`}
                    >
                      {item.q}
                    </span>
                    {openIndex === index ? (
                      <ChevronUp size={22} className="text-[#4161df]" />
                    ) : (
                      <ChevronDown size={22} className="text-gray-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 whitespace-pre-line">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* CONTACT FORM COLUMN */}

          {/* <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 sticky top-24">
              <h3 className="text-[#4161df] font-bold text-sm uppercase mb-2">
                Contact Us
              </h3>
              <h2 className="text-2xl font-black mb-6 text-slate-900">
                Still Got Questions?
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4161df] outline-none transition-all"
                />
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4161df] outline-none transition-all"
                />
                <textarea
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="How can we help?"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4161df] outline-none transition-all resize-none"
                />

                <button
                  disabled={isSubmitting}
                  className="w-full bg-[#4161df] text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle2 size={20} /> Sent!
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </aside> */}
        </div>
      </section>
    </main>
  );
};

export default FAQPage;
