"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Upload } from "lucide-react";
import AddPropertyModal from "../components/AddPropertyModal";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";

const PostPropertyCTA = () => {
  const router = useRouter();
  const [modalOpened, setModalOpened] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleAddPropertyClick = () => {
    if (isAuthenticated) {
      setModalOpened(true);
    } else {
      router.push("/auth");
    }
  };

  return (
    <div className="w-full px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-[#4161df] to-[#5d77d6] px-8 py-8 shadow-lg border-8 border-[#5d77d6] flex flex-col gap-6 md:flex-row md:items-center md:justify-between relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4">
            <Home size={120} className="text-white" />
          </div>
          <div className="absolute bottom-4 right-4">
            <Upload size={80} className="text-white" />
          </div>
        </div>

        {/* Left Content */}
        <div className="relative z-10 flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex-shrink-0"
          >
            <div className="p-3 bg-white rounded-full">
              <Home className="w-8 h-8 text-[#4161df]" />
            </div>
          </motion.div>
          <div>
            <h2 className="text-2xl md:text-3xl font-[Poppins] font-bold text-white leading-tight">
              Turn Your Property into Profit -{" "}
              <span className="italic text-yellow-300">List for Free!</span>
            </h2>
            <p className="text-base md:text-lg font-[Poppins] text-white/90 mt-2">
              Reach thousands of verified buyers in Tricity and get genuine
              inquiries instantly
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="relative z-10"
        >
          <button
            onClick={handleAddPropertyClick}
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-white border-2 border-white shadow-lg px-8 py-4 text-lg font-[Poppins] font-semibold text-[#4161df] hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Upload className="w-5 h-5" />
            Post Property
            <span className="rounded-full bg-[#4161df] px-3 py-1 text-sm font-bold text-white shadow-sm">
              FREE
            </span>
          </button>

          <AddPropertyModal opened={modalOpened} setOpened={setModalOpened} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PostPropertyCTA;
