"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaPinterestP,
  FaGoogle,
} from "react-icons/fa";

const socialLinks = [
  {
    icon: <FaGoogle />,
    href: "https://www.google.com/maps?cid=YOUR_GOOGLE_BUSINESS_ID",
    label: "Google Business Profile",
    color: "hover:text-green-700",
  },

  {
    icon: <FaFacebookF />,
    href: "https://facebook.com/propertybulbul",
    label: "Facebook",
    color: "hover:text-blue-800",
  },

  {
    icon: <FaInstagram />,
    href: "https://www.instagram.com/property_bulbul",
    label: "Instagram",
    color: "hover:text-pink-600",
  },

  {
    icon: <FaYoutube />,
    href: "http://www.youtube.com/@PropertyBulbul",
    label: "YouTube",
    color: "hover:text-red-600",
  },

  {
    icon: <FaLinkedinIn />,
    href: "https://www.linkedin.com/in/property-bulbul",
    label: "LinkedIn",
    color: "hover:text-blue-700",
  },

  {
    icon: <FaTwitter />,
    href: "https://x.com/PropertyBulbul",
    label: "Twitter",
    color: "hover:text-blue-500",
  },

  {
    icon: <FaPinterestP />,
    href: "https://pinterest.com/propertybulbul",
    label: "Pinterest",
    color: "hover:text-red-600",
  },
];

export default function SocialMediaLinks() {
  return (
    <section className="text-center py-2 sm:py-3 bg-white dark:bg-[#0F111A]">
      <div className="flex justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 flex-wrap px-2">
        {socialLinks.map((item, i) => (
          <a
            key={i}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className={`text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 hover:scale-110 transition duration-300 ${item.color}`}
          >
            {item.icon}
          </a>
        ))}
      </div>
    </section>
  );
}
