import React from "react";
import ContactBanner from "@/components/ContactBanner";
import UniqueSection from "@/components/UniqueSection";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import ContactForm from "@/components/ContactForm";
const page = () => {
  return (
    <>
      <ContactBanner
        title="Contact Us"
        subtitle="Our team will get back to you shortly."
        image="/tricity.png"
      />

      <SocialMediaLinks />
      <ContactForm />
      {/* <UniqueSection /> */}
    </>
  );
};

export default page;
