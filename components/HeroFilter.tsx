"use client";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { IoChevronDownOutline } from "react-icons/io5";

export default function HeroSearch() {
  const [activeTab, setActiveTab] = useState("BUY");
  const [showTypes, setShowTypes] = useState(false);
  const [propertyType, setPropertyType] = useState("");

  const propertyOptions = [
    "Apartment/Flat",
    "House/Villa",
    "Land/Plot",
    "Retail",
    "Office",
    "Industrial",
  ];

  // price labels change depending on tab
  const priceLabels =
    activeTab === "RENT"
      ? { min: "₹ 3000", max: "₹ 20 Lacs" }
      : { min: "₹ 0", max: "₹ 50 Cr+" };

  const tabs = ["BUY", "RENT", "SELL"];

  return (
    <div
      className="relative w-full h-[80vh] bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')",
      }}
    >
      {/* tagline */}
      <div className="absolute top-20 text-white font-semibold bg-red-600 px-6 py-2 rounded-xl text-xl">
        Buy Smarter. Sell Better. Rent Quicker.
      </div>

      {/* search box */}
      <div className="w-[85%] bg-white rounded-3xl shadow-2xl mt-28 pb-10 relative">
        {/* tabs */}
        <div className="flex justify-center gap-14 pt-5 font-semibold text-lg">
          {tabs.map((t) => (
            <button
              key={t}
              className={`pb-3 ${
                activeTab === t
                  ? "text-red-600 border-b-4 border-red-600"
                  : "text-[#0f163e]"
              }`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* form */}
        <div className="grid md:grid-cols-3 gap-6 px-10 py-10 relative">

          {/* location */}
          <div>
            <p className="font-bold text-[18px]">Location</p>
            <p className="text-gray-500">Current location</p>
          </div>

          {/* property type dropdown */}
          <div className="border-l pl-6 border-gray-300 relative">
            <p className="font-bold text-[18px]">Property Type</p>
            <div
              className="text-gray-500 flex items-center justify-between cursor-pointer mt-1"
              onClick={() => setShowTypes(!showTypes)}
            >
              {propertyType || "Choose anything"}
              <IoChevronDownOutline />
            </div>

            {showTypes && (
              <div className="absolute bg-white border shadow-xl rounded-xl mt-2 w-[250px] py-2 z-50">
                {propertyOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      setPropertyType(opt);
                      setShowTypes(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* price */}
          <div className="border-l pl-6 border-gray-300">
            <p className="font-bold text-[18px]">Price Range</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{priceLabels.min}</span>
              <span>{priceLabels.max}</span>
            </div>
            <input
              type="range"
              className="w-full mt-2 accent-blue-600"
            />
          </div>
        </div>

        {/* search button */}
        <div className="flex justify-center">
          <button className="bg-red-600 text-white px-14 py-4 rounded-xl font-semibold flex items-center gap-3 text-xl shadow-md">
            Search <IoSearch size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
