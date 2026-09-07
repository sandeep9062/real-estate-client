import React from "react";
import ContactBanner from "@/components/ContactBanner";

import SocialMediaLinks from "@/components/SocialMediaLinks";
import ContactForm from "@/components/ContactForm";
const page = () => {
  return (
    <>
      <ContactBanner
        title="Connect With Tricity Property Experts"
        subtitle="Whether you are buying your first home, selling a property, or exploring investment opportunities — get the local insights you need to make confident decisions."
        image="/contact-banner.png"
      />

      <ContactForm />
    </>
  );
};

export default page;
