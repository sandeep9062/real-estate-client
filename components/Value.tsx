"use client";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";

import { MdOutlineArrowDropDown } from "react-icons/md";
import { HiShieldCheck } from "react-icons/hi";
import { MdCancel, MdAnalytics } from "react-icons/md";
import Image from "next/image";

const data = [
  {
    icon: <HiShieldCheck />,
    heading: "Verified Properties with Zero Risk",
    detail:
      "Every property in Chandigarh, Mohali, Panchkula, Zirakpur, and Kharar is thoroughly verified to ensure you get 100% safe, legal, and dispute-free deals.",
  },
  {
    icon: <MdCancel />,
    heading: "No Price Manipulation",
    detail:
      "Say goodbye to brokers inflating rates. PropertyBulbul provides transparent, real-time property prices across the entire Tricity market.",
  },
  {
    icon: <MdAnalytics />,
    heading: "Accurate Market Insights",
    detail:
      "Get data-backed analytics on the Tricity real estate market so you can buy, sell, or invest smarter with clear trends, demand, and pricing insights.",
  },
];

const Value = () => {
  return (
    <section id="value" className="py-8 sm:py-10 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10">
        {/* left image */}
        <div className="flex-1 w-full md:w-auto order-first md:order-first">
          <div className="border-4 sm:border-6 md:border-8 border-gray-200 rounded-lg overflow-hidden max-w-sm sm:max-w-md mx-auto md:mx-0">
            <Image
              src="/value-image.png"
              alt="value"
              width={600}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* right */}
        <div className="flex-1 flex flex-col gap-2 w-full">
          <span className="text-orange-900 font-semibold uppercase tracking-wider text-xs sm:text-sm">
            Our Value
          </span>
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            Value We Give to You
          </span>
          <span className="text-gray-600 text-sm sm:text-base leading-relaxed">
            We are ready to help by providing the best services for you.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            We believe a good place to live can make your life better.
          </span>

          <Accordion
            allowMultipleExpanded={false}
            preExpanded={[0]}
            className="mt-4 sm:mt-6"
          >
            {data.map((item: any, i: number) => {
              return (
                <AccordionItem
                  key={i}
                  uuid={i}
                  className="border border-gray-300 rounded-lg mb-3 sm:mb-4 overflow-hidden"
                >
                  <AccordionItemHeading>
                    <AccordionItemButton className="flex items-center justify-between gap-2 sm:gap-3 cursor-pointer bg-white p-3 sm:p-4">
                      {/* left icon */}
                      <div className="p-1.5 sm:p-2 bg-[#eeeeff] rounded text-lg sm:text-xl">
                        {item.icon}
                      </div>

                      <span className="flex-1 font-semibold text-black text-sm sm:text-base">
                        {item.heading}
                      </span>

                      <MdOutlineArrowDropDown
                        className="text-[#4161df] flex-shrink-0"
                        size={20}
                      />
                    </AccordionItemButton>
                  </AccordionItemHeading>

                  <AccordionItemPanel>
                    <p className="text-gray-500 text-xs sm:text-sm px-3 sm:px-4 pb-3 sm:pb-4">
                      {item.detail}
                    </p>
                  </AccordionItemPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Value;
