"use client";

import { useRef } from "react";
import { Icon } from "@iconify/react";
import { PROJECTS } from "@/lib/data";

const TECH_ICONS: Record<string, string> = {
  "TypeScript":       "logos:typescript-icon",
  "JavaScript":       "logos:javascript",
  "Python":           "logos:python",
  "Next.js":          "logos:nextjs-icon",
  "React":            "logos:react",
  "React Native":     "logos:react",
  "Tailwind":         "logos:tailwindcss-icon",
  "Tailwind CSS":     "logos:tailwindcss-icon",
  "Framer Motion":    "logos:framer",
  "Node.js":          "logos:nodejs-icon",
  "Express":          "simple-icons:express",
  "Convex":           "simple-icons:convex",
  "Expo":             "simple-icons:expo",
  "Electron":         "logos:electron",
  "SQLite":           "logos:sqlite",
  "PostgreSQL":       "logos:postgresql",
  "MongoDB":          "logos:mongodb-icon",
  "Docker":           "logos:docker-icon",
  "AWS Bedrock":      "logos:aws",
  "AWS":              "logos:aws",
  "AI/LLM":           "simple-icons:anthropic",
  "AI":               "simple-icons:anthropic",
  "Anthropic":        "simple-icons:anthropic",
  "OpenAI":           "simple-icons:openai",
  "LangChain":        "simple-icons:langchain",
  "Telegram":         "logos:telegram",
  "GitHub Actions":   "logos:github-actions",
  "Chrome Extension": "logos:chrome",
  "Proxy":            "mdi:vpn",
  "Security":         "mdi:shield-check",
  "Encryption":       "mdi:lock",
  "Web":              "mdi:web",
  "Nmap":             "simple-icons:nmap",
  "OWASP ZAP":        "simple-icons:owasp",
  "CSS":              "logos:css-3",
  "Various":          "mdi:code-tags",
};

const GRADIENTS = [
  "radial-gradient(ellipse at 30% 40%, #1a3a24 0%, #0d1a12 60%, #0a1208 100%)",
  "radial-gradient(ellipse at 70% 30%, #2d1a4a 0%, #1a0d2e 60%, #110a1c 100%)",
  "radial-gradient(ellipse at 50% 60%, #1a3a24 0%, #1a0d2e 80%, #0f0d14 100%)",
  "radial-gradient(ellipse at 20% 50%, #2e2210 0%, #1a1409 80%, #0f0e0a 100%)",
  "radial-gradient(ellipse at 80% 20%, #2e1a1a 0%, #1a0d0d 80%, #140a0a 100%)",
  "radial-gradient(ellipse at 40% 70%, #1a2e2e 0%, #0d1a1a 80%, #0a1111 100%)",
];

