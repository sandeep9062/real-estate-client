import { Metadata } from "next";
import WhyPropertyBulbul from "@/components/WhyPropertyBulbul";
import React from "react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Propertybulbul",
  description:
    "Read the terms and conditions of Propertybulbul. By using our platform, you agree to these terms.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://propertybulbul.com/terms",
  },
};

const page = () => {
  return (
    <>
      <div className="pt-20">terms</div>
      <WhyPropertyBulbul />
    </>
  );
};

export default page;
