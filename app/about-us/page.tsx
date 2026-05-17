"use client";

import React from "react";
import Image from "next/image";
import {
  Building2,
  Users,
  Shield,
  Award,
  Linkedin,
  MapPin,
  Star,
  TrendingUp,
  CheckCircle2,
  Phone,
  ArrowRight,
  HeartHandshake,
  BadgeCheck,
  Landmark,
} from "lucide-react";
import Testimonial from "@/components/Testimonial";
import Link from "next/link";

/* ─── constants ─── */
const BRAND = "#4161df";

const stats = [
  { value: "5000+", label: "Happy Families" },
  { value: "₹2.5Cr+", label: "Properties Sold" },
  { value: "300+", label: "Verified Listings" },
  { value: "12+", label: "Years of Trust" },
];

const features = [
  {
    icon: <BadgeCheck className="w-6 h-6 text-white" />,
    title: "Verified Properties",
    desc: "Every listing is legally vetted and physically inspected before it reaches you — no surprises, no fraud.",
  },
  {
    icon: <Users className="w-6 h-6 text-white" />,
    title: "Expert Guidance",
    desc: "Seasoned advisors walk you through every step, from shortlisting to registration, in your language.",
  },
  {
    icon: <Shield className="w-6 h-6 text-white" />,
    title: "Full Transparency",
    desc: "No hidden fees, no brokerage shocks. Clear pricing and honest timelines, always.",
  },
  {
    icon: <Award className="w-6 h-6 text-white" />,
    title: "Award-Winning Trust",
    desc: "Recognised as Tricity's most trusted agency three years running by our clients and peers.",
  },
];

const values = [
  {
    icon: <HeartHandshake className="w-5 h-5" />,
    label: "Client-First Always",
  },
  {
    icon: <BadgeCheck className="w-5 h-5" />,
    label: "Zero Compromise on Quality",
  },
  { icon: <Landmark className="w-5 h-5" />, label: "Deep Local Expertise" },
  { icon: <TrendingUp className="w-5 h-5" />, label: "Data-Driven Decisions" },
];

