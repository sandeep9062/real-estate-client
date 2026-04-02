"use client";

import Image from "next/image";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const categories = [
  {
    image: "/pexels-cottonbro-7440131.jpg",
    label: "Hair Fall",
    color: "text-red-500",
    ring: "group-hover:ring-red-500/40",
    desc: "Reduce shedding",
  },
  {
    image: "/pexels-greta-hoffman-9475715.jpg",
    label: "Hair Transplant",
    color: "text-primary",
    ring: "group-hover:ring-primary/40",
    desc: "Permanent density",
  },
  {
    image: "/pexels-lona-768578436-30175224.jpg",
    label: "Alopecia",
    color: "text-blue-500",
    ring: "group-hover:ring-blue-500/40",
    desc: "Clinical regrowth",
  },
  {
    image: "/pexels-adriannacalvo-23384617.jpg",
    label: "Scalp Analysis",
    color: "text-emerald-500",
    ring: "group-hover:ring-emerald-500/40",
    desc: "Root diagnosis",
  },
  {
    image: "/pexels-ron-lach-9165673 (1).jpg",
    label: "Natural Therapy",
    color: "text-green-500",
    ring: "group-hover:ring-green-500/40",
    desc: "Ayurvedic care",
  },
  {
    image: "/pexels-ron-lach-10669105.jpg",
    label: "PRP / GFC",
    color: "text-amber-500",
    ring: "group-hover:ring-amber-500/40",
    desc: "Growth boosters",
  },
];

const CategorySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bubblesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create animated bubble pattern background
      const bubblesContainer = bubblesRef.current;
      if (bubblesContainer) {
        const bubbleCount = 10;

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
    <section
      ref={sectionRef}
      className="relative py-16 overflow-hidden md:py-20 lg:py-28 bg-background"
    >
      {/* Animated Bubble Pattern Background */}
      <div
        ref={bubblesRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      />

      <div className="container relative px-4 mx-auto">
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-12 text-center md:mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 text-xs font-semibold tracking-widest uppercase border rounded-full bg-primary/10 border-primary/20 text-primary">
            Tailored Solutions
          </div>

          <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight md:mt-6 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            What brings you here <span className="italic text-primary">?</span>
          </h2>

          <p className="mt-3 text-sm md:mt-4 sm:text-base md:text-lg text-muted-foreground">
            Choose your concern and unlock personalized, science-backed hair
            treatments designed just for you.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 md:gap-5 lg:gap-6">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative h-40 sm:h-44 md:h-48 lg:h-52 overflow-hidden transition-all duration-500 border-[0.5px] group rounded-2xl md:rounded-3xl border-border/60 hover:border-primary/40 backdrop-blur-xl hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
              </div>

              {/* Text Overlay on Image */}
              <div className="relative z-10 flex flex-col justify-end h-full p-3 text-center md:p-4">
                <h3 className="text-xs font-semibold tracking-tight text-white transition-colors duration-300 sm:text-sm md:text-base drop-shadow-lg line-clamp-2">
                  {cat.label}
                </h3>
                <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-widest text-white/80 drop-shadow-md">
                  {cat.desc}
                </p>
              </div>

              {/* Arrow */}
              <div className="absolute z-10 transition opacity-0 top-2 right-2 md:top-3 md:right-3 group-hover:opacity-100">
                <ChevronRight size={14} className="md:size-16 text-white/80" />
              </div>

              {/* Bottom Bar */}
              <div className="absolute z-10 w-5 h-1 transition-all duration-500 -translate-x-1/2 rounded-full md:w-6 bottom-2 left-1/2 bg-white/30 group-hover:w-12 md:group-hover:w-14 group-hover:bg-primary" />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
