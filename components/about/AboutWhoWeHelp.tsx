"use client";

import {
  Users,
  Home,
  TrendingUp,
  Globe,
  CheckCircle2,
  Building2,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

const BRAND = "#4161df";

export default function AboutWhoWeHelp() {
  return (
    <section className="py-16 sm:py-20 md:py-28 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase mb-4"
            style={{ color: BRAND }}
          >
            <Users className="w-4 h-4" />
            Who We Help
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Built for Everyone Who{" "}
            <span className="text-indigo-600">Makes Property Decisions</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
            Whether you are buying your first home or investing in your tenth
            property, PropertyBulbul gives you the intelligence you need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Home className="w-6 h-6 text-white" />,
              title: "Home Buyers",
              benefits: [
                "Verified listings with accurate pricing",
                "Locality insights and sector comparisons",
                "Smart filters to find your perfect match",
              ],
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-white" />,
              title: "Property Investors",
              benefits: [
                "Market intelligence and price trends",
                "Growth potential analysis by sector",
                "Data-driven investment recommendations",
              ],
            },
            {
              icon: <Globe className="w-6 h-6 text-white" />,
              title: "NRIs",
              benefits: [
                "Remote property exploration tools",
                "Verified listings with complete transparency",
                "Dedicated support for NRI buyers",
              ],
            },
            {
              icon: <Building2 className="w-6 h-6 text-white" />,
              title: "Sellers",
              benefits: [
                "Reach genuine, pre-qualified buyers",
                "Market pricing insights for the best value",
                "Maximum visibility across Tricity",
              ],
            },
            {
              icon: <BarChart3 className="w-6 h-6 text-white" />,
              title: "Builders and Developers",
              benefits: [
                "Showcase projects to targeted audiences",
                "Data-backed market positioning",
                "Lead generation from serious buyers",
              ],
            },
            {
              icon: <Users className="w-6 h-6 text-white" />,
              title: "Real Estate Professionals",
              benefits: [
                "Platform to reach more clients",
                "Market data to advise better",
                "Tools to grow your business",
              ],
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: BRAND }}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <ul className="space-y-2.5">
                  {item.benefits.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-gray-600 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-500" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
