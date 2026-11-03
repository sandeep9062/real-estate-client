"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BiMenuAltRight } from "react-icons/bi";

import { useSelector } from "react-redux";
import Image from "next/image";
import ProfileMenu from "./ProfileMenu";
import { selectIsAuthenticated, selectUser } from "../store/authSlice";
import { compareCount } from "@/lib/compareStorage";
import { cn } from "@/lib/utils";

// Scroll threshold (px) after which the header leaves the hero and turns solid.
const SCROLL_THRESHOLD = 20;

const Header: React.FC = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Same initial value on server and client to avoid hydration mismatch.
  const [scrolled, setScrolled] = useState(false);
  const [compareN, setCompareN] = useState(0);

  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const headerRef = useRef<HTMLElement>(null);

  // Transparent ONLY on the homepage while at the top of the page.
  // Every other route (or homepage once scrolled) uses the solid style.
  const transparent = pathname === "/" && !scrolled;

  const toggleMenu = () => setMenuOpened((prev) => !prev);
  const closeMenu = useCallback(() => setMenuOpened(false), []);

  // Close the mobile panel when the route changes.
  useEffect(() => {
    const id = setTimeout(() => closeMenu(), 0);
    return () => clearTimeout(id);
  }, [pathname, closeMenu]);

  // Mounted flag keeps SSR/html in sync (client-only hydration gating).
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  // Track scroll. Runs once immediately so a page that loads already
  // scrolled (or a route change) gets the correct state.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Compare badge live updates.
  useEffect(() => {
    const refresh = () => setCompareN(compareCount());
    refresh();
    window.addEventListener("pb-compare-changed", refresh);
    return () => window.removeEventListener("pb-compare-changed", refresh);
  }, []);

  // Close the mobile panel on outside clicks and on Escape.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuOpened || !headerRef.current) return;
      if (!headerRef.current.contains(e.target as Node)) closeMenu();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpened, closeMenu]);

  const handleAddPropertyClick = () => {
    if (isAuthenticated) {
      router.push("/add-property");
    } else {
      router.push("/login");
    }
  };

  const isActive = (href: string) => pathname === href;

  const navLinkClasses = (href: string) =>
    cn(
      "min-h-[44px] flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      transparent
        ? cn(
            "text-white/90 hover:text-white",
            isActive(href)
              ? "text-white underline underline-offset-4 decoration-white"
              : "focus-visible:ring-white/60",
          )
        : cn(
            "text-slate-600 hover:text-slate-900",
            isActive(href)
              ? "text-slate-900 font-semibold underline underline-offset-4 decoration-[#4161df]"
              : "focus-visible:ring-[#4161df]/60",
          ),
    );

  const primaryButtonClasses =
    "min-h-[44px] px-5 py-2.5 rounded-full text-sm font-medium bg-[#4161df] text-white shadow-lg shadow-[#4161df]/30 transition-colors hover:bg-[#3654cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2 active:bg-[#3654cc]";

  const outlineButtonClasses = cn(
    "min-h-[44px] px-5 py-2.5 rounded-full text-sm font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97]",
    transparent
      ? "border-white text-white bg-transparent hover:bg-white/20 focus-visible:ring-white"
      : "border-slate-300 text-slate-800 bg-transparent hover:bg-slate-100 hover:border-slate-400 focus-visible:ring-[#4161df]",
  );

  const ghostButtonClasses = cn(
    "min-h-[44px] px-5 py-2.5 rounded-full text-sm font-medium transition-colors active:scale-[0.97]",
    transparent
      ? "text-white hover:underline underline-offset-4"
      : "text-slate-600 hover:text-slate-900 hover:underline underline-offset-4",
  );

  const mobileItemClasses = (href: string) =>
    cn(
      "block min-h-[46px] flex items-center rounded-lg px-4 py-3.5 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-1",
      isActive(href) ? "bg-[#4161df]/10 text-[#4161df] font-semibold" : "",
    );

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-1150 w-full transition-colors duration-300",
        transparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200",
      )}
    >
      <div className="max-w-[96vw] mx-auto flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2 md:py-1.5">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 sm:gap-2 group"
          aria-label="Go to homepage"
        >
          <Image
            src="/bulbul-icon.png"
            alt="Property Bulbul logo"
            width={38}
            height={38}
            priority
            className={cn(
              "w-12 h-12 sm:w-10 sm:h-10 md:w-14 md:h-14 transition-all duration-300 group-hover:scale-[1.04]",
              // Only one logo asset exists, so force it white over the hero.
              // Needs a transparent-background PNG; otherwise add a white
              // logo file to /public and switch `src` based on `transparent`.

              // transparent && "brightness-0 invert",
            )}
          />

          <div className="hidden md:flex flex-col leading-tight">
            <span
              className={cn(
                "text-[22px] font-extrabold tracking-tight transition-colors duration-300",
                transparent ? "text-white" : "text-slate-900",
              )}
            >
              Property
            </span>

            <span
              className={cn(
                "text-[20px] font-extrabold tracking-tight transition-colors duration-300",
                transparent ? "text-white" : "text-[#4161df]",
              )}
            >
              Bulbul
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3 font-medium">
          <Link
            href="/saved-searches"
            aria-current={isActive("/saved-searches") ? "page" : undefined}
            className={navLinkClasses("/saved-searches")}
            onClick={closeMenu}
          >
            Saved searches
          </Link>
          <Link
            href="/properties"
            aria-current={isActive("/properties") ? "page" : undefined}
            className={navLinkClasses("/properties")}
            onClick={closeMenu}
          >
            Properties
          </Link>

          {mounted && (
            <>
              <button
                onClick={handleAddPropertyClick}
                className={primaryButtonClasses}
              >
                Add Property
              </button>

              <button
                onClick={() => router.push("/post-requirement")}
                className={outlineButtonClasses}
              >
                Post Requirement
              </button>

              {!isAuthenticated ? (
                <button
                  onClick={() => router.push("/login")}
                  className={ghostButtonClasses}
                >
                  Login
                </button>
              ) : (
                <ProfileMenu user={user} />
              )}
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            aria-label={
              menuOpened ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpened}
            aria-controls="mobile-menu"
            className={cn(
              "flex items-center justify-center p-2 sm:p-2.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              transparent
                ? "text-white hover:bg-white/20 focus-visible:ring-white"
                : "text-slate-700 hover:bg-slate-100 focus-visible:ring-[#4161df]",
            )}
          >
            <BiMenuAltRight size={28} className="sm:w-8 sm:h-8" />
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {menuOpened && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-slate-200 bg-white shadow-lg"
        >
          <nav className="flex flex-col gap-1 p-3">
            <Link
              href="/saved-searches"
              className={mobileItemClasses("/saved-searches")}
              onClick={closeMenu}
            >
              Saved searches
            </Link>
            <Link
              href="/properties"
              className={mobileItemClasses("/properties")}
              onClick={closeMenu}
            >
              Properties
            </Link>

            {mounted && (
              <>
                <button
                  onClick={() => {
                    closeMenu();
                    handleAddPropertyClick();
                  }}
                  className={cn(primaryButtonClasses, "mt-2 w-full")}
                >
                  Add Property
                </button>

                <button
                  onClick={() => {
                    closeMenu();
                    router.push("/post-requirement");
                  }}
                  className="min-h-[44px] w-full rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100"
                >
                  Post Requirement
                </button>

                {!isAuthenticated ? (
                  <button
                    onClick={() => {
                      closeMenu();
                      router.push("/login");
                    }}
                    className="min-h-[44px] w-full rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    Login
                  </button>
                ) : (
                  <div className="px-1 pt-2">
                    <ProfileMenu user={user} />
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
