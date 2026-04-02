"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ReceiptIndianRupee,
  Clock,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

const RefundPolicy = () => {
  const router = useRouter();

  const policySections = [
    {
      title: "Cancellation Period",
      content:
        "There may be a specified period during which users can cancel their subscription or request a refund from Property Bulbul. This period is often limited to a certain number of days from the date of purchase.",
    },
    {
      title: "Conditions for Refund",
      content:
        "Refunds may be granted under certain conditions, such as technical issues with the website, errors in property listings, or failure to provide agreed-upon services. The time of your request for refund/credit is no more than 7 days from the time of purchase. Due to some payment gateway limitations, refunds cannot be processed any later than 120 days from purchase.",
    },
    {
      title: "Processing Fees",
      content:
        "Property Bulbul may charge processing fees for refunds. It's important to clarify whether any fees will be deducted from the refund amount.",
    },
    {
      title: "Communication of Issues",
      content:
        "Users may be required to communicate any issues or concerns that led to the refund request to Property Bulbul's customer support before a refund is considered.",
    },
    {
      title: "Partial Refunds",
      content:
        "In certain cases, Property Bulbul may offer partial refunds instead of full refunds, especially if the user has utilized some of the services or features during the subscription period.",
    },
    {
      title: "Non-Refundable Services",
      content:
        "Some services or features provided by Property Bulbul may be explicitly labeled as non-refundable. Users should be aware of such exclusions.",
    },
    {
      title: "Subscription Renewal",
      content:
        "If the refund request is related to a subscription, the policy addresses whether refunds will be provided for automatic subscription renewals.",
    },
    {
      title: "Timely Requests",
      content:
        "Users are required to submit refund requests within the specified timeframe. Late requests may not be considered.",
    },
    {
      title: "Refund Methods",
      content:
        "Refunds will be processed by crediting the original payment method or providing refunds in the form of Property Bulbul website credits.",
    },
  ];

  return (
    <main className="relative pt-20 min-h-screen bg-white">
      {/* HERO HEADER */}
      <section className="bg-slate-50 border-b border-gray-200 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
              Refund Policy
            </h1>
            <p className="text-gray-600 text-lg">
              Everything you need to know about the Property Bulbul refund
              process and conditions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b-2 border-[#4161df] w-fit pb-2">
              Refund Guidelines
            </h2>

            <div className="space-y-10">
              {policySections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#4161df] transition-colors">
                    {section.title}:
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HELP CALLOUT */}
      <section className="container mx-auto px-4 pb-20">
        <div className="bg-[#4161df] rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Need clarification?
            </h2>
            <p className="text-blue-100 opacity-90">
              Our support team is available 24/7 to help you with refund-related
              queries.
            </p>
          </div>
          <button
            onClick={() => router.push("/contact")}
            className="bg-white text-[#4161df] px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all whitespace-nowrap shadow-lg"
          >
            Contact Support
          </button>
        </div>
      </section>
    </main>
  );
};

export default RefundPolicy;
