"use client";
import React from "react";
import Image from "next/image";
import { useGetDevelopersQuery } from "@/services/developersApi";
import Link from "next/link";
import { ExternalLink, Building } from "lucide-react";

export default function DevelopersPage() {
  const { data: developers, isLoading } = useGetDevelopersQuery({});

  return (
    <div className="max-w-7xl pt-20 mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Top Developers in Tricity
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Partnering with the most trusted names in Chandigarh, Mohali, &
          Panchkula
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {developers?.map((dev: any) => (
          <Link key={dev._id} href={`/developers/${dev._id}`}>
            <div className="group bg-white border rounded-2xl p-6 hover:shadow-xl transition-all text-center flex flex-col items-center">
              <div className="w-24 h-24 mb-4 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all relative">
                <Image
                  src={dev.logo}
                  alt={dev.name}
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
              <h3 className="font-bold text-gray-800 group-hover:text-blue-600">
                {dev.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                View Active Projects →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
