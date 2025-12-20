"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BiMenuAltRight } from "react-icons/bi";
import AddPropertyModal from "./AddPropertyModal";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ProfileMenu from "./ProfileMenu";
import { selectIsAuthenticated, selectUser } from "../store/authSlice";
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

  const toggleMenu = () => setMenuOpened((prev) => !prev);

  //const cities = ["new york", "los angeles", "chicago", "houston", "miami"];
  //const [selectedCity, setSelectedCity] = useState(cities[0]);

  const handleAddPropertyClick = () => {
    if (isAuthenticated) {
      setModalOpened(true);
    } else {
      router.push("/auth");
    }
  };

  return (
    <header
      className={`sticky top-0 z-1150 w-full border-b border-border/40 backdrop-blur supports-backdrop-filter:bg-background/60 transition-all ${
        scrolled ? "bg-white/80 shadow-sm" : "bg-background/60"
      }`}
    >
      <div className="max-w-[96vw] mx-auto flex items-center justify-between px-4 py-1 md:py-[0.3rem]">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Go to homepage"
        >
          <Image
            src="/bulbul-icon.png"
            alt="Property bulbul logo"
            width={60}
            height={60}
            priority
            className="transition-transform duration-300 group-hover:scale-[1.03]"
          />

          <div className="hidden md:flex flex-col leading-tight">
            <h1 className="text-[22px] font-extrabold tracking-tight">
              Property
            </h1>

            <h2 className="text-[20px] font-extrabold text-[#4161df] tracking-tight">
              Bulbul
            </h2>
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
                  onClick={() => router.push("/auth")}
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
          className="md:hidden flex items-center gap-4 bg-transparent transition-all cursor-pointer"
          onClick={toggleMenu}
        >
          {mounted && (
            <>
              {!isAuthenticated ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/auth");
                  }}
                  className="px-4 py-1.5 text-sm font-medium rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white shadow-md"
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
            size={32}
            className="text-black/90 hover:text-black hover:scale-105 transition-all"
          />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mounted && menuOpened && (
        <div className="md:hidden flex flex-col gap-5 bg-white/95 backdrop-blur text-black font-medium p-6 shadow-xl absolute right-4 top-[70px] rounded-2xl border w-[80vw] max-w-sm animate-in fade-in zoom-in-95">
          <Link
            href="/properties"
            onClick={toggleMenu}
            className="hover:text-blue-600 px-2 py-1 rounded-md"
          >
            Properties
          </Link>
          <Link
            href="/contact"
            onClick={toggleMenu}
            className="hover:text-blue-600 px-2 py-1 rounded-md"
          >
            Contact
          </Link>
          <button
            onClick={() => {
              toggleMenu();
              handleAddPropertyClick();
            }}
            className="text-left hover:text-blue-600 px-2 py-1 rounded-md"
          >
            Add Property
          </button>

          <button
            onClick={() => router.push("/post-requirement")}
            className="bg-linear-to-tr from-green-700 to-indigo-900 text-white px-4 py-2 rounded-full hover:from-green-700 hover:to-indigo-700"
          >
            Post Requirement
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
