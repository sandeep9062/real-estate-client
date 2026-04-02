"use client";

import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 pt-20 min-h-screen py-8 sm:py-10 md:py-12">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4 sm:mb-6 tracking-tight">
          Privacy Policy
        </h1>

        <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-10">
          Last updated: November 8, 2025
        </p>

        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6 sm:mb-8">
          At Real Estate, your privacy is extremely important to us. This
          Privacy Policy explains how we collect, use, and safeguard your
          personal data when you interact with our platform, services, and any
          other offerings managed by us.
        </p>

        {/* SECTION */}
        <section className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
            1 — What Data We Collect
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            We may collect personal data when you register, submit enquiries,
            fill forms, or interact with our website.
          </p>

          <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700">
            <li>Basic profile information (name, email, phone number)</li>
            <li>Property preferences, budgets, and requirement details</li>
            <li>Usage activity, device info, browser type, IP address</li>
            <li>Cookies & tracking data for analytics and UX improvements</li>
          </ul>
        </section>

        {/* SECTION */}
        <section className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
            2 — How We Use Your Data
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            We only use your data to provide and improve our platform and
            services.
          </p>

          <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700">
            <li>Respond to enquiries and provide requested information</li>
            <li>Recommend properties and personalize your experience</li>
            <li>Improve website performance and user experience</li>
            <li>Communicate updates, offers, and promotional content</li>
          </ul>
        </section>

        {/* SECTION */}
        <section className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
            3 — Cookies & Tracking
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            We use cookies to store small pieces of information which help
            improve website performance. You may disable cookies in your browser
            settings — however, some features may not function properly.
          </p>
        </section>

        {/* SECTION */}
        <section className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
            4 — Data Sharing
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            We DO NOT sell your personal data to any third party or advertiser.
            We may share your data only in the following cases:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700">
            <li>To comply with legal obligations or government requests</li>
            <li>
              With trusted service providers (ex: email notifications, hosting)
            </li>
          </ul>
        </section>

        {/* SECTION */}
        <section className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
            5 — Your Rights
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            You have full rights under applicable Indian data protection laws:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700">
            <li>Right to access your data</li>
            <li>Right to request data deletion</li>
            <li>Right to withdraw consent anytime</li>
          </ul>
        </section>

        {/* SECTION */}
        <section className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
            6 — Contact Us
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            If you have any questions regarding this Privacy Policy or want to
            request data changes, please contact us:
          </p>
          <p className="text-sm sm:text-base text-gray-900 font-medium">
            Email: propertybulbul@gmail.com
          </p>
        </section>

        <p className="text-gray-500 text-xs sm:text-sm">
          By using our website, you consent to our Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
