import { Metadata } from "next";
import Link from "next/link";
import { Home, Search } from "lucide-react";
import NotFoundBackButton from "./NotFoundBackButton";

export const metadata: Metadata = {
  title: "Page Not Found | PropertyBulbul",
  description:
    "The page you're looking for doesn't exist. Browse properties for sale and rent in Chandigarh, Panchkula, and Mohali on PropertyBulbul.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-black text-[#4161df]/10 tracking-tighter">
            404
          </h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Page Not Found</h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved, deleted, or never existed.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-[#4161df] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4161df]/90 transition-colors shadow-lg shadow-blue-200"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <Link
            href="/properties"
            className="flex items-center justify-center gap-2 bg-white text-[#4161df] border-2 border-[#4161df] px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
          >
            <Search size={18} />
            Browse Properties
          </Link>
        </div>

        <div className="mt-8">
          <NotFoundBackButton />
        </div>

        {/* Suggested Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Popular Pages</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Properties", href: "/properties" },
              { label: "Projects", href: "/projects" },
              { label: "Journal", href: "/journal" },
              { label: "Contact Us", href: "/contact" },
              { label: "Services", href: "/services" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-[#4161df] bg-white px-4 py-2 rounded-full border border-gray-200 hover:border-[#4161df] transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
