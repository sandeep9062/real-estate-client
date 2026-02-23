"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 z-50">
      {isVisible && (
        <button
          type="button"
          onClick={scrollToTop}
          className="p-2.5 sm:p-3 md:p-3.5 rounded-full bg-[#4161df] hover:bg-[#3759dd] text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-opacity duration-300"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-sm sm:text-base md:text-lg" />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
