"use client";

import React, { useState } from "react";

const sections = [
  {
    id: 1,
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 12h8M8 8h8M8 16h5" />
      </svg>
    ),
    title: "What Data We Collect",
    intro:
      "We may collect personal data when you register, submit enquiries, fill forms, or interact with our website.",
    items: [
      "Basic profile information (name, email, phone number)",
      "Property preferences, budgets, and requirement details",
      "Usage activity, device info, browser type, IP address",
      "Cookies & tracking data for analytics and UX improvements",
    ],
  },
  {
    id: 2,
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "How We Use Your Data",
    intro:
      "We only use your data to provide and improve our platform and services.",
    items: [
      "Respond to enquiries and provide requested information",
      "Recommend properties and personalise your experience",
      "Improve website performance and user experience",
      "Communicate updates, offers, and promotional content",
    ],
  },
  {
    id: 3,
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
    title: "Cookies & Tracking",
    intro:
      "We use cookies to store small pieces of information which help improve website performance. You may disable cookies in your browser settings — however, some features may not function properly.",
    items: [],
  },
  {
    id: 4,
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Data Sharing",
    intro:
      "We DO NOT sell your personal data to any third party or advertiser. We may share your data only in the following cases:",
    items: [
      "To comply with legal obligations or government requests",
      "With trusted service providers (e.g. email notifications, hosting)",
    ],
  },
  {
    id: 5,
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Your Rights",
    intro: "You have full rights under applicable Indian data protection laws:",
    items: [
      "Right to access your data",
      "Right to request data deletion",
      "Right to withdraw consent anytime",
    ],
  },
];

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  return (
    <div className="bg-gray-50 min-h-screen mt-20 pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Legal
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
            Privacy Policy
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Last updated: November 8, 2025
          </div>
        </div>

        {/* Intro card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
          <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
            At <span className="font-semibold text-gray-900">Real Estate</span>,
            your privacy is extremely important to us. This Privacy Policy
            explains how we collect, use, and safeguard your personal data when
            you interact with our platform, services, and any other offerings
            managed by us.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => {
            const isOpen = activeSection === section.id;
            return (
              <div
                key={section.id}
                className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? "border-indigo-200 ring-1 ring-indigo-100"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <button
                  onClick={() => setActiveSection(isOpen ? null : section.id)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left group"
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isOpen
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-50 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                    }`}
                  >
                    {section.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">
                        0{section.id}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
                      {section.title}
                    </h2>
                  </div>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isOpen
                        ? "bg-indigo-50 text-indigo-600 rotate-180"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 border-t border-gray-50">
                    <div className="pt-5 space-y-4">
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {section.intro}
                      </p>
                      {section.items.length > 0 && (
                        <ul className="space-y-2.5">
                          {section.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                              <span className="text-sm sm:text-base text-gray-700">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact section */}
        <div className="mt-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-80"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
                  Section 6
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Contact Us</h2>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                If you have any questions regarding this Privacy Policy or want
                to request data changes, please reach out to us.
              </p>
            </div>
            <a
              href="mailto:propertybulbul@gmail.com"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold text-sm px-5 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              propertybulbul@gmail.com
            </a>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-400 text-xs sm:text-sm mt-8">
          By using our website, you consent to this Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
