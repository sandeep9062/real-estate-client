"use client";

import React from "react";
import {
  AboutHero,
  AboutMission,
  AboutDifferentiators,
  AboutVision,
  AboutWhoWeHelp,
  AboutCTA,
  AboutStory,
  AboutOurValues,
  AboutPropertyBulbulToday,
} from "@/components/about";

const AboutPage = () => {
  return (
    <div className="w-full bg-white overflow-x-hidden">
      <AboutHero />
      <AboutStory />
      <AboutMission />
      <AboutDifferentiators />
      <AboutVision />
      <AboutWhoWeHelp />
      <AboutOurValues />
      <AboutPropertyBulbulToday />
      <AboutCTA />
    </div>
  );
};

export default AboutPage;
