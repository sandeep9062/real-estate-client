"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Scale,
  FileText,
  UserCheck,
  Globe,
  Building2,
  CreditCard,
  Copyright,
  Ban,
  Link2,
  ShieldCheck,
  UserX,
  Gavel,
  RefreshCw,
  Mail,
  Info,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface TermsSection {
  icon: LucideIcon;
  title: string;
  content: string;
  items: string[];
  email?: string;
}

const TermsAndConditions = () => {
  const router = useRouter();

  const sections: TermsSection[] = [
    {
      icon: FileText,
      title: "1 — Acceptance of Terms",
      content:
        "These Terms & Conditions (these Terms) govern your access to and use of the PropertyBulbul website, mobile experience, and related services (together, the Platform). By accessing, browsing, registering on, or posting content on the Platform, you confirm that you have read, understood, and agree to be bound by these Terms, along with our Privacy Policy, Refund Policy, and Disclaimer.",
      items: [
        "These Terms form a legally binding agreement between you and PropertyBulbul.",
        "If you do not agree with any part of these Terms, please discontinue use of the Platform.",
        "You are responsible for ensuring that your use of the Platform complies with all applicable laws.",
      ],
    },
    {
      icon: UserCheck,
      title: "2 — Eligibility & Account Registration",
      content:
        "To create an account or post listings, you must be at least 18 years of age and legally capable of entering into binding contracts under the Indian Contract Act, 1872. You agree to provide true, accurate, current, and complete information at all times.",
      items: [
        "Keep your login credentials confidential — you are responsible for all activity carried out through your account.",
        "One account per person or business, unless we authorise otherwise in writing.",
        "Notify us immediately at propertybulbul@gmail.com of any unauthorised use of your account.",
        "We may verify your identity, contact details, or business documents (such as RERA registration, GSTIN, or PAN) before enabling certain features.",
      ],
    },
    {
      icon: Globe,
      title: "3 — Use of the Platform",
      content:
        "PropertyBulbul provides an online marketplace that connects property seekers with owners, landlords, agents, and builders. We act only as a discovery and facilitation platform and are not a party to any transaction between users.",
      items: [
        "You may use the Platform for lawful, personal, or genuine business purposes related to real estate.",
        "Automated access, scraping, crawling, or bulk data extraction without our prior written consent is prohibited.",
        "You must not attempt to bypass, disable, or interfere with the security or access-control features of the Platform.",
        "Free features are offered on a fair-use basis; excessive or abusive usage may be limited or suspended.",
      ],
    },
    {
      icon: Building2,
      title: "4 — Property Listings & User Content",
      content:
        "Users who post properties, requirements, projects, or other content are solely responsible for the accuracy, legality, and completeness of what they publish. PropertyBulbul is an intermediary within the meaning of Section 2(1)(w) of the Information Technology Act, 2000, and claims safe-harbour protection under applicable law.",
      items: [
        "You must have lawful authority (ownership, power of attorney, or written mandate) to list a property.",
        "Listings must reflect true and current information — price, area, availability, ownership, and approvals.",
        "We may review, edit, re-categorise, or remove any listing that appears misleading, duplicated, or non-compliant.",
        "Independent verification of any listing, document, or claim is strongly recommended before entering into a transaction.",
      ],
    },
    {
      icon: CreditCard,
      title: "5 — Payments, Subscriptions & Refunds",
      content:
        "Certain features (such as paid listings, featured placement, or subscription plans) require payment. All prices are displayed on our Pricing page and are inclusive or exclusive of taxes as indicated there. Payments are processed through third-party payment gateways.",
      items: [
        "Paid plans are billed for the period selected at the time of purchase and are non-transferable.",
        "Refunds, cancellations, and credits are governed by our Refund Policy.",
        "We are not responsible for delays or failures caused by banking or payment-gateway systems.",
        "We may revise pricing or plan features with reasonable notice; changes apply from the next billing cycle.",
      ],
    },
    {
      icon: Copyright,
      title: "6 — Intellectual Property",
      content:
        "All content on the Platform — including the PropertyBulbul name and logo, text, graphics, page design, software, and curated data — is owned by or licensed to PropertyBulbul and is protected under applicable intellectual-property laws.",
      items: [
        "You receive a limited, revocable, non-exclusive licence to use the Platform for its intended purpose.",
        "You may not copy, reproduce, modify, distribute, or create derivative works without our prior written consent.",
        "By posting content, you grant us a non-exclusive, royalty-free licence to display and promote that content on the Platform.",
        "You confirm that your content does not infringe the rights of any third party.",
      ],
    },
    {
      icon: Ban,
      title: "7 — Prohibited Activities",
      content:
        "To keep the Platform safe and trustworthy, the following activities are strictly prohibited.",
      items: [
        "Posting fake, fraudulent, or duplicate listings, or listings for properties that are not genuinely available.",
        "Publishing content that is defamatory, obscene, harassing, discriminatory, or that infringes another person's privacy.",
        "Impugning the religious or communal feelings of any person or class, or posting content that is otherwise unlawful.",
        "Impersonating PropertyBulbul, its employees, or any other person or business.",
        "Misusing enquiry forms to send spam, promotions, or unsolicited communication.",
        "Violating any applicable law, including the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and the Consumer Protection (E-Commerce) Rules, 2020.",
      ],
    },
    {
      icon: Link2,
      title: "8 — Third-Party Links & Services",
      content:
        "The Platform may contain links to third-party websites, tools, or services (for example, payment gateways, map providers, or partner listings). Such links are provided for convenience only.",
      items: [
        "We do not control and are not responsible for the content, policies, or practices of third parties.",
        "Your dealings with any third party are solely between you and that party.",
      ],
    },
    {
      icon: Scale,
      title: "9 — Limitation of Liability",
      content:
        "The Platform is provided on an as-is and as-available basis. We do not guarantee uninterrupted availability, error-free operation, or any specific outcome (including sale, purchase, or rental).",
      items: [
        "PropertyBulbul is not a party to any transaction between users and does not guarantee the conduct of any user.",
        "We are not liable for indirect, incidental, special, or consequential losses, including lost profits or opportunities.",
        "To the maximum extent permitted by law, our total aggregate liability arising out of or relating to the Platform shall not exceed the total amount paid by you to PropertyBulbul in the three (3) months preceding the claim.",
        "Nothing in these Terms limits any liability that cannot be limited under applicable law.",
      ],
    },
    {
      icon: ShieldCheck,
      title: "10 — Indemnification",
      content:
        "You agree to indemnify, defend, and hold harmless PropertyBulbul and its directors, employees, and partners from and against any claims, losses, liabilities, damages, and expenses (including reasonable legal fees) arising out of or related to:",
      items: [
        "Your use of the Platform or breach of these Terms.",
        "Any content you post, including claims that it infringes third-party rights.",
        "Any dispute between you and another user or third party.",
      ],
    },
    {
      icon: UserX,
      title: "11 — Suspension & Termination",
      content:
        "We may restrict, suspend, or terminate your access to the Platform, or remove any content, at our discretion and without prior notice, if we believe you have violated these Terms or applicable law.",
      items: [
        "You may stop using the Platform and request account deletion at any time.",
        "Provisions relating to intellectual property, liability, indemnification, and governing law survive termination.",
      ],
    },
    {
      icon: Gavel,
      title: "12 — Governing Law & Jurisdiction",
      content:
        "These Terms are governed by and construed in accordance with the laws of India. Subject to applicable law, the courts at Chandigarh shall have exclusive jurisdiction over any dispute arising out of or in connection with the Platform or these Terms.",
      items: [
        "Before pursuing legal action, both parties agree to attempt to resolve disputes amicably by writing to propertybulbul@gmail.com.",
      ],
    },
    {
      icon: RefreshCw,
      title: "13 — Changes to These Terms",
      content:
        "We may update these Terms from time to time to reflect changes in our services, technology, or legal requirements. The revised Terms will be posted on this page with an updated last-updated date.",
      items: [
        "Material changes will be notified through the Platform or by email where practicable.",
        "Your continued use of the Platform after changes are posted constitutes acceptance of the revised Terms.",
      ],
    },
    {
      icon: Mail,
      title: "14 — Contact & Grievance Redressal",
      content:
        "If you have questions, concerns, or complaints about these Terms or the Platform, please reach out to our Grievance Officer designated under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021:",
      items: [],
      email: "propertybulbul@gmail.com",
    },
  ];

  return (
    <main className="relative min-h-screen bg-white">
      {/* HERO HEADER */}
      <section className="bg-gradient-to-r from-gray-100 to-blue-300 pt-30 py-20 text-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Scale size={400} strokeWidth={0.5} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 text-blue-900 font-bold uppercase tracking-widest text-sm mb-4">
              <FileText size={18} />
              Legal Agreement
            </div>
            <h1 className="font-heading text-4xl md:text-5xl mb-6">
              Terms & Conditions
            </h1>
            <p className="text-gray-900 text-lg leading-relaxed">
              Welcome to <strong>PropertyBulbul</strong>. These Terms &
              Conditions set out the rules for using our real estate platform.
              Please read them carefully before listing, browsing, or
              transacting through the Platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* LAST UPDATED */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-400 text-sm mt-6 mb-2">
            Last updated: September 28, 2026
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* INTRO BOX */}
            <div className="bg-blue-50 border-l-4 border-[#4161df] p-6 mb-12 rounded-r-xl shadow-sm">
              <div className="flex gap-4">
                <Info className="text-[#4161df] shrink-0" />
                <p className="text-slate-700 text-sm md:text-base italic">
                  By using PropertyBulbul, you agree to these Terms &
                  Conditions. They work alongside our Privacy Policy, Refund
                  Policy, and Disclaimer, so please review all of them together
                  before using the Platform.
                </p>
              </div>
            </div>

            {/* SECTIONS */}
            <div className="space-y-14">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-5">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-500 shrink-0 group-hover:bg-[#4161df] group-hover:text-white transition-all duration-300">
                      <section.icon size={22} />
                    </span>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#4161df] transition-colors">
                        {section.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed text-base md:text-lg mb-3">
                        {section.content}
                      </p>

                      {section.items.length > 0 && (
                        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-slate-600 text-base md:text-lg">
                          {section.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}

                      {section.email && (
                        <p className="text-slate-900 font-semibold text-base md:text-lg mt-2">
                          Email:{" "}
                          <span className="text-[#4161df]">{section.email}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* RELATED POLICIES */}
            <div className="mt-16 bg-slate-50 rounded-2xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Related Policies
              </h2>
              <div className="flex flex-wrap gap-3">
                {[
                  ["Privacy Policy", "/privacy-policy"],
                  ["Refund Policy", "/refund"],
                  ["Disclaimer", "/disclaimer"],
                ].map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium text-[#4161df] hover:bg-[#4161df] hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* FOOTER NOTE */}
            <div className="mt-20 pt-10 border-t border-slate-200 text-center">
              <p className="text-slate-400 text-sm">
                Last Updated: September 2026 • © {new Date().getFullYear()}{" "}
                Property Bulbul. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HELP CALLOUT */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#4161df] rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Need clarification on our Terms?
              </h2>
              <p className="text-blue-100 opacity-90">
                Our team is happy to help you understand your rights and
                responsibilities on PropertyBulbul.
              </p>
            </div>
            <button
              onClick={() => router.push("/contact")}
              className="bg-white text-[#4161df] px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all whitespace-nowrap shadow-lg"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TermsAndConditions;