const teamMembers = [
  {
    name: "Priyanka Sharma",
    role: "Founder & CEO",
    description:
      "Chandigarh native with 12+ years in real estate. Built PropertyBulbul from ground up with a vision to simplify property dealings for Tricity residents.",
    experience: "12 Years",
    image: "/priyanka-sharma.jpg",
    social: { linkedin: "#" },
  },
  {
    name: "Neha Verma",
    role: "Lead Property Consultant",
    description:
      "Expert in luxury residential and commercial properties. Helped 500+ families find their dream homes across Chandigarh and Mohali.",
    experience: "8 Years",
    image: "/neha-verma.jpg",
    social: { linkedin: "#" },
  },
  {
    name: "Ritika",
    role: "Marketing Director",
    description:
      "Digital marketing specialist focused on helping Tricity property seekers connect with verified sellers through modern technology.",
    experience: "6 Years",
    image: "/ritika.jpg",
    social: { linkedin: "#" },
  },
];

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
const AboutPage = () => {
  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative w-full h-[55vh] sm:h-[65vh] md:h-[75vh] text-white">
        <Image
          src="/about-hero.jpg"
          alt="PropertyBulbul Team — Real Estate Experts in Tricity"
          fill
          priority
          className="object-cover"
        />
        {/* layered gradient: dark top + dark bottom, bright middle */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/60 to-black/85" />

        {/* subtle diagonal grid pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
          {/* eyebrow */}
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] xs:text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase px-3 sm:px-5 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-300" />
            Tricity's Most Trusted Partner
          </span>

          <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] max-w-5xl">
            Real Estate,{" "}
            <span
              className="relative inline-block"
              style={{ color: "#93a8f8" }}
            >
              Done Right
              {/* underline accent */}
              <span
                className="absolute left-0 -bottom-1 w-full h-[2px] sm:h-[3px] rounded-full opacity-60"
                style={{ background: "#4161df" }}
              />
            </span>
          </h1>

          <p className="mt-3 sm:mt-5 text-xs sm:text-sm md:text-lg text-gray-200 max-w-2xl leading-relaxed">
            PropertyBulbul has been simplifying property dreams for thousands of
            families across Chandigarh, Panchkula & Mohali.
          </p>

          {/* mini trust row */}
          <div className="mt-5 sm:mt-8 flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-1.5 sm:gap-y-2 text-[10px] xs:text-xs sm:text-sm text-gray-300 font-medium">
            {["Chandigarh", "Panchkula", "Mohali", "Kharar", "Zirakpur"].map(
              (city) => (
                <span key={city} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  {city}
                </span>
              ),
            )}
          </div>
        </div>

        {/* wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 70"
            preserveAspectRatio="none"
            className="w-full h-12 sm:h-16 fill-white"
          >
            <path d="M0,40 C480,70 960,10 1440,40 L1440,70 L0,70 Z" />
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      {/* <section className="max-w-5xl mx-auto px-4 pt-4 pb-14 sm:pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 p-5 sm:p-6 text-center overflow-hidden"
            >
          
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ background: BRAND }}
              />
              <div
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-1"
                style={{ color: BRAND }}
              >
                {s.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1.5 font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* ── OUR STORY ── */}
      <section className="w-full bg-gray-50 py-12 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            {/* image column */}
            <div className="relative h-56 xs:h-72 sm:h-[420px] lg:h-[520px] order-2 lg:order-1">
              {/* main image */}

              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/propertybulbul-about.jpg"
                  alt="PropertyBulbul"
                  fill
                  className="object-cover"
                />
                {/* dark blur overlay */}
                <div className="absolute inset-0 bg-black/34 " />
              </div>

              {/* floating card — rating */}
              {/* <div
                className="absolute -bottom-6 -right-4 sm:-right-8 text-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3"
                style={{ background: BRAND }}
              >
                <Star className="w-7 h-7 fill-yellow-300 text-yellow-300 flex-shrink-0" />
                <div>
                  <p className="font-bold text-base leading-tight">4.9 / 5</p>
                  <p className="text-blue-200 text-xs">1,200+ Google Reviews</p>
                </div>
              </div> */}

              {/* floating card — experience */}
              {/* <div className="absolute -top-5 -left-4 sm:-left-8 bg-white border border-gray-100 rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#eef1fd" }}
                >
                  <Landmark className="w-5 h-5" style={{ color: BRAND }} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Est. 2012</p>
                  <p className="text-gray-400 text-xs">Chandigarh, India</p>
                </div>
              </div> */}
            </div>

            {/* text column */}
            <div className="order-1 lg:order-2">
              <p
                className="font-semibold text-[11px] xs:text-xs sm:text-sm tracking-[0.15em] uppercase mb-2 sm:mb-3"
                style={{ color: BRAND }}
              >
                Our Story
              </p>
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug mb-4 sm:mb-6">
                Born in Tricity,{" "}
                <span style={{ color: BRAND }}>Built for Excellence</span>
              </h2>
              <p className="text-sm xs:text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-5">
                PropertyBulbul was founded with one question in mind:{" "}
                <em>
                  Why is buying a home in Chandigarh still so complicated?
                </em>{" "}
                We set out to change that — combining neighbourhood-level market
                knowledge with modern technology to deliver a process that's
                fast, honest, and stress-free.
              </p>
              <p className="text-sm xs:text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
                Today we're Tricity's most relied-upon real estate partner. From
                first-time flat buyers in Mohali to NRI investors seeking
                premium villas in Panchkula, we guide every client with the same
                care and rigour.
              </p>

              {/* value pills */}
              <div className="flex flex-wrap gap-3">
                {values.map((v) => (
                  <span
                    key={v.label}
                    className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm font-medium px-4 py-2 rounded-full shadow-sm"
                  >
                    <span style={{ color: BRAND }}>{v.icon}</span>
                    {v.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-12 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* two-column layout: big quote left, text right */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-16 items-center">
            {/* large pull quote */}
            <div className="lg:col-span-2">
              <p
                className="font-semibold text-[11px] xs:text-xs sm:text-sm tracking-[0.15em] uppercase mb-3 sm:mb-4"
                style={{ color: BRAND }}
              >
                Our Mission
              </p>
              <blockquote className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                "India's most <span style={{ color: BRAND }}>helpful</span> real
                estate service."
              </blockquote>
              <div
                className="mt-4 sm:mt-6 h-0.5 sm:h-1 w-12 sm:w-16 rounded-full"
                style={{ background: BRAND }}
              />
            </div>

            {/* supporting copy */}
            <div className="lg:col-span-3 space-y-4 sm:space-y-5">
              <p className="text-sm xs:text-base sm:text-lg text-gray-600 leading-relaxed">
                We're not satisfied with being just "good." Every touchpoint —
                from the first inquiry call to handing over the keys — is
                designed to make you feel informed, supported, and in control.
              </p>
              <p className="text-sm xs:text-base sm:text-lg text-gray-600 leading-relaxed">
                Technology helps us move faster. Local expertise helps us advise
                better. But it's our genuine care for people that sets us apart.
                We measure success not in deals closed, but in families settled
                happily.
              </p>

              {/* checklist */}
              <ul className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
                {[
                  "Transparent pricing with zero hidden charges",
                  "Dedicated advisor assigned to every client",
                  "Post-purchase support for paperwork & registration",
                  "Regular market updates so you never miss an opportunity",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 sm:gap-3 text-gray-700 text-xs sm:text-sm md:text-base"
                  >
                    <CheckCircle2
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5"
                      style={{ color: BRAND }}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="w-full bg-gray-50 py-12 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p
              className="font-semibold text-[11px] xs:text-xs sm:text-sm tracking-[0.15em] uppercase mb-2 sm:mb-3"
              style={{ color: BRAND }}
            >
              Why Us
            </p>
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              The PropertyBulbul Difference
            </h2>
            <p className="mt-2 sm:mt-3 text-gray-500 max-w-xl mx-auto text-xs sm:text-sm md:text-base">
              Four pillars that make every property journey with us feel
              effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS STRIP ── */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p
            className="font-semibold text-[11px] xs:text-xs sm:text-sm tracking-[0.15em] uppercase mb-2 sm:mb-3"
            style={{ color: BRAND }}
          >
            How It Works
          </p>
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-14">
            Your Journey in 4 Simple Steps
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-4 relative">
            {/* connector line (desktop) */}
            <div
              className="hidden sm:block absolute top-8 left-[12.5%] right-[12.5%] h-px"
              style={{
                background: `linear-gradient(to right, ${BRAND}, ${BRAND}80)`,
              }}
            />
            {[
              {
                step: "01",
                title: "Share Your Need",
                desc: "Tell us what you're looking for — budget, location, type.",
              },
              {
                step: "02",
                title: "Get Matched",
                desc: "We shortlist verified properties tailored to you within 24 hrs.",
              },
              {
                step: "03",
                title: "Site Visits",
                desc: "Our advisor accompanies you for curated, hassle-free visits.",
              },
              {
                step: "04",
                title: "Close with Confidence",
                desc: "Legal checks, price negotiation, and paperwork — all handled.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center relative"
              >
                <div
                  className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-white text-base xs:text-lg sm:text-xl mb-3 sm:mb-4 border-[3px] sm:border-4 border-white shadow-md z-10"
                  style={{ background: BRAND }}
                >
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 text-xs xs:text-sm sm:text-base mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-[10px] xs:text-xs sm:text-sm leading-relaxed max-w-[140px] xs:max-w-[160px] sm:max-w-none">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <Testimonial />

      {/* ── CTA ── */}
      <section
        className="relative w-full overflow-hidden py-20 sm:py-28 px-4"
        style={{ background: BRAND }}
      >
        {/* dot pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* top curve */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            className="w-full h-10 sm:h-14 fill-white"
          >
            <path d="M0,40 C480,0 960,60 1440,20 L1440,0 L0,0 Z" />
          </svg>
        </div>

        <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center pt-4">
          <span className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs font-semibold tracking-[0.15em] uppercase px-5 py-2 rounded-full mb-8">
            Ready to Begin?
          </span>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Find Your Perfect Property <br className="hidden sm:block" />
            in Tricity Today
          </h2>
          <p className="text-blue-100 mt-3 sm:mt-4 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed">
            Join 5,000+ families who found their dream home with PropertyBulbul.
            Reach out — no sales pressure, just genuine help.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-xl hover:bg-gray-100 hover:scale-105 transition-all duration-200"
              style={{ color: BRAND }}
            >
              Talk to an Expert{" "}
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/50 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Browse
              Listings
            </Link>
          </div>

          {/* phone nudge */}
          {/* <a
            href="tel:+911234567890"
            className="mt-8 inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm font-medium transition-colors"
          >
            <Phone className="w-4 h-4" /> Or call us directly: +91 12345 67890
          </a> */}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

/* ══════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════ */

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="group bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
      style={{ background: BRAND }}
    >
      {icon}
    </div>
    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
      {title}
    </h3>
    <p className="text-sm sm:text-base text-gray-500 leading-relaxed flex-1">
      {desc}
    </p>
    <div
      className="mt-5 h-0.5 w-0 group-hover:w-10 rounded-full transition-all duration-500"
      style={{ background: BRAND }}
    />
  </div>
);

const TeamMemberCard = ({ member }: { member: any }) => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <div className="relative w-full h-72 sm:h-80">
      <Image
        src={member.image}
        alt={`${member.name} — ${member.role} at PropertyBulbul`}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <p className="font-bold text-lg leading-tight">{member.name}</p>
        <p className="text-blue-300 text-sm font-medium">{member.role}</p>
      </div>
    </div>
    <div className="p-5">
      <span
        className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full mb-3"
        style={{ background: BRAND }}
      >
        {member.experience} Experience
      </span>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {member.description}
      </p>
      <a
        href={member.social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#4161df] transition-colors text-sm font-medium"
      >
        <Linkedin className="w-4 h-4" /> LinkedIn Profile
      </a>
    </div>
  </div>
);
