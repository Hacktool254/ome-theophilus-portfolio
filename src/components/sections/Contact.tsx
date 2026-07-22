"use client";

import { SITE } from "@/lib/data";

export function Contact() {
  const contactLinks = [
    { label: "Email", value: SITE.contact.email, href: `mailto:${SITE.contact.email}` },
    { label: "LinkedIn", value: "theophilus-dale", href: SITE.contact.linkedin },
    { label: "GitHub", value: "Hacktool254", href: SITE.contact.github },
    { label: "Instagram", value: "@daletheokrazy", href: SITE.contact.instagram },
    { label: "Phone", value: SITE.contact.phone, href: `tel:${SITE.contact.phone}` },
  ];

  return (
    <div
      id="contact-outer"
      style={{
        position: "relative",
        zIndex: 30,
        marginTop: "-48px",
        borderRadius: "32px 32px 0 0",
        background: "#161416",
        overflow: "hidden",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          #contact { padding: 80px 20px 60px !important; }
          .contact-footer { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
        }
      `}</style>
      <section
        id="contact"
        style={{ padding: "140px 24px 100px", position: "relative", overflow: "hidden" }}
      >
        {/* Glow */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(71,183,110,0.06) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <span className="glow-dot" />
            <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#47b76e", fontFamily: "Inter, sans-serif" }}>Contact</span>
          </div>

          <h2 style={{ fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.03em", color: "#f0f2f0", fontFamily: "Inter, sans-serif", marginBottom: 24 }}>
            Let&apos;s build<br />
            <span style={{ color: "#47b76e" }}>something together.</span>
          </h2>

          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#8a9188", fontFamily: "Inter, sans-serif", maxWidth: 500, margin: "0 auto 48px" }}>
            Available for freelance work, collaborations, and interesting problems. If you have a project in mind, let&apos;s talk.
          </p>

          <div style={{ marginBottom: 56 }}>
            <a href={`mailto:${SITE.contact.email}`}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 36px", borderRadius: 9999, background: "#47b76e", color: "#161416", fontSize: 15, fontWeight: 700, textDecoration: "none", transition: "all 0.2s", fontFamily: "Inter, sans-serif" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#5ecf83"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(0.97)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#47b76e"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}>
              Send me an email
            </a>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {contactLinks.map(link => (
              <a key={link.label} href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 10, background: "#1e201f", border: "1px solid #2a2d2b", textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(71,183,110,0.4)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(71,183,110,0.05)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2a2d2b"; (e.currentTarget as HTMLAnchorElement).style.background = "#1e201f"; }}>
                <span style={{ display: "flex", flexDirection: "column", gap: 1, textAlign: "left" }}>
                  <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#5a6358", fontFamily: "Inter, sans-serif" }}>{link.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#8a9188", fontFamily: "Inter, sans-serif" }}>{link.value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="contact-footer" style={{ maxWidth: 1200, margin: "80px auto 0", paddingTop: 32, borderTop: "1px solid #2a2d2b", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="glow-dot" style={{ width: 6, height: 6 }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#f0f2f0", fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}>Ome Theophilus</span>
          </div>
          <span style={{ fontSize: 12, color: "#5a6358", fontFamily: "Inter, sans-serif" }}>© 2026 · Built with Next.js & GSAP</span>
        </div>
      </section>
    </div>
  );
}
