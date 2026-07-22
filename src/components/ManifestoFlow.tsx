"use client";

interface Props {
  reverse?: boolean;
  items?: string[];
}

const DEFAULT_ITEMS = [
  "Developer",
  "AI Builder",
  "Automation Engineer",
  "Full-Stack",
  "Multi-Agent Systems",
  "Nairobi, Kenya",
  "TypeScript",
  "AWS Bedrock",
  "React Native",
  "Open Source",
];

export function ManifestoFlow({ reverse = false, items = DEFAULT_ITEMS }: Props) {
  const doubled = [...items, ...items];

  return (
    /* manifesto-strip is targeted by GSAP slow parallax */
    <div
      className="manifesto-strip"
      style={{
        overflow: "hidden",
        borderTop: "1px solid #2a2d2b",
        borderBottom: "1px solid #2a2d2b",
        padding: "14px 0",
        background: "#1e201f",
        position: "relative",
      }}
    >
      {/* Fade edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, #1e201f 0%, transparent 8%, transparent 92%, #1e201f 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div className={reverse ? "marquee-track-reverse" : "marquee-track"}>
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              padding: "0 24px",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#5a6358",
              whiteSpace: "nowrap",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {item}
            <span
              style={{
                display: "inline-block",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#47b76e",
                opacity: 0.6,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
