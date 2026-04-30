"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BiMenuAltRight } from "react-icons/bi";
import AddPropertyModal from "./AddPropertyModal";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ProfileMenu from "./ProfileMenu";
import { selectIsAuthenticated, selectUser } from "../store/authSlice";
import { compareCount } from "@/lib/compareStorage";
import Image from "next/image";

const Header: React.FC = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [compareN, setCompareN] = useState(0);

  useEffect(() => {
    const refresh = () => setCompareN(compareCount());
    refresh();
    window.addEventListener("pb-compare-changed", refresh);
    return () => window.removeEventListener("pb-compare-changed", refresh);
  }, []);

  const toggleMenu = () => setMenuOpened((prev) => !prev);

  //const cities = ["new york", "los angeles", "chicago", "houston", "miami"];
  //const [selectedCity, setSelectedCity] = useState(cities[0]);

  const handleAddPropertyClick = () => {
    if (isAuthenticated) {
      setModalOpened(true);
    } else {
      router.push("/login");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-1150 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-md shadow-sm border-b border-border/40"
          : "bg-transparent backdrop-blur-none border-b border-transparent"
      }`}
    >
      <div
        className={`max-w-[96vw] mx-auto flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-1 md:py-[0.3rem] ${!scrolled ? "text-gray-900" : ""}`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 sm:gap-2 group"
          aria-label="Go to homepage"
        >
          <Image
            src="/bulbul-icon.png"
            alt="Property bulbul logo"
            width={60}
            height={60}
            priority
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px] transition-transform duration-300 group-hover:scale-[1.03]"
          />

          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-[22px] font-extrabold tracking-tight">
              Property
            </span>

            <span className="text-[20px] font-extrabold text-[#4161df] tracking-tight">
              Bulbul
            </span>
          </div>
        </Link>

        {/* City Selection Dropdown */}

        {/* <div className="hidden md:flex items-center gap-2">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-1.5 text-sm font-medium rounded-full border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </option>
            ))}
          </select>
        </div> */}

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium">
          <Link
            href="/compare"
            className="relative px-2 py-1 rounded-md transition-colors hover:text-blue-600"
          >
            Compare
            {compareN > 0 && (
              <span className="ml-1 inline-flex min-w-[1.1rem] justify-center rounded-full bg-[#4161df] text-white text-[10px] px-1 font-bold">
                {compareN}
              </span>
            )}
          </Link>
          <Link
            href="/saved-searches"
            className="relative px-2 py-1 rounded-md transition-colors hover:text-blue-600"
          >
            Saved searches
          </Link>
          <Link
            href="/properties"
            className="relative px-2 py-1 rounded-md transition-colors hover:text-blue-600"
          >
            Properties
          </Link>
          <Link
            href="/contact"
            className="relative px-2 py-1 rounded-md transition-colors hover:text-blue-600"
          >
            Contact
          </Link>

          {mounted && (
            <>
              <button
                onClick={handleAddPropertyClick}
                className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 rounded-md"
              >
                Add Property
              </button>
              <AddPropertyModal
                opened={modalOpened}
                setOpened={setModalOpened}
              />

              <button
                onClick={() => router.push("/post-requirement")}
                className="bg-linear-to-tr from-green-700 to-indigo-900 text-white px-4 py-2 rounded-full hover:from-green-700 hover:to-indigo-700 transition-colors shadow-sm"
              >
                Post Requirement
              </button>

              {!isAuthenticated ? (
                <button
                  onClick={() => router.push("/login")}
                  className="bg-linear-to-tr from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-sm"
                >
                  Login
                </button>
              ) : (
                <ProfileMenu user={user} />
              )}
            </>
          )}
        </nav>

        {/* Mobile Icon */}
        <div
          className="md:hidden flex items-center gap-2 sm:gap-3 md:gap-4 bg-transparent transition-all cursor-pointer"
          onClick={toggleMenu}
        >
          {mounted && (
            <>
              {!isAuthenticated ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/login");
                  }}
                  className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full bg-[#4161df] text-white shadow-md"
                >
                  Login
                </button>
              ) : (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center hover:scale-105"
                >
                  <ProfileMenu user={user} />
                </div>
              )}
            </>
          )}

          <BiMenuAltRight
            size={28}
            className="sm:w-8 sm:h-8 text-black/90 hover:text-black hover:scale-105 transition-all"
          />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mounted && menuOpened && (
        <div className="md:hidden flex flex-col gap-3 sm:gap-4 bg-white/95 backdrop-blur text-black font-medium p-4 sm:p-5 md:p-6 shadow-xl absolute right-3 sm:right-4 top-14 sm:top-16 md:top-17.5 rounded-xl sm:rounded-2xl border w-[85vw] sm:w-[80vw] max-w-sm animate-in fade-in zoom-in-95">
          <Link
            href="/compare"
            onClick={toggleMenu}
            className="hover:text-blue-600 px-2 py-1.5 sm:py-2 rounded-md text-sm sm:text-base"
          >
            Compare {compareN > 0 ? `(${compareN})` : ""}
          </Link>
          <Link
            href="/saved-searches"
            onClick={toggleMenu}
            className="hover:text-blue-600 px-2 py-1.5 sm:py-2 rounded-md text-sm sm:text-base"
          >
            Saved searches
          </Link>
          <Link
            href="/properties"
            onClick={toggleMenu}
            className="hover:text-blue-600 px-2 py-1.5 sm:py-2 rounded-md text-sm sm:text-base"
          >
            Properties
          </Link>
          <Link
            href="/contact"
            onClick={toggleMenu}
            className="hover:text-blue-600 px-2 py-1.5 sm:py-2 rounded-md text-sm sm:text-base"
          >
            Contact
          </Link>
          <button
            onClick={() => {
              toggleMenu();
              handleAddPropertyClick();
            }}
            className="text-left hover:text-blue-600 px-2 py-1.5 sm:py-2 rounded-md text-sm sm:text-base"
          >
            Add Property
          </button>

          <button
            onClick={() => router.push("/post-requirement")}
            className="bg-linear-to-tr from-green-700 to-indigo-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:from-green-700 hover:to-indigo-700 text-sm sm:text-base"
          >
            Post Requirement
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
