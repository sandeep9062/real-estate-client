import { Metadata } from "next";
import EMICalculator from "@/components/EMICalculator";

export const metadata: Metadata = {
  title: "Home Loan EMI Calculator | Calculate EMI Online",
  description:
    "Free Home Loan EMI Calculator for India. Calculate your monthly EMI, total interest payable & total payment instantly. Compare home loan rates from SBI, HDFC, ICICI & more. Shareable results.",
  keywords: [
    "home loan emi calculator",
    "emi calculator india",
    "home loan calculator",
    "mortgage calculator india",
    "property loan emi",
    "calculate home loan emi",
    "hdfc home loan emi",
    "sbi home loan emi calculator",
    "real estate emi",
    "loan against property emi",
    "housing loan calculator",
    "monthly emi calculator",
    "propertybulbul emi",
    "chandigarh property emi",
    "mohali home loan",
    "panchkula property loan",
  ],
  alternates: {
    canonical: "https://www.propertybulbul.com/emi-calculator",
  },
  openGraph: {
    title: "Home Loan EMI Calculator | Calculate EMI Online",
    description:
      "Calculate your home loan EMI instantly. Free tool to estimate monthly payments, total interest & compare loan options.",
    url: "https://www.propertybulbul.com/emi-calculator",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "PropertyBulbul Home Loan EMI Calculator",
      },
    ],
  },
};

export default function EMICalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Home Loan EMI Calculator
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Plan your property purchase with our free EMI calculator. Adjust
            loan amount, interest rate & tenure to find your ideal monthly
            payment.
          </p>
        </div>

        {/* Calculator */}
        <EMICalculator className="w-full" />

        {/* SEO Content Section */}
        <div className="mt-16 space-y-10">
          {/* How it works */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              How to Use the EMI Calculator
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Enter Loan Amount",
                  desc: "Input the principal amount you wish to borrow from the bank.",
                },
                {
                  step: "2",
                  title: "Set Interest Rate",
                  desc: "Adjust the annual interest rate based on your bank's offer (typically 8-10%).",
                },
                {
                  step: "3",
                  title: "Choose Tenure",
                  desc: "Select your preferred repayment period in years (up to 30 years).",
                },
              ].map((item) => (
                <div key={item.step} className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#4161df] text-white flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Formula */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              EMI Calculation Formula
            </h2>
            <div className="bg-slate-50 rounded-xl p-4 font-mono text-sm text-slate-700 mb-4 overflow-x-auto">
              <p>EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-bold text-slate-900">P</span>
                <span className="text-slate-500 ml-2">
                  = Principal loan amount
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-900">R</span>
                <span className="text-slate-500 ml-2">
                  = Monthly interest rate
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-900">N</span>
                <span className="text-slate-500 ml-2">= Number of months</span>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Why Use Our EMI Calculator?
            </h2>
            <ul className="space-y-3">
              {[
                "Instantly compare EMIs across different loan amounts and tenures",
                "Plan your monthly budget before applying for a home loan",
                "Understand the total interest you will pay over the loan period",
                "Share your EMI estimate with family or financial advisors",
                "Free to use with no registration required",
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#4161df] flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </section>

          {/* Banks */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Popular Home Loan Interest Rates (India)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 font-semibold text-slate-700">
                      Bank
                    </th>
                    <th className="text-left py-3 font-semibold text-slate-700">
                      Interest Rate (p.a.)
                    </th>
                    <th className="text-left py-3 font-semibold text-slate-700">
                      Processing Fee
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  {[
                    {
                      bank: "SBI Home Loan",
                      rate: "8.50% – 9.15%",
                      fee: "Up to 0.35%",
                    },
                    {
                      bank: "HDFC Bank",
                      rate: "8.50% – 9.40%",
                      fee: "Up to 0.50%",
                    },
                    {
                      bank: "ICICI Bank",
                      rate: "8.50% – 9.50%",
                      fee: "Up to 2.00%",
                    },
                    {
                      bank: "Axis Bank",
                      rate: "8.50% – 9.20%",
                      fee: "Up to 1.00%",
                    },
                    {
                      bank: "Kotak Mahindra",
                      rate: "8.60% – 9.30%",
                      fee: "Up to 2.00%",
                    },
                    {
                      bank: "Bank of Baroda",
                      rate: "8.40% – 9.15%",
                      fee: "Up to 0.50%",
                    },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="py-3">{row.bank}</td>
                      <td className="py-3">{row.rate}</td>
                      <td className="py-3">{row.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              * Rates are indicative and subject to change. Please verify with
              the respective bank before applying.
            </p>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-[#4161df] to-[#3759dd] rounded-2xl p-6 sm:p-8 text-white text-center">
            <h2 className="text-xl font-bold mb-2">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-blue-100 mb-6 max-w-lg mx-auto">
              Browse verified properties for sale & rent across Chandigarh,
              Mohali, Panchkula & Zirakpur.
            </p>
            <a
              href="/properties"
              className="inline-block bg-white text-[#4161df] font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-50 transition-all active:scale-[0.98]"
            >
              Explore Properties
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
