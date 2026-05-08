"use client";

import React, { useState, ChangeEvent, FormEvent, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  Search,
  Home,
  FileText,
  HelpCircle,
  Shield,
  Mail,
  Phone,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

const FAQPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqCategories: FAQCategory[] = [
    {
      id: "general",
      label: "General",
      icon: <HelpCircle size={16} />,
      items: [
        {
          q: "How do I search for properties on Property Bulbul?",
          a: "To find properties, visit our homepage and enter your desired location. You can filter the results by location, property type, price range, and much more. Our advanced search engine makes it easy to find exactly what you're looking for in Tricity.",
        },
        {
          q: "How can I view property details?",
          a: "Click on any property card to view comprehensive details including high-resolution photos, full amenities list, pricing breakdown, location map, nearby landmarks, and direct contact information for the owner or agent.",
        },
        {
          q: "How do I inquire about a property?",
          a: "Use the 'Inquire' button on the property page to contact the owner or agent directly. You can also use our contact form or call our support team for immediate assistance.",
        },
        {
          q: "Can I schedule property visits?",
          a: "Yes, you can request a visit through the property detail page or by messaging the agent directly. Our team will coordinate with the property owner to arrange a convenient time for your site visit.",
        },
        {
          q: "How do I make an offer?",
          a: "Once you've found a property, you can submit an offer directly through our secure platform portal. Our team will guide you through the negotiation process and help you prepare the necessary documentation.",
        },
        {
          q: "Is Property Bulbul free to use?",
          a: "Yes, browsing properties and using basic search features is completely free. For premium services like featured listings or advanced analytics, we offer affordable paid plans.",
        },
      ],
    },
    {
      id: "listings",
      label: "Listings",
      icon: <FileText size={16} />,
      items: [
        {
          q: "How can I submit my listing?",
          a: "You can submit a listing from our homepage: \n• Login: Use your registered mobile number.\n• Add Property: Click 'Submit Listing' in the top right.\n• Assign Agent: Nearby agents will send requests.\n• Agent Approval: Approve via the Property Bulbul app.",
        },
        {
          q: "For how long does my listing stay posted?",
          a: "Standard listings stay active for 30 days unless renewed or sold. Premium listings get extended visibility for 60 days with additional features like featured placement and social media promotion.",
        },
        {
          q: "Can I submit listings for free?",
          a: "We offer both free basic listings and premium featured options. Free listings include essential details and photos, while premium options give you enhanced visibility, virtual tours, and priority support.",
        },
        {
          q: "How do I edit or remove my listing?",
          a: "You can edit or remove your listing anytime from your dashboard. Log in to your account, navigate to 'My Listings', and use the edit or delete options for any active listing.",
        },
        {
          q: "What documents do I need to list my property?",
          a: "You'll need property ownership documents, approved building plans (if applicable), recent photographs, property tax receipts, and valid ID proof. Our team will guide you through the complete documentation process.",
        },
      ],
    },
    {
      id: "buying",
      label: "Buying",
      icon: <Home size={16} />,
      items: [
        {
          q: "What is the process of buying a property?",
          a: "The buying process includes: 1) Property search and shortlisting, 2) Site visits and inspection, 3) Price negotiation, 4) Legal verification of documents, 5) Agreement signing and token payment, 6) Home loan processing (if needed), 7) Sale deed registration, and 8) Possession handover.",
        },
        {
          q: "How do I verify a property's legal status?",
          a: "We recommend checking: title deed, encumbrance certificate, approved building plan, occupancy certificate, tax receipts, and RERA registration. Our team provides free legal verification assistance for all properties.",
        },
        {
          q: "What are the additional costs involved?",
          a: "Additional costs include stamp duty (typically 5-7% of property value), registration charges (1-2%), GST (if applicable), maintenance deposit, legal fees, and home loan processing charges if applicable.",
        },
        {
          q: "Can NRIs buy property in Tricity?",
          a: "Yes, NRIs can buy residential and commercial properties in India. You'll need a valid Indian passport, PAN card, and OCI/PIO card if applicable. We provide complete assistance for NRI buyers including remote property visits.",
        },
      ],
    },
    {
      id: "selling",
      label: "Selling",
      icon: <Shield size={16} />,
      items: [
        {
          q: "How do I sell my property quickly?",
          a: "To sell quickly: 1) Price your property competitively, 2) Use high-quality photos and videos, 3) Highlight unique features, 4) Keep the property clean and presentable, 5) Be flexible with visits, 6) Use premium listing options for better visibility.",
        },
        {
          q: "What factors affect my property's value?",
          a: "Key factors include: location and neighborhood, property size and condition, age of construction, nearby amenities, market trends, connectivity, floor level (for apartments), and current demand in that specific area.",
        },
        {
          q: "Do you help with property valuation?",
          a: "Yes, we provide free property valuation based on current market trends, recent sales in your area, property condition, location advantages, and upcoming infrastructure developments. Our experts ensure you get the best price.",
        },
      ],
    },
  ];

  // Filter categories based on search query
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const results: {
      categoryId: string;
      categoryLabel: string;
      items: FAQItem[];
    }[] = [];
    const query = searchQuery.toLowerCase();

    faqCategories.forEach((cat) => {
      const matched = cat.items.filter(
        (item) =>
          item.q.toLowerCase().includes(query) ||
          item.a.toLowerCase().includes(query),
      );
      if (matched.length > 0) {
        results.push({
          categoryId: cat.id,
          categoryLabel: cat.label,
          items: matched,
        });
      }
    });

    return results;
  }, [searchQuery, faqCategories]);

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
    setFormData({ fullName: "", email: "", phone: "", message: "" });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="relative min-h-screen bg-white">
      {/* BACKGROUND GRADIENT EFFECT */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-30 pointer-events-none"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-[#4161df] to-purple-400" />
        <div className="blur-[106px] h-40 bg-gradient-to-r from-cyan-400 to-sky-300" />
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-24 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#4161df] text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-4 sm:mb-6"
            >
              <HelpCircle size={14} />
              Got Questions? We've Got Answers
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-slate-900"
            >
              Frequently Asked <span className="text-[#4161df]">Questions</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl"
            >
              Find answers to the most common questions about buying, selling,
              and renting properties in Tricity (Chandigarh, Panchkula, Mohali).
            </motion.p>

            {/* SEARCH BAR */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 sm:mt-8 w-full max-w-xl relative"
            >
              <div className="relative group">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4161df] transition-colors"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setOpenIndex(null);
                  }}
                  placeholder="Search for answers... (e.g., 'buying process', 'listing')"
                  className="w-full pl-11 pr-4 py-3.5 sm:py-4 bg-white border-2 border-gray-200 rounded-xl text-sm sm:text-base outline-none transition-all focus:border-[#4161df] focus:ring-4 focus:ring-[#4161df]/10 shadow-sm hover:shadow-md"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FAQ CONTENT SECTION ===== */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* ACCORDION COLUMN */}
          <div className="lg:col-span-2">
            {filteredResults ? (
              // SEARCH RESULTS
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Search size={16} className="text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Search results for &ldquo;
                    <span className="font-semibold text-gray-700">
                      {searchQuery}
                    </span>
                    &rdquo;
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-auto text-xs text-[#4161df] hover:underline"
                  >
                    Clear search
                  </button>
                </div>

                {filteredResults.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                    <HelpCircle
                      size={48}
                      className="mx-auto text-gray-300 mb-4"
                    />
                    <h3 className="text-lg font-bold text-gray-700 mb-2">
                      No results found
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Try different keywords or browse by category
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-sm text-[#4161df] font-semibold hover:underline"
                    >
                      Browse all questions →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {filteredResults.map((result) => (
                      <div key={result.categoryId}>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                          {result.categoryLabel}
                        </h3>
                        <div className="space-y-3">
                          {result.items.map((item, idx) => (
                            <div
                              key={`search-${result.categoryId}-${idx}`}
                              className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="p-5">
                                <h4 className="font-semibold text-gray-800 mb-2">
                                  {item.q}
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {item.a}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // CATEGORY TABS + ACCORDION
              <>
                {/* CATEGORY TABS */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10">
                  {faqCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveTab(cat.id);
                        setOpenIndex(0);
                      }}
                      className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                        activeTab === cat.id
                          ? "bg-[#4161df] text-white shadow-lg shadow-[#4161df]/20 scale-105"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-[#4161df]/30 hover:text-[#4161df] hover:bg-blue-50/50"
                      }`}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* ACCORDION ITEMS */}
                {faqCategories
                  .filter((cat) => cat.id === activeTab)
                  .map((cat) => (
                    <motion.div
                      key={cat.id}
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-3 sm:space-y-4"
                    >
                      {cat.items.map((item, index) => (
                        <motion.div
                          key={`${cat.id}-${index}`}
                          variants={itemVariants}
                          className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <button
                            onClick={() =>
                              setOpenIndex(openIndex === index ? null : index)
                            }
                            className={`w-full flex justify-between items-center gap-3 p-4 sm:p-5 text-left transition-colors ${
                              openIndex === index
                                ? "bg-gradient-to-r from-blue-50/50 to-white"
                                : "hover:bg-gray-50/80"
                            }`}
                          >
                            <span
                              className={`text-sm sm:text-base font-semibold leading-snug pr-2 ${
                                openIndex === index
                                  ? "text-[#4161df]"
                                  : "text-gray-800"
                              }`}
                            >
                              {item.q}
                            </span>
                            <span
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                openIndex === index
                                  ? "bg-[#4161df] text-white rotate-180"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {openIndex === index ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </span>
                          </button>

                          <AnimatePresence>
                            {openIndex === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                                  <div className="border-t border-gray-100 pt-4">
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                                      {item.a}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </motion.div>
                  ))}
              </>
            )}
          </div>

          {/* ===== FAQ SIDEBAR IMAGE ===== */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <Image
                  src="/faq-page.jpg"
                  alt="Frequently Asked Questions about Property Bulbul"
                  width={500}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-lg mb-1">
                    Need More Help?
                  </h3>
                  <p className="text-white/80 text-sm">
                    Our team is available 24/7 to assist you
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-14 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4161df] to-[#2d4bc7]" />
        <div aria-hidden="true" className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-cyan-300 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              Still Have Questions?
            </h2>
            <p className="text-blue-100 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Our real estate experts are here to help you with any queries. Get
              in touch with us today for personalized assistance.
            </p>
            <div className="mt-5 sm:mt-6 md:mt-8 flex flex-wrap gap-3 sm:gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-[#4161df] px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl inline-flex items-center gap-2"
              >
                Contact Us <ArrowRight size={18} />
              </Link>
              <Link
                href="/properties"
                className="border-2 border-white text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-white/10 transition-all"
              >
                Browse Properties
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default FAQPage;

/* ===== STAT CARD ===== */
const StatCard = ({
  number,
  label,
  icon,
  delay,
}: {
  number: string;
  label: string;
  icon: React.ReactNode;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
  >
    <div className="w-10 h-10 mx-auto rounded-lg bg-[#4161df]/10 flex items-center justify-center text-[#4161df] mb-3">
      {icon}
    </div>
    <div className="text-2xl sm:text-3xl font-extrabold text-[#4161df]">
      {number}
    </div>
    <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
      {label}
    </div>
  </motion.div>
);
