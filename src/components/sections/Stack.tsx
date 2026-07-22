"use client";

import { Icon } from "@iconify/react";

const STACK_WITH_ICONS = [
  {
    category: "Languages",
    items: [
      { name: "TypeScript", icon: "logos:typescript-icon" },
      { name: "JavaScript", icon: "logos:javascript" },
      { name: "Python", icon: "logos:python" },
    ],
  },
  {
    category: "Frontend",
    items: [
      { name: "Next.js", icon: "logos:nextjs-icon" },
      { name: "React", icon: "logos:react" },
      { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
      { name: "Framer Motion", icon: "logos:framer" },
    ],
  },
  {
    category: "Mobile",
    items: [
      { name: "React Native", icon: "logos:react" },
      { name: "Expo", icon: "simple-icons:expo" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", icon: "logos:nodejs-icon" },
      { name: "Express", icon: "simple-icons:express" },
      { name: "Convex", icon: "simple-icons:convex" },
    ],
  },
  {
    category: "AI / ML",
    items: [
      { name: "AWS Bedrock", icon: "logos:aws" },
      { name: "Anthropic Claude", icon: "simple-icons:anthropic" },
      { name: "LangChain", icon: "simple-icons:langchain" },
      { name: "OpenAI", icon: "simple-icons:openai" },
    ],
  },
  {
    category: "Databases",
    items: [
      { name: "SQLite", icon: "logos:sqlite" },
      { name: "PostgreSQL", icon: "logos:postgresql" },
      { name: "MongoDB", icon: "logos:mongodb-icon" },
    ],
  },
  {
    category: "DevOps",
    items: [
      { name: "Docker", icon: "logos:docker-icon" },
      { name: "GitHub Actions", icon: "logos:github-actions" },
      { name: "Electron", icon: "logos:electron" },
    ],
  },
  {
    category: "Security",
    items: [
      { name: "OWASP", icon: "simple-icons:owasp" },
      { name: "Nmap", icon: "simple-icons:nmap" },
      { name: "Pen Testing", icon: "mdi:shield-bug" },
      { name: "CTF", icon: "mdi:flag" },
    ],
  },
];

export function Stack() {
  return (
    <>
    <style>{`
      @media (max-width: 768px) {
        #stack { padding: 60px 20px 80px !important; }
        .stack-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
    <div
      id="stack-outer"
      style={{
        position: "relative",
        zIndex: 20,
        marginTop: "-48px",
      }}
    >
      <section id="stack" style={{ padding: "100px 60px 120px", position: "relative", background: "#1e201f", borderRadius: "32px 32px 0 0", overflow: "hidden" }}>
        {/* Grid bg */}
        <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", right: "-10%", transform: "translateY(-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(71,183,110,0.06) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span className="glow-dot" />
              <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#47b76e", fontFamily: "Inter, sans-serif" }}>Stack</span>
            </div>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.025em", color: "#f0f2f0", fontFamily: "Inter, sans-serif" }}>
              Tools I build with.
            </h2>
          </div>

          <div className="stack-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px,100%), 1fr))", gap: 20 }}>
            {STACK_WITH_ICONS.map((cat, i) => {
              const fromLeft = i % 2 === 0;
              return (
                <div
                  key={cat.category}
                  className="stack-card"
                  data-from={fromLeft ? "left" : "right"}
                  style={{
                    padding: "32px",
                    borderRadius: 14,
                    background: "#161416",
                    border: "1px solid #2a2d2b",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    transition: "border-color 0.25s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(71,183,110,0.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#2a2d2b"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#47b76e", fontFamily: "Inter, sans-serif" }}>{cat.category}</p>
                    <span style={{ fontSize: 11, color: "#3a3d3b", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {cat.items.map(item => (
                      <div
                        key={item.name}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 14px",
                          borderRadius: 10,
                          background: "#1e201f",
                          border: "1px solid #2a2d2b",
                          transition: "border-color 0.2s, background 0.2s",
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(71,183,110,0.25)";
                          (e.currentTarget as HTMLDivElement).style.background = "rgba(71,183,110,0.05)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = "#2a2d2b";
                          (e.currentTarget as HTMLDivElement).style.background = "#1e201f";
                        }}
                      >
                        <Icon icon={item.icon} width={20} height={20} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#8a9188", fontFamily: "Inter, sans-serif" }}>
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
