"use client";

import { useState } from "react";
import { FaCalculator, FaTimes } from "react-icons/fa";

export default function Calculator() {
  const [open, setOpen] = useState(false);

  const [price, setPrice] = useState(5000000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [interest, setInterest] = useState(8); // %
  const [tenure, setTenure] = useState(20); // years

  const loanAmount = price - downPayment;

  const monthlyRate = interest / 12 / 100;
  const totalMonths = tenure * 12;

  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  return (
    <>
      {/* Floating Calculator Icon */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 md:bottom-4 md:right-66 bg-[#4161df] hover:bg-[#3759dd] text-white   rounded-full text-sm sm:text-base bottom-31 flex items-center gap-2  py-2.5 px-2.5 md:px-4 z-100   shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
      >
        <FaCalculator size={22} />
        <span className="hidden sm:inline">EMI</span>
      </button>

      {/* Popup Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-500 px-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100"
            >
              <FaTimes size={18} />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
              🏡 Mortgage / EMI Calculator
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Property Value */}
              <div>
                <label className="text-sm text-gray-600">
                  Property Price (₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg mt-1"
                />
              </div>

              {/* Down Payment */}
              <div>
                <label className="text-sm text-gray-600">
                  Down Payment (₹)
                </label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg mt-1"
                />
              </div>

              {/* Interest Rate */}
              <div>
                <label className="text-sm text-gray-600">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  value={interest}
                  onChange={(e) => setInterest(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg mt-1"
                />
              </div>

              {/* Tenure */}
              <div>
                <label className="text-sm text-gray-600">Tenure (Years)</label>
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg mt-1"
                />
              </div>
            </div>

            {/* Results */}
            <div className="mt-6 bg-gray-50 p-4 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span>Loan Amount</span>
                <strong>₹ {loanAmount.toLocaleString()}</strong>
              </div>

              <div className="flex justify-between text-lg">
                <span>Monthly EMI</span>
                <strong className="text-blue-600">
                  ₹ {isFinite(emi) ? Math.round(emi).toLocaleString() : 0}
                </strong>
              </div>
            </div>

            {/* CTA */}
            <button className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-base sm:text-lg">
              Get Affordable Properties Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
