"use client";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState,
} from "react-accessible-accordion";

import { MdOutlineArrowDropDown } from "react-icons/md";
import { HiShieldCheck } from "react-icons/hi";
import { MdCancel, MdAnalytics } from "react-icons/md";
import Image from "next/image";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";
const TINT_LINE = "#DCE1F7";

const data = [
  {
    icon: <HiShieldCheck />,
    heading: "Verified properties, zero risk",
    detail:
      "Every property across Chandigarh, Mohali, Panchkula, Zirakpur, and Kharar is checked for legal and title issues, so you close with confidence, not crossed fingers.",
  },
  {
    icon: <MdCancel />,
    heading: "No price manipulation",
    detail:
      "Real-time, transparent pricing across the Tricity market, so no broker can quietly inflate what you pay.",
  },
  {
    icon: <MdAnalytics />,
    heading: "Market insights you can act on",
    detail:
      "Data-backed trends on demand and pricing, so you buy, sell, or invest on evidence, not guesswork.",
  },
];

const Value = () => {
  return (
    <section id="value" className="py-14 sm:py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10 md:gap-14">
        {/* left image */}
        <div className="flex-1 w-full md:w-auto order-first md:order-first">
          <div className="relative max-w-sm sm:max-w-md mx-auto md:mx-0">
            <div
              aria-hidden
              className="absolute -top-6 -left-6 w-28 h-28 rounded-full"
              style={{ background: TINT_BG }}
            />
            <div
              className="relative rounded-2xl overflow-hidden border"
              style={{ borderColor: TINT_LINE }}
            >
              <Image
                src="/value-image.png"
                alt="A PropertyBulbul team member reviewing a verified property listing"
                width={600}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* right */}
        <div className="flex-1 flex flex-col w-full">
          <div className="flex items-center gap-2.5 mb-4">
            <span
              className="w-8 h-[3px] rounded-full"
              style={{ background: BRAND }}
            />
            <span className="text-sm font-medium" style={{ color: BRAND }}>
              Our value
            </span>
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.15] mb-3"
            style={{ color: INK }}
          >
            The value we bring to every deal
          </h2>

          <p
            className="text-[15px] sm:text-base leading-relaxed mb-6 max-w-[52ch]"
            style={{ color: INK_SOFT }}
          >
            We believe a good home starts with good information. Here&apos;s how
            we back that up.
          </p>

          <Accordion allowMultipleExpanded={false} preExpanded={["0"]}>
            {data.map((item, i) => (
              <AccordionItem
                key={i}
                uuid={String(i)}
                className="rounded-xl mb-3 sm:mb-4 overflow-hidden border"
                style={{ borderColor: TINT_LINE }}
              >
                <AccordionItemState>
                  {({ expanded }) => (
                    <>
                      <AccordionItemHeading>
                        <AccordionItemButton className="flex items-center justify-between gap-3 cursor-pointer bg-white p-4">
                          <div
                            className="flex items-center justify-center w-9 h-9 rounded-full text-lg shrink-0 transition-colors duration-200"
                            style={{
                              border: `1.5px solid ${BRAND}`,
                              color: BRAND,
                              background: expanded ? TINT_BG : "transparent",
                            }}
                          >
                            {item.icon}
                          </div>

                          <span
                            className="flex-1 font-semibold text-sm sm:text-base"
                            style={{ color: INK }}
                          >
                            {item.heading}
                          </span>

                          <MdOutlineArrowDropDown
                            className="shrink-0 transition-transform duration-200"
                            style={{
                              color: BRAND,
                              transform: expanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
                            size={20}
                          />
                        </AccordionItemButton>
                      </AccordionItemHeading>

                      <AccordionItemPanel>
                        <p
                          className="text-[13px] sm:text-sm leading-relaxed px-4 pb-4"
                          style={{ color: INK_SOFT }}
                        >
                          {item.detail}
                        </p>
                      </AccordionItemPanel>
                    </>
                  )}
                </AccordionItemState>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Value;
