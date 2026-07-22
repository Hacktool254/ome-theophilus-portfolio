"use client";

import Image from "next/image";
import { SITE } from "@/lib/data";

/**
 * About sits on top of Projects inside #split-scene.
 * position:sticky, top:0, marginTop:-100dvh — overlaps Projects exactly.
 * GSAP scrubs #about-left and #about-right off screen during the
 * second 100dvh of split-scene, revealing Projects behind.
 */
export function About() {
  const facts = [
    { label: "Based in",  value: "Nairobi, Kenya" },
    { label: "Focus",     value: "AI Systems & Automation" },
    { label: "Agency",    value: "Sentinel Hills" },
    { label: "Available", value: "For new projects" },
  ];

  return (
    <div
      id="about-wrap"
      style={{
        position: "sticky",
        top: 0,
        height: "100dvh",
        zIndex: 2,
        borderRadius: "32px 32px 0 0",
        overflow: "hidden",
      }}
    >
      {/* LEFT HALF */}
      <div
        id="about-left"
        style={{
          position: "absolute",
          left: 0, top: 0,
          width: "50%", height: "100%",
          background: "#161416",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 48px 80px 64px",
          gap: 20,
          willChange: "transform",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="glow-dot" />
          <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#47b76e", fontFamily: "Inter, sans-serif" }}>About</span>
        </div>

        <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.025em", color: "#f0f2f0", fontFamily: "Inter, sans-serif" }}>
          Building the future,<br />
          <span style={{ color: "#47b76e" }}>one system at a time.</span>
        </h2>

        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#8a9188", fontFamily: "Inter, sans-serif" }}>
          Developer specializing in AI-powered systems, automation pipelines, and full-stack applications — from multi-agent orchestrators to mobile apps.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#8a9188", fontFamily: "Inter, sans-serif" }}>
          Running <strong style={{ color: "#f0f2f0" }}>Sentinel Hills</strong> — an AI automation agency building custom solutions for businesses across Africa and beyond.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 380 }}>
          {facts.map(f => (
            <div key={f.label} style={{ padding: "12px 14px", borderRadius: 10, background: "#1e201f", border: "1px solid #2a2d2b" }}>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6358", marginBottom: 4, fontFamily: "Inter, sans-serif" }}>{f.label}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#f0f2f0", fontFamily: "Inter, sans-serif" }}>{f.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "GitHub", href: SITE.contact.github },
            { label: "LinkedIn", href: SITE.contact.linkedin },
            { label: "Instagram", href: SITE.contact.instagram },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              style={{ padding: "6px 14px", borderRadius: 9999, border: "1px solid #2a2d2b", fontSize: 12, fontWeight: 500, color: "#8a9188", textDecoration: "none", transition: "all 0.2s", fontFamily: "Inter, sans-serif" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#47b76e"; (e.currentTarget as HTMLAnchorElement).style.color = "#47b76e"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2a2d2b"; (e.currentTarget as HTMLAnchorElement).style.color = "#8a9188"; }}>
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* CENTER hairline */}
      <div style={{
        position: "absolute", left: "50%", top: "10%", height: "80%",
        width: 1, background: "#2a2d2b", zIndex: 3,
        transform: "translateX(-0.5px)", pointerEvents: "none",
      }} />

      {/* RIGHT HALF */}
      <div
        id="about-right"
        style={{
          position: "absolute",
          right: 0, top: 0,
          width: "50%", height: "100%",
          background: "#161416",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 64px 80px 48px",
          willChange: "transform",
        }}
      >
        <div style={{
          position: "relative",
          width: "min(360px,85%)",
          aspectRatio: "4/5",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #2a2d2b",
          background: "#1e201f",
        }}>
          <Image
            src="/assets/profile-ai.png"
            alt="Ome Theophilus"
            fill sizes="360px"
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(22,20,22,0.85) 0%, rgba(22,20,22,0.1) 60%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#f0f2f0", fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}>Ome Theophilus</p>
            <div style={{ display: "flex", gap: 8 }}>
              <span className="tag tag-green">AI Builder</span>
              <span className="tag tag-green">Full-Stack Dev</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
