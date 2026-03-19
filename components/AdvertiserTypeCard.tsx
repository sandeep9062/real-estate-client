"use client";

import { ArrowRight } from "lucide-react";

const advertisers = [
  {
    title: "Dealer",
    count: "5,600+ Properties",
    icon: "👨‍💼",
  },
  {
    title: "Owner",
    count: "980+ Properties",
    icon: "🧑",
  },
  {
    title: "Builder",
    count: "10+ Properties",
    icon: "🏢",
  },
];

const AdvertiserTypeCard = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 my-12 sm:my-16 lg:my-20">
      <div className="max-w-7xl mx-auto">
        <div
          className="
            relative 
           
            p-6 sm:p-8 lg:p-10
         
          "
        >
          {/* Background decoration */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 opacity-20">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br from-[#4161df]/30 to-indigo-600/30 rounded-full blur-3xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center relative z-10">
            {/* LEFT PANEL */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-4xl sm:text-5xl">🏠</div>
                <div className="flex gap-2 items-end">
                  <div className="w-3 sm:w-4 h-12 sm:h-14 bg-linear-to-b from-[#4161df] to-indigo-600 rounded-full shadow-sm" />
                  <div className="w-3 sm:w-4 h-8 sm:h-10 bg-linear-to-b from-[#4161df]/80 to-indigo-600/80 rounded-full" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Properties <br /> posted by
              </h2>

              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                Choose type of advertiser
              </p>
            </div>

            {/* RIGHT CARD */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/30 shadow-lg p-6 sm:p-8 lg:p-10 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-[#4161df] to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xl">📋</span>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    Choose type of advertiser
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Browse your choice of listing
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                {advertisers.map((item, index) => (
                  <button
                    key={item.title}
                    className="
                      w-full flex items-center justify-between
                      py-4 px-3 sm:px-4
                      hover:bg-primary/5 hover:shadow-sm
                      transition-all duration-300 rounded-xl
                      group
                    "
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-2xl sm:text-3xl">{item.icon}</span>
                      <div className="text-left">
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {item.count}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors duration-300 group-hover:translate-x-1 transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvertiserTypeCard;
