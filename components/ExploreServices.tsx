"use client";

import Link from "next/link";
import {
  FaHome,
  FaBuilding,
  FaWarehouse,
  FaBed,
  FaMapMarkedAlt,
  FaBullhorn,
} from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";

const services = [
  {
    title: "Buying a Property",
    desc: "Apartments, villas, plots and more",
    icon: FaHome,
  },
  {
    title: "Renting a Home",
    desc: "Flats, builder floors, houses",
    icon: FaBuilding,
  },
  {
    title: "Commercial Properties",
    desc: "Shops, offices & warehouses",
    icon: FaWarehouse,
  },
  {
    title: "PG & Co-Living",
    desc: "Verified PGs & shared living",
    icon: FaBed,
  },
  {
    title: "Plots / Land",
    desc: "Residential & agricultural land",
    icon: FaMapMarkedAlt,
  },
  {
    title: "Post Property",
    desc: "Sell or rent faster",
    icon: FaBullhorn,
    badge: "FREE",
  },
];

export default function ExploreServices() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 my-20">
      <div className="max-w-7xl mx-auto  p-8 sm:p-12  border-[#5d77d6]   bg-[#4161df]   rounded-xl border-8    ">
        
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
          Explore our services
        </h2>

        {/* Services Card */}
        <div className="bg-white rounded-2xl shadow-md border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <Link
                key={index}
                href="/services"
                className="
                  group flex items-center gap-4 p-6
                  border-b lg:border-b-0
                  lg:border-r last:border-r-0
                  hover:bg-neutral-50 transition
                "
              >
                {/* Icon */}
                <div
                  className="
                    w-12 h-12 rounded-xl
                    flex items-center justify-center
                    bg-blue-50 text-[#4161df]
                    group-hover:bg-[#4161df]
                    group-hover:text-white
                    transition
                  "
                >
                  <Icon size={22} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900">
                      {service.title}
                    </h3>

                    {service.badge && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-neutral-500 mt-1">
                    {service.desc}
                  </p>
                </div>

                {/* Arrow */}
                <HiArrowRight
                  size={20}
                  className="
                    text-neutral-400
                    group-hover:text-[#4161df]
                    group-hover:translate-x-1
                    transition
                  "
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
