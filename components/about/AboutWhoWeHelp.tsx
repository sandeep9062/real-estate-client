"use client";

import {
  Users,
  Home,
  TrendingUp,
  Globe,
  Check,
  Building2,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

const BRAND = "#4161df";
const SUPPLY = "#1F8A56";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";

const groups = [
  {
    label: "For people finding a home",
    color: BRAND,
    personas: [
      {
        icon: Home,
        title: "Home buyers",
        benefits: [
          "Verified listings with accurate pricing",
          "Locality insights and sector comparisons",
          "Smart filters to find your perfect match",
        ],
      },
      {
        icon: TrendingUp,
        title: "Property investors",
        benefits: [
          "Market intelligence and price trends",
          "Growth potential analysis by sector",
          "Data-driven investment recommendations",
        ],
      },
      {
        icon: Globe,
        title: "NRIs",
        benefits: [
          "Remote property exploration tools",
          "Verified listings with complete transparency",
          "Dedicated support for NRI buyers",
        ],
      },
    ],
  },
  {
    label: "For people growing a business",
    color: SUPPLY,
    personas: [
      {
        icon: Building2,
        title: "Sellers",
        benefits: [
          "Reach genuine, pre-qualified buyers",
          "Market pricing insights for the best value",
          "Maximum visibility across Tricity",
        ],
      },
      {
        icon: BarChart3,
        title: "Builders and developers",
        benefits: [
          "Showcase projects to targeted audiences",
          "Data-backed market positioning",
          "Lead generation from serious buyers",
        ],
      },
      {
        icon: Users,
        title: "Real estate professionals",
        benefits: [
          "Platform to reach more clients",
          "Market data to advise better",
          "Tools to grow your business",
        ],
      },
    ],
  },
];

export default function AboutWhoWeHelp() {
  return (
    <section className="py-16 sm:py-20 md:py-28 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-12 sm:mb-16"
        >
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <span
              className="w-8 h-[3px] rounded-full"
              style={{ background: BRAND }}
            />
            <span className="text-sm font-medium" style={{ color: BRAND }}>
              Who we help
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-[38px] font-bold leading-[1.15]"
            style={{ color: INK }}
          >
            Built for everyone who makes property decisions
          </h2>
          <p
            className="mt-4 text-[15px] sm:text-base leading-relaxed"
            style={{ color: INK_SOFT }}
          >
            Whether you&apos;re buying your first home or investing in your
            tenth property, PropertyBulbul gives you the intelligence you need.
          </p>
        </motion.div>

        <div className="space-y-10 sm:space-y-12">
          {groups.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: gi * 0.08 }}
            >
              <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: group.color }}
                />
                <span
                  className="text-[13px] sm:text-sm font-medium"
                  style={{ color: group.color }}
                >
                  {group.label}
                </span>
              </div>

              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden"
                style={{ background: "#E5E7F2" }}
              >
                {group.personas.map((item) => (
                  <div
                    key={item.title}
                    className="group bg-white hover:bg-[#FAFAFD] p-6 sm:p-7 transition-colors duration-200"
                  >
                    <span
                      className="flex items-center justify-center w-11 h-11 rounded-full mb-5 transition-colors duration-200"
                      style={{
                        border: `1.5px solid ${group.color}`,
                        color: group.color,
                      }}
                    >
                      <item.icon className="w-5 h-5" strokeWidth={1.8} />
                    </span>
                    <h3
                      className="text-base sm:text-lg font-semibold mb-4"
                      style={{ color: INK }}
                    >
                      {item.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {item.benefits.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2.5 text-[13.5px] sm:text-sm leading-relaxed"
                          style={{ color: INK_SOFT }}
                        >
                          <Check
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: group.color }}
                            strokeWidth={2}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
