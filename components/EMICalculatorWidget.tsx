"use client";

import { useState, useCallback, useMemo } from "react";
import { FaCalculator, FaTimes, FaChartPie, FaRupeeSign } from "react-icons/fa";

interface EMICalculatorWidgetProps {
  defaultPrice?: number;
  inline?: boolean;
  propertyTitle?: string;
}

export default function EMICalculatorWidget({
  defaultPrice,
  inline = false,
  propertyTitle,
}: EMICalculatorWidgetProps) {
  const [open, setOpen] = useState(inline);

  const [price, setPrice] = useState(defaultPrice || 5000000);
  const [downPayment, setDownPayment] = useState(
    Math.round((defaultPrice || 5000000) * 0.2),
  );
  const [interest, setInterest] = useState(8.5); // %
  const [tenure, setTenure] = useState(20); // years

  // Auto-adjust down payment if default price changes significantly
  const prevDefaultRef = useMemo(() => defaultPrice, []);
  if (defaultPrice !== undefined && defaultPrice !== prevDefaultRef) {
    // This is just to seed initial values from prop
  }

  const loanAmount = Math.max(0, price - downPayment);
  const monthlyRate = interest / 12 / 100;
  const totalMonths = tenure * 12;

  const emi = useMemo(() => {
    if (loanAmount <= 0 || monthlyRate <= 0 || totalMonths <= 0) return 0;
    return (
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );
  }, [loanAmount, monthlyRate, totalMonths]);

  const totalPayable = emi * totalMonths;
  const totalInterest = totalPayable - loanAmount;

  const formatCurrency = useCallback(
    (val: number) =>
      "₹" +
      val.toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      }),
    [],
  );

  const formatCompact = useCallback((val: number) => {
    if (val >= 10000000) return "₹" + (val / 10000000).toFixed(2) + " Cr";
    if (val >= 100000) return "₹" + (val / 100000).toFixed(2) + " L";
    return "₹" + val.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  }, []);

  // Inline version (used in property detail sidebar)
  if (inline) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FaCalculator className="text-[#4161df]" size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">EMI Calculator</h3>
            {propertyTitle && (
              <p className="text-xs text-slate-500 truncate max-w-[200px]">
                {propertyTitle}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Property Price */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-semibold text-slate-600">
                Property Price
              </label>
              <span className="text-xs font-bold text-[#4161df]">
                {formatCompact(price)}
              </span>
            </div>
            <input
              type="range"
              min={500000}
              max={100000000}
              step={100000}
              value={price}
              onChange={(e) => {
                const p = Number(e.target.value);
                setPrice(p);
                setDownPayment(Math.round(p * 0.2));
              }}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4161df]"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full mt-2 p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4161df]/20 focus:border-[#4161df] outline-none transition-all"
            />
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-semibold text-slate-600">
                Down Payment
              </label>
              <span className="text-xs font-bold text-emerald-600">
                {formatCompact(downPayment)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={price}
              step={50000}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full mt-2 p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Interest & Tenure Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Interest Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={interest}
                  onChange={(e) => setInterest(Number(e.target.value))}
                  className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4161df]/20 focus:border-[#4161df] outline-none transition-all pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  %
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Tenure
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4161df]/20 focus:border-[#4161df] outline-none transition-all pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  Yrs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mt-5 bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 rounded-xl border border-blue-100/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-600">Loan Amount</span>
            <strong className="text-sm text-slate-900">
              {formatCurrency(loanAmount)}
            </strong>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-dashed border-slate-200">
            <span className="text-sm font-semibold text-slate-700">
              Monthly EMI
            </span>
            <strong className="text-xl text-[#4161df]">
              {isFinite(emi) ? formatCurrency(Math.round(emi)) : "₹0"}
            </strong>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-dashed border-slate-200">
            <span className="text-xs text-slate-500">
              Total Interest Payable
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {isFinite(totalInterest)
                ? formatCurrency(Math.round(totalInterest))
                : "₹0"}
            </span>
          </div>
        </div>

        {/* Breakdown mini chart */}
        <div className="mt-4 flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#4161df]" />
            <span className="text-slate-600">Principal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Interest</span>
          </div>
        </div>
        <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-[#4161df] transition-all duration-500"
            style={{
              width: `${totalPayable > 0 ? (loanAmount / totalPayable) * 100 : 0}%`,
            }}
          />
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{
              width: `${totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    );
  }

  // Floating / Modal version
  return (
    <>
      {/* Floating Calculator Icon */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 md:bottom-4 md:right-66 bg-[#4161df] hover:bg-[#3759dd] text-white rounded-full text-sm sm:text-base bottom-31 flex items-center gap-2 py-2.5 px-2.5 md:px-4 z-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
      >
        <FaCalculator size={22} />
        <span className="hidden sm:inline">EMI</span>
      </button>

      {/* Popup Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-500 px-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
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

            <div className="space-y-5">
              {/* Property Price */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-600">
                    Property Price
                  </label>
                  <span className="text-sm font-bold text-[#4161df]">
                    {formatCompact(price)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={100000000}
                  step={100000}
                  value={price}
                  onChange={(e) => {
                    const p = Number(e.target.value);
                    setPrice(p);
                    setDownPayment(Math.round(p * 0.2));
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4161df]"
                />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full mt-2 p-2.5 border rounded-lg focus:ring-2 focus:ring-[#4161df]/20 focus:border-[#4161df] outline-none transition-all"
                />
              </div>

              {/* Down Payment */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-600">
                    Down Payment
                  </label>
                  <span className="text-sm font-bold text-emerald-600">
                    {formatCompact(downPayment)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={price}
                  step={50000}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full mt-2 p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              {/* Interest & Tenure */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step={0.1}
                    value={interest}
                    onChange={(e) => setInterest(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#4161df]/20 focus:border-[#4161df] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Tenure (Years)
                  </label>
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#4161df]/20 focus:border-[#4161df] outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="mt-6 bg-gray-50 p-5 rounded-xl space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Amount</span>
                <strong className="text-slate-900">
                  {formatCurrency(loanAmount)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Interest</span>
                <strong className="text-slate-900">
                  {isFinite(totalInterest)
                    ? formatCurrency(Math.round(totalInterest))
                    : "₹0"}
                </strong>
              </div>
              <div className="flex justify-between text-lg pt-3 border-t border-dashed border-gray-300">
                <span className="font-semibold">Monthly EMI</span>
                <strong className="text-[#4161df] text-xl">
                  {isFinite(emi) ? formatCurrency(Math.round(emi)) : "₹0"}
                </strong>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FaRupeeSign className="text-[#4161df]" size={14} />
                <span className="text-gray-600">Principal</span>
              </div>
              <div className="flex items-center gap-2">
                <FaChartPie className="text-emerald-500" size={14} />
                <span className="text-gray-600">Interest</span>
              </div>
            </div>
            <div className="mt-2 h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-[#4161df] transition-all duration-500"
                style={{
                  width: `${totalPayable > 0 ? (loanAmount / totalPayable) * 100 : 0}%`,
                }}
              />
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0}%`,
                }}
              />
            </div>

            {/* CTA */}
            <button className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-base sm:text-lg transition-colors">
              Get Affordable Properties Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
