"use client";

import React, { useState, useMemo, useCallback } from "react";
import { FiShare2, FiInfo, FiTrendingUp, FiPieChart } from "react-icons/fi";
import { toast } from "sonner";

interface EMICalculatorProps {
  propertyPrice?: number;
  className?: string;
}

function formatCurrency(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} Lakh`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function EMICalculator({
  propertyPrice,
  className = "",
}: EMICalculatorProps) {
  const defaultPrincipal = propertyPrice
    ? Math.round(propertyPrice * 0.8)
    : 5000000;

  const [principal, setPrincipal] = useState(defaultPrincipal);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  React.useEffect(() => {
    if (propertyPrice) {
      setPrincipal(Math.round(propertyPrice * 0.8));
    }
  }, [propertyPrice]);

  const { emi, totalInterest, totalAmount } = useMemo(() => {
    const P = principal;
    const R = rate / 12 / 100;
    const N = tenure * 12;

    if (P <= 0 || R <= 0 || N <= 0) {
      return { emi: 0, totalInterest: 0, totalAmount: 0 };
    }

    const emiValue = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalAmountValue = emiValue * N;
    const totalInterestValue = totalAmountValue - P;

    return {
      emi: Math.round(emiValue),
      totalInterest: Math.round(totalInterestValue),
      totalAmount: Math.round(totalAmountValue),
    };
  }, [principal, rate, tenure]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: "PropertyBulbul EMI Calculator",
      text: `My EMI Estimate: ${formatCurrency(emi)}/month for ${formatCurrency(
        principal,
      )} loan at ${rate}% for ${tenure} years. Total Interest: ${formatCurrency(
        totalInterest,
      )}`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text}\n${shareData.url}`,
        );
        toast.success("EMI details copied to clipboard");
      }
    } catch {
      // User cancelled share
    }
  }, [emi, principal, rate, tenure, totalInterest]);

  const principalPercent =
    totalAmount > 0 ? (principal / totalAmount) * 100 : 0;
  const interestPercent =
    totalAmount > 0 ? (totalInterest / totalAmount) * 100 : 0;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const interestOffset = circumference * (1 - interestPercent / 100);

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4161df]/10 flex items-center justify-center">
            <FiPieChart className="text-[#4161df]" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">EMI Calculator</h3>
            <p className="text-xs text-slate-500">
              Estimate your home loan EMI
            </p>
          </div>
        </div>
        <button
          onClick={handleShare}
          className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all active:scale-95"
          title="Share EMI estimate"
        >
          <FiShare2 size={16} className="text-slate-600" />
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-6">
        {/* Loan Amount */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <FiTrendingUp size={14} className="text-[#4161df]" />
              Loan Amount
            </label>
            <span className="text-sm font-bold text-[#4161df] bg-blue-50 px-3 py-1 rounded-lg">
              {formatCurrency(principal)}
            </span>
          </div>
          <input
            type="range"
            min={100000}
            max={propertyPrice ? Math.round(propertyPrice * 0.95) : 100000000}
            step={100000}
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#4161df]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>₹1 Lakh</span>
            <span>
              {propertyPrice
                ? formatCurrency(Math.round(propertyPrice * 0.95))
                : "₹10 Cr"}
            </span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <FiInfo size={14} className="text-[#4161df]" />
              Interest Rate
            </label>
            <span className="text-sm font-bold text-[#4161df] bg-blue-50 px-3 py-1 rounded-lg">
              {rate.toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={20}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#4161df]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>5%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Tenure */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <FiTrendingUp size={14} className="text-[#4161df]" />
              Loan Tenure
            </label>
            <span className="text-sm font-bold text-[#4161df] bg-blue-50 px-3 py-1 rounded-lg">
              {tenure} Years
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#4161df]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>1 Year</span>
            <span>40 Years</span>
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Donut Chart */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#60a5fa"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={interestOffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                EMI
              </span>
              <span className="text-sm font-black">{formatCurrency(emi)}</span>
              <span className="text-[9px] text-slate-400">/month</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 w-full space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-sm text-slate-300">Principal Amount</span>
              <span className="text-sm font-bold">
                {formatCurrency(principal)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-sm text-slate-300">Total Interest</span>
              <span className="text-sm font-bold text-blue-300">
                {formatCurrency(totalInterest)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Total Payment</span>
              <span className="text-lg font-black">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <span className="text-xs text-slate-400">
              Principal ({principalPercent.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <span className="text-xs text-slate-400">
              Interest ({interestPercent.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-400 mt-4">
        * Calculated at {rate}% annual interest. Actual rates may vary by bank.
      </p>
    </div>
  );
}
