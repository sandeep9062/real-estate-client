"use client";

import { use, useState, useCallback, useMemo } from "react";
import {
  FaCalculator,
  FaChartPie,
  FaRupeeSign,
  FaHome,
  FaShareAlt,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function EMICalculatorClient({ searchParams }: Props) {
  const params = use(searchParams);
  const initialPrice = Number(params?.price) || 5000000;

  const [price, setPrice] = useState(initialPrice);
  const [downPayment, setDownPayment] = useState(
    Math.round(initialPrice * 0.2),
  );
  const [interest, setInterest] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [shareCopied, setShareCopied] = useState(false);

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

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/tools/emi-calculator?price=${price}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  }, [price]);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#4161df] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <FaCalculator size={14} />
            Free Online Tool
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Home Loan EMI Calculator
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Plan your property investment in Tricity. Calculate your monthly
            EMI, total interest payable, and loan breakdown in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calculator Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl">
                    <FaCalculator className="text-[#4161df]" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      EMI Calculator
                    </h2>
                    <p className="text-xs text-slate-400">
                      Adjust values to see your EMI
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {shareCopied ? (
                    <>
                      <FaCheckCircle size={14} className="text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FaShareAlt size={14} />
                      Share
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-6">
                {/* Property Price */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">
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
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4161df]"
                  />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full mt-3 p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4161df]/20 focus:border-[#4161df] outline-none transition-all"
                  />
                </div>

                {/* Down Payment */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">
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
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full mt-3 p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                {/* Interest & Tenure Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">
                      Interest Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step={0.1}
                        value={interest}
                        onChange={(e) => setInterest(Number(e.target.value))}
                        className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4161df]/20 focus:border-[#4161df] outline-none transition-all pr-10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        %
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">
                      Loan Tenure
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                        className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4161df]/20 focus:border-[#4161df] outline-none transition-all pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        Yrs
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="mt-8 bg-gradient-to-br from-slate-50 to-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-600">Loan Amount</span>
                  <strong className="text-slate-900">
                    {formatCurrency(loanAmount)}
                  </strong>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-dashed border-slate-200">
                  <span className="text-sm font-semibold text-slate-700">
                    Monthly EMI
                  </span>
                  <strong className="text-2xl md:text-3xl text-[#4161df]">
                    {isFinite(emi) ? formatCurrency(Math.round(emi)) : "₹0"}
                  </strong>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-dashed border-slate-200">
                  <span className="text-xs text-slate-500">
                    Total Interest Payable
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {isFinite(totalInterest)
                      ? formatCurrency(Math.round(totalInterest))
                      : "₹0"}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-dashed border-slate-200">
                  <span className="text-xs text-slate-500">
                    Total Amount Payable
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {isFinite(totalPayable)
                      ? formatCurrency(Math.round(totalPayable))
                      : "₹0"}
                  </span>
                </div>
              </div>

              {/* Visual Breakdown */}
              <div className="mt-6 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaRupeeSign className="text-[#4161df]" size={14} />
                  <span className="text-slate-600">Principal</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaChartPie className="text-emerald-500" size={14} />
                  <span className="text-slate-600">Interest</span>
                </div>
              </div>
              <div className="mt-2 h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
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
          </div>

          {/* Info Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                <div className="text-3xl font-black text-[#4161df] mb-1">
                  {isFinite(emi) ? formatCurrency(Math.round(emi)) : "₹0"}
                </div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Monthly EMI
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                <div className="text-3xl font-black text-emerald-600 mb-1">
                  {formatCompact(loanAmount)}
                </div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Loan Amount
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                How EMI is Calculated
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: <FaRupeeSign size={14} />,
                    title: "Loan Amount",
                    desc: "Property price minus your down payment.",
                  },
                  {
                    icon: <FaChartPie size={14} />,
                    title: "Interest Rate",
                    desc: "Annual interest rate divided by 12 for monthly rate.",
                  },
                  {
                    icon: <FaCalculator size={14} />,
                    title: "Tenure",
                    desc: "Total number of months you choose to repay.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-[#4161df] mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#4161df] to-[#3759dd] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <FaHome size={20} />
                <h3 className="text-lg font-bold">Find Your Dream Home</h3>
              </div>
              <p className="text-blue-100 text-sm mb-5">
                Explore verified properties for sale in Chandigarh, Mohali, and
                Panchkula that match your budget.
              </p>
              <Link
                href="/properties?deal=Sale"
                className="inline-flex items-center gap-2 bg-white text-[#4161df] px-5 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors"
              >
                Browse Sale Properties
                <FaArrowRight size={14} />
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>Disclaimer:</strong> This calculator provides an
                estimate for planning purposes only. Actual EMI may vary based
                on lender policies, processing fees, and your credit profile.
                Please consult with your bank or financial advisor for exact
                figures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
