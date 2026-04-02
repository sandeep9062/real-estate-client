"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Testimonial from "./Testimonial";
import GetStarted from "./GetStarted";

const TestimonialGetStartedWrapper = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create animated bubble pattern background
      const bubblesContainer = bubblesRef.current;
      if (bubblesContainer) {
        const bubbleCount = 30;

        for (let i = 0; i < bubbleCount; i++) {
          const bubble = document.createElement("div");
          const size = Math.random() * 100 + 40;
          const startX = Math.random() * 100;
          const startY = Math.random() * 100 + 20;

          bubble.className = "absolute rounded-full";
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          bubble.style.left = `${startX}%`;
          bubble.style.top = `${startY}%`;
          // Visible bubbles with #4161df color
          const opacity = Math.random() * 0.15 + 0.05;
          bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(65, 97, 223, ${opacity + 0.1}), rgba(65, 97, 223, ${opacity}) 40%, transparent 70%)`;
          bubble.style.border = `1px solid rgba(65, 97, 223, ${opacity + 0.2})`;
          bubble.style.boxShadow = `inset 0 0 ${size * 0.2}px rgba(65, 97, 223, ${opacity}), 0 0 ${size * 0.1}px rgba(65, 97, 223, ${opacity * 0.5})`;

          bubblesContainer.appendChild(bubble);

          // Float upward animation (like bubbles rising) - faster for visibility
          gsap.to(bubble, {
            y: -300 - Math.random() * 400,
            duration: Math.random() * 10 + 8,
            repeat: -1,
            ease: "none",
            delay: Math.random() * 5,
          });

          // Horizontal sway motion - more pronounced
          gsap.to(bubble, {
            x: (Math.random() - 0.5) * 200,
            duration: Math.random() * 6 + 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 2,
          });

          // Pulse size (breathing effect) - more noticeable
          gsap.to(bubble, {
            scale: Math.random() * 0.4 + 0.8,
            duration: Math.random() * 4 + 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 2,
          });

          // Opacity shimmer - more visible range
          gsap.to(bubble, {
            opacity: Math.random() * 0.5 + 0.3,
            duration: Math.random() * 3 + 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 2,
          });
        }
      }

      // Add subtle mouse parallax effect
      let mouseX = 0,
        mouseY = 0;
      let currentX = 0,
        currentY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        mouseY = (e.clientY - rect.top) / rect.height - 0.5;
      };

      // Smooth parallax animation loop
      const parallaxTicker = gsap.ticker.add(() => {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        // Parallax for bubbles
        if (bubblesContainer) {
          gsap.set(bubblesContainer, {
            x: currentX * 20,
            y: currentY * 20,
          });
        }
      });

      sectionRef.current?.addEventListener("mousemove", handleMouseMove);

      return () => {
        sectionRef.current?.removeEventListener("mousemove", handleMouseMove);
        gsap.ticker.remove(parallaxTicker);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative overflow-hidden">
      {/* Animated Bubble Pattern Background */}
      <div
        ref={bubblesRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      />
      <section className=" bg-white/60 relative z-10">
        <Testimonial />
      </section>
      <section className="bg-white/60 relative z-10">
        <GetStarted />
      </section>
    </div>
  );
};

export default TestimonialGetStartedWrapper;
