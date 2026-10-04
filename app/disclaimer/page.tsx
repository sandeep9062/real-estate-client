"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, Info } from "lucide-react";

const DisclaimerPage = () => {
  const disclaimerSections = [
    {
      id: 1,
      title: "Accuracy of Information",
      content:
        "While Property Bulbul strives for accurate and up-to-date property listings, it doesn't guarantee the completeness of such information. Users should verify independently.",
    },
    {
      id: 2,
      title: "Third-party Listings",
      content:
        "Property Bulbul features content from third parties, such as brokers and developers, for which it holds no responsibility regarding accuracy or authenticity.",
    },
    {
      id: 3,
      title: "No Liability",
      content:
        "Property Bulbul is not liable for any losses, claims, or damages arising from the use of the platform or transactions conducted through it.",
    },
    {
      id: 4,
      title: "Content Ownership",
      content:
        "All content on Property Bulbul belongs to the company or third-party providers. Property Bulbul disclaims responsibility for the accuracy of user-generated content and advises users to verify such content before relying on it.",
    },
    {
      id: 5,
      title: "Non-Endorsement",
      content:
        "Listing of properties or services on Property Bulbul does not signify endorsement or recommendation. Users should do their own research before engaging with any property, service, or vendor.",
    },
    {
      id: 6,
      title: "Transactional Risks",
      content:
        "Property Bulbul is a platform for property listings and services and does not participate in or guarantee the outcomes of transactions. Any risks or disputes related to transactions must be handled between the parties involved.",
    },
    {
      id: 7,
      title: "Limitation of Services",
      content:
        "Property Bulbul provides services as a platform for facilitating property searches and related activities. It does not act as a real estate agent or broker, and its services are limited to online facilitation.",
    },
    {
      id: 8,
      title: "Modification of Terms",
      content:
        "Property Bulbul reserves the right to update or modify these disclaimers at any time without prior notice. Users are encouraged to review these terms regularly to stay informed.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* HEADER SECTION */}
      <section className="bg-gradient-to-r from-gray-100 to-blue-300  pt-30 py-20 text-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <ShieldAlert size={400} strokeWidth={0.5} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 text-blue-900 font-bold uppercase tracking-widest text-sm mb-4">
              <AlertTriangle size={18} />
              Legal Information
            </div>
            <h1 className="font-heading text-4xl md:text-5xl mb-6">
              Disclaimer
            </h1>
            <p className=" text-gray-900 text-lg leading-relaxed">
              **Property Bulbul** is the registered identity of our realty
              services, and is used throughout this platform to represent our
              property listing and facilitation services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* INTRO BOX */}
            <div className="bg-blue-50 border-l-4 border-[#4161df] p-6 mb-12 rounded-r-xl shadow-sm">
              <div className="flex gap-4">
                <Info className="text-[#4161df] shrink-0" />
                <p className="text-slate-700 text-sm md:text-base italic">
                  By using **Property Bulbul**, users agree to these terms and
                  acknowledge that Property Bulbul is not liable for
                  transactions or third-party interactions conducted through the
                  platform.
                </p>
              </div>
            </div>

            {/* DISCLAIMER LIST */}
            <div className="grid grid-cols-1 gap-12">
              {disclaimerSections.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-5">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 font-bold text-sm shrink-0 group-hover:bg-[#4161df] group-hover:text-white transition-colors">
                      {item.id}
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#4161df] transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed md:text-lg">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* FOOTER NOTE */}
            <div className="mt-20 pt-10 border-t border-slate-200 text-center">
              <p className="text-slate-400 text-sm">
                Last Updated: February 2026 • © {new Date().getFullYear()}{" "}
                Property Bulbul. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DisclaimerPage;
