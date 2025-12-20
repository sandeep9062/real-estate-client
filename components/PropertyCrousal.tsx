"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const categories = [
  {
    title: "Residential Apartment",
    count: "3,000+ Properties",
    image: "/apartment.jpg",
    bg: "bg-[#FFF6E5]",
  },
  {
    title: "Independent House / Villa",
    count: "1,700+ Properties",
    image: "/villa.jpg",
    bg: "bg-[#F1FAFF]",
  },
  {
    title: "Residential Land",
    count: "1,300+ Properties",
    image: "/land.jpg",
    bg: "bg-[#E6F7ED]",
  },
  {
    title: "Independent / Builder Floor",
    count: "410+ Properties",
    image: "/builder-floor.jpg",
    bg: "bg-[#FFF6E5]",
  },
  {
    title: "Farm House",
    count: "50+ Properties",
    image: "/farmhouse.jpg",
    bg: "bg-[#F1FAFF]",
  },
  {
    title: "1 RK / Studio Apartment",
    count: "20+ Properties",
    image: "/studio.jpg",
    bg: "bg-[#E6F7ED]",
  },
  {
    title: "Serviced Apartments",
    count: "5 Properties",
    image: "/serviced.jpg",
    bg: "bg-[#FFF6E5]",
  },
];

export default function PropertyCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = dir === "left" ? -350 : 350;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-semibold text-slate-900">
        Apartments, Villas and more
      </h2>
      <p className="text-slate-500 mt-1">in Chandigarh</p>

      <div className="relative mt-8">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow"
        >
          <ChevronLeft />
        </button>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
        >
          {categories.map((item, i) => (
            <div
              key={i}
              className={`min-w-[280px] md:min-w-[320px] rounded-2xl overflow-hidden ${item.bg}`}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800">
                  {item.title}
                </h3>
                <p className="text-slate-500 mt-1">{item.count}</p>
              </div>

              <div className="relative h-52 w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
