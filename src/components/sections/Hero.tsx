"use client";

import { motion } from "framer-motion";
import { ParticleField } from "@/components/ParticleField";
import { HeroFace3D } from "@/components/HeroFace3D";
import { SITE } from "@/lib/data";

export function Hero() {
  return (
    <section id="hero" className="hero-section">
      <style>{`
        .hero-section {
          position: relative;
          z-index: 0;
          min-height: 100dvh;
          display: flex;
          overflow: hidden;
          background: #161416;
        }
        .hero-left {
          width: 50%;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 120px 40px 80px 60px;
          z-index: 1;
          gap: 24px;
        }
        .hero-right {
          width: 50%;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        .hero-h1 {
          font-size: clamp(2.4rem, 5.5vw, 5rem);
          font-weight: 700;
          line-height: 1.0;
          letter-spacing: -0.03em;
          color: #f0f2f0;
          font-family: Inter, sans-serif;
          white-space: pre-line;
          margin: 0;
        }
        .hero-bio {
          font-size: clamp(0.9rem, 1.3vw, 1.05rem);
          line-height: 1.7;
          color: #c0c8be;
          max-width: 440px;
          font-family: Inter, sans-serif;
        }
        @media (max-width: 768px) {
          .hero-section {
            flex-direction: column;
          }
          .hero-left {
            width: 100%;
            padding: 100px 24px 32px;
            gap: 16px;
          }
          .hero-right {
            width: 100%;
            height: 60vw;
            min-height: 260px;
            max-height: 400px;
            flex-shrink: 0;
          }
          .hero-h1 {
            font-size: clamp(2rem, 9vw, 3rem);
          }
          .hero-bio {
            font-size: 0.9rem;
            max-width: 100%;
          }
        }
      `}</style>

      <ParticleField />

      {/* LEFT */}
      <div className="hero-left">
        <div style={{ position: "absolute", top: "40%", left: "20%", transform: "translate(-50%,-50%)", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(71,183,110,0.07) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 20 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 9999, background: "rgba(71,183,110,0.12)", border: "1px solid rgba(71,183,110,0.3)", width: "fit-content" }}
          >
            <span className="glow-dot" />
            <span style={{ fontSize: 12, fontWeight: 500, color: "#47b76e", letterSpacing: "0.06em", fontFamily: "Inter, sans-serif" }}>
              Available for projects · {SITE.location}
            </span>
          </motion.div>

          {["Developer.", "AI Builder.", "Automation\nEngineer."].map((word, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <motion.h1
                className="hero-h1"
                initial={{ y: "100%" }} animate={{ y: "0%" }}
                transition={{ duration: 0.8, delay: 0.55 + i * 0.11, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.h1>
            </div>
          ))}

          <motion.p className="hero-bio" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.05 }}>
            {SITE.bio}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2 }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#projects"
              onClick={(e) => { e.preventDefault(); document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{ padding: "12px 28px", borderRadius: 9999, background: "#47b76e", color: "#161416", fontSize: 14, fontWeight: 700, textDecoration: "none", transition: "all 0.2s", fontFamily: "Inter, sans-serif", display: "inline-flex", alignItems: "center", gap: 8 }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#5ecf83"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#47b76e"; }}>
              View Work
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
            <a href={`mailto:${SITE.contact.email}`}
              style={{ padding: "12px 28px", borderRadius: 9999, background: "rgba(255,255,255,0.08)", color: "#c0c8be", fontSize: 14, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)", transition: "all 0.2s", fontFamily: "Inter, sans-serif" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#47b76e"; (e.currentTarget as HTMLAnchorElement).style.color = "#f0f2f0"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLAnchorElement).style.color = "#c0c8be"; }}>
              Hire Me
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.45 }}
            style={{ display: "flex", gap: 36, marginTop: 8 }}>
            {[{ value: "16+", label: "Projects" }, { value: "3+", label: "Years" }, { value: "8+", label: "Stacks" }].map(s => (
              <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "#f0f2f0", fontFamily: "Inter, sans-serif" }}>{s.value}</span>
                <span style={{ fontSize: 10, color: "#8a9188", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "Inter, sans-serif" }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* RIGHT */}
      <motion.div
        className="hero-right"
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <HeroFace3D />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #161416 0%, transparent 18%)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "20%", background: "linear-gradient(to top, rgba(22,20,22,0.85), transparent)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 28, left: 24, zIndex: 2, pointerEvents: "none" }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#f0f2f0", fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}>{SITE.name}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="glow-dot" style={{ width: 5, height: 5 }} />
            <p style={{ fontSize: 11, color: "#47b76e", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>AI Builder · Nairobi</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, #47b76e)" }} />
      </motion.div>
    </section>
  );
}