export function Projects() {
  const barRef = useRef<HTMLDivElement>(null);

  return (
    <>
    <style>{`
      @media (max-width: 768px) {
        #projects {
          height: auto !important;
          position: relative !important;
          overflow-y: visible !important;
        }
        [data-projects-track] {
          flex-direction: column !important;
          height: auto !important;
          padding: 16px 16px 32px !important;
          gap: 16px !important;
          overflow-x: hidden !important;
        }
        [data-projects-track] > div {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          max-height: none !important;
          flex-shrink: unset !important;
        }
        .proj-header {
          padding: 32px 20px 0 !important;
        }
      }
    `}</style>
    <div
      id="projects"
      data-projects-wrap
      style={{
        position: "sticky",
        top: 0,
        height: "100dvh",
        background: "#161416",
        borderRadius: "32px 32px 0 0",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        /* hidden until About splits — ScrollOrchestrator fades this in */
        opacity: 0,
      }}
    >
      {/* Header */}
      <div className="proj-header" style={{ padding: "48px 60px 0", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span className="glow-dot" />
          <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#47b76e", fontFamily: "Inter, sans-serif" }}>Work</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.025em", color: "#f0f2f0", fontFamily: "Inter, sans-serif" }}>
            Selected projects.
          </h2>
          <a href="https://github.com/Hacktool254" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 13, fontWeight: 600, color: "#47b76e", textDecoration: "none", fontFamily: "Inter, sans-serif" }}>
            All on GitHub ↗
          </a>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 14, height: 1, background: "#2a2d2b" }}>
          <div ref={barRef} data-proj-bar style={{ height: "100%", width: "0%", background: "linear-gradient(90deg,#47b76e,#7b2d8b)", transition: "width 0.06s linear" }} />
        </div>
      </div>

      {/* Horizontal track */}
      <div
        data-projects-track
        style={{
          display: "flex",
          alignItems: "center",
          height: "calc(100dvh - 130px)",
          gap: 20,
          paddingLeft: 60,
          paddingRight: 60,
          willChange: "transform",
          position: "relative",
          zIndex: 1,
        }}
      >
        {PROJECTS.map((project, i) => (
          <div
            key={project.slug}
            style={{
              flexShrink: 0,
              width: 320,
              height: "calc(100dvh - 160px)",
              maxHeight: 720,
              borderRadius: 16,
              overflow: "hidden",
              background: "#1e201f",
              border: "1px solid #2a2d2b",
              display: "flex",
              flexDirection: "column",
              transition: "border-color 0.25s, box-shadow 0.25s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(71,183,110,0.45)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 40px rgba(71,183,110,0.08)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#2a2d2b";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            {/* Image */}
            <div style={{ position: "relative", width: "100%", height: "48%", flexShrink: 0, overflow: "hidden", background: GRADIENTS[i % GRADIENTS.length] }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/projects/${project.slug}.png`}
                alt={project.name}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(22,20,22,0.88) 0%, transparent 55%)" }} />
              <div style={{ position: "absolute", top: 10, left: 12, right: 12, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#5a6358", background: "rgba(22,20,22,0.75)", backdropFilter: "blur(8px)", padding: "2px 7px", borderRadius: 9999, border: "1px solid #2a2d2b", fontFamily: "Inter, sans-serif" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {project.isPrivate && (
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#5a6358", background: "rgba(22,20,22,0.75)", backdropFilter: "blur(8px)", padding: "2px 7px", borderRadius: 9999, border: "1px solid #2a2d2b", fontFamily: "Inter, sans-serif" }}>Private</span>
                )}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 8, flex: 1, minHeight: 0 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", color: "#f0f2f0", fontFamily: "Inter, sans-serif", lineHeight: 1.2 }}>{project.name}</h3>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: "#8a9188", fontFamily: "Inter, sans-serif", flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>{project.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {project.tech.slice(0, 4).map(t => (
                  <div key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 500, color: "#8a9188", background: "#1e201f", border: "1px solid #2a2d2b", padding: "4px 8px", borderRadius: 6, fontFamily: "Inter, sans-serif" }}>
                    {TECH_ICONS[t] && <Icon icon={TECH_ICONS[t]} width={13} height={13} style={{ flexShrink: 0 }} />}
                    <span>{t}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #2a2d2b", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: "#5a6358", fontFamily: "Inter, sans-serif", fontStyle: project.isPrivate ? "italic" : "normal" }}>{project.isPrivate ? "Private repo" : "Open source"}</span>
                <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 600, color: "#47b76e", textDecoration: "none", fontFamily: "Inter, sans-serif" }}>View ↗</a>
              </div>
            </div>
          </div>
        ))}

        {/* End card */}
        <div style={{ flexShrink: 0, width: 200, height: 280, borderRadius: 16, border: "1px dashed #2a2d2b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24, marginRight: 60 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#f0f2f0", fontFamily: "Inter, sans-serif", textAlign: "center" }}>More on GitHub</p>
          <a href="https://github.com/Hacktool254" target="_blank" rel="noopener noreferrer"
            style={{ padding: "6px 14px", borderRadius: 9999, border: "1px solid rgba(71,183,110,0.3)", fontSize: 11, fontWeight: 600, color: "#47b76e", textDecoration: "none", fontFamily: "Inter, sans-serif" }}>
            GitHub →
          </a>
        </div>
      </div>
    </div>
    </>
  );
}
