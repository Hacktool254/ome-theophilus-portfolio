"use client";

import { useState, useEffect } from "react";
import { Preloader } from "@/components/Preloader";
import { CustomCursor } from "@/components/CustomCursor";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { ManifestoFlow } from "@/components/ManifestoFlow";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Stack } from "@/components/sections/Stack";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { ScrollOrchestrator } from "@/components/ScrollOrchestrator";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!showContent) return;
    let cleanup: (() => void) | undefined;
    (async () => {
      const { default: Lenis } = await import("lenis");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ScrollTrigger.update);
      cleanup = () => { lenis.destroy(); };
    })();
    return () => cleanup?.();
  }, [showContent]);

  return (
    <>
      <div className="noise-overlay" />
      <TopBar />
      <CustomCursor />
      <Preloader onDone={() => setShowContent(true)} />
      <AnimatePresence>
        {showContent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <ScrollOrchestrator />
            <Navbar />
            <main>

              {/* 1. Hero — normal scroll */}
              <Hero />

              {/* 2. About-scene: 200dvh. About sticky inside, slides over Hero.
                      Second 100dvh: About halves split. Projects fades in simultaneously. */}
              <div id="about-scene" className="about-scene" style={{ position: "relative", zIndex: 10, minHeight: "200dvh", marginTop: "-48px" }}>
                <About />
              </div>

              {/* 3. Projects — comes after about-scene, sticky for horizontal pin */}
              <div id="projects-section" style={{ position: "relative", zIndex: 10, marginTop: "-48px" }}>
                <Projects />
              </div>

              {/* 4. Marquee */}
              <ManifestoFlow items={["TypeScript","Next.js","AWS Bedrock","Framer Motion","React Native","Claude AI","Node.js","GSAP","SQLite","Docker"]} />

              {/* 5. Stack sticks, Contact slides over */}
              <Stack />
              <Contact />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
