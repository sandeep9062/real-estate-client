"use client";

import {
  IconShieldCheck,
  IconBrandWhatsapp,
  IconRobot,
  IconCircleCheck,
  IconCircleX,
} from "@tabler/icons-react";

export default function WhyPropertyBulbul() {
  const tableData = [
    {
      feature: "Data Freshness",
      bulbul: true,
      giants: false,
      desc: "Sourced daily from active Tricity networks.",
    },
    {
      feature: "Listing Quality",
      bulbul: true,
      giants: false,
      desc: "AI-enhanced professional descriptions.",
    },
    {
      feature: "Response Speed",
      bulbul: true,
      giants: false,
      desc: "Direct WhatsApp connect—no middleman.",
    },
    {
      feature: "Brochure Support",
      bulbul: true,
      giants: false,
      desc: "Instant high-quality PDF downloads.",
    },
    {
      feature: "Spam Protection",
      bulbul: true,
      giants: false,
      desc: "Your number isn't sold to telemarketers.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-blue-600 font-semibold tracking-wide uppercase text-xs sm:text-sm mb-3">
            Why Choose Us
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-black bg-clip-text text-transparent leading-tight">
            Why Tricity Trusts PropertyBulbul
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
            Big portals have millions of listings, but we have the{" "}
            <span className="font-semibold text-gray-700">right ones</span>. We
            built the "Bulbul" way for the modern Chandigarh, Mohali, and
            Zirakpur market.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mb-16 sm:mb-20">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-8">
            The Direct Comparison
          </h3>

          {/* Mobile Compact Layout */}
          <div className="md:hidden bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
              <div className="flex-1">Feature</div>
              <div className="w-10 text-center text-[#4161df]">PB</div>
              <div className="w-10 text-center">Others</div>
            </div>
            {tableData.map((item) => (
              <div
                key={item.feature}
                className="flex items-start px-3 py-2.5 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <span className="text-sm font-semibold text-gray-800 leading-tight block">
                    {item.feature}
                  </span>
                  <span className="text-[11px] text-gray-400 leading-snug block mt-0.5">
                    {item.desc}
                  </span>
                </div>
                <div className="w-10 flex justify-center pt-0.5 shrink-0">
                  <IconCircleCheck className="text-green-600" size={18} />
                </div>
                <div className="w-10 flex justify-center pt-0.5 shrink-0">
                  <IconCircleX className="text-red-500" size={18} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-[#4161df] uppercase tracking-wider border-b border-gray-200">
                      PropertyBulbul
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      99acres / MagicBricks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {tableData.map((item, index) => (
                    <tr
                      key={item.feature}
                      className={`hover:bg-gray-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800 text-base">
                            {item.feature}
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            {item.desc}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <IconCircleCheck
                              className="text-green-600"
                              size={20}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <IconCircleX className="text-red-500" size={20} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1 */}
          <div className="group relative bg-white rounded-xl p-4 sm:p-5 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-blue-500/30">
                <IconShieldCheck className="text-white" size={22} />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                No "Ghost" Listings
              </h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Tired of calling about sold properties? We pull data from active
                WhatsApp networks. If it's on Bulbul, it's real.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-white rounded-xl p-4 sm:p-5 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-green-500/30">
                <IconBrandWhatsapp className="text-white" size={22} />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                WhatsApp-First
              </h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Skip the 10-field forms and spam. Connect directly with brokers
                via WhatsApp. Get brochures instantly.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-white rounded-xl p-4 sm:p-5 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-violet-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-violet-500/30">
                <IconRobot className="text-white" size={22} />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                AI-Powered Detail
              </h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Our Gemini-powered AI turns messy notes into professional
                brochures. Get the full story before you step outside.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
