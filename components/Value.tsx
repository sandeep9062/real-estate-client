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
    <section id="value" className="py-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
        {/* left image */}
        <div className="flex-1">
          <div className="border-8 border-gray-200 rounded-lg overflow-hidden">
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
        <div className="flex-1 flex flex-col gap-2">
          <span className="text-orange-900 font-semibold uppercase tracking-wider">
            Our Value
          </span>
          <span className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Value We Give to You
          </span>
          <span className="text-gray-600 text-sm leading-relaxed">
            We are ready to help by providing the best services for you.
            <br />
            We believe a good place to live can make your life better.
          </span>

          <Accordion
            allowMultipleExpanded={false}
            preExpanded={[0]}
            className="mt-6"
          >
            {data.map((item: any, i: number) => {
              return (
                <AccordionItem
                  key={i}
                  uuid={i}
                  className="border border-gray-300 rounded-lg mb-4 overflow-hidden"
                >
                  <AccordionItemHeading>
                    <AccordionItemButton className="flex items-center justify-between gap-3 cursor-pointer bg-white p-4">
                      {/* left icon */}
                      <div className="p-2 bg-[#eeeeff] rounded">
                        {item.icon}
                      </div>

                      <span className="flex-1 font-semibold text-black text-base">
                        {item.heading}
                      </span>

                      <MdOutlineArrowDropDown
                        className="text-blue-600"
                        size={22}
                      />
                    </AccordionItemButton>
                  </AccordionItemHeading>

                  <AccordionItemPanel>
                    <p className="text-gray-500 text-sm px-4 pb-4">
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
