"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/lib/data";

const NAV_LINKS = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 800,
          padding: "0 24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <motion.nav
          animate={{
            paddingTop: scrolled ? 10 : 20,
            paddingBottom: scrolled ? 10 : 20,
            paddingLeft: scrolled ? 20 : 0,
            paddingRight: scrolled ? 20 : 0,
            borderRadius: scrolled ? 9999 : 0,
            background: scrolled ? "rgba(22,20,22,0.92)" : "transparent",
            backdropFilter: scrolled ? "blur(16px)" : "none",
            border: scrolled ? "1px solid rgba(42,45,43,0.8)" : "1px solid transparent",
            maxWidth: scrolled ? 560 : 1200,
            marginTop: scrolled ? 16 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            <span className="glow-dot" />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "#f0f2f0",
                fontFamily: "Inter, sans-serif",
              }}
            >
              OT
            </span>
          </button>

          {/* Desktop links */}
          <div
            style={{ display: "flex", gap: 4, alignItems: "center" }}
            className="hidden md:flex"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: 9999,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#8a9188",
                  letterSpacing: "0.01em",
                  transition: "color 0.2s, background 0.2s",
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.color = "#f0f2f0";
                  (e.target as HTMLButtonElement).style.background = "rgba(71,183,110,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.color = "#8a9188";
                  (e.target as HTMLButtonElement).style.background = "none";
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <a
            href={`mailto:${SITE.contact.email}`}
            style={{
              padding: "8px 18px",
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 600,
              color: "#161416",
              background: "#47b76e",
              letterSpacing: "0.01em",
              textDecoration: "none",
              transition: "background 0.2s, transform 0.15s",
              fontFamily: "Inter, sans-serif",
            }}
            className="hidden md:inline-flex"
            onMouseEnter={(e) => {
              (e.target as HTMLAnchorElement).style.background = "#5ecf83";
              (e.target as HTMLAnchorElement).style.transform = "scale(0.98)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLAnchorElement).style.background = "#47b76e";
              (e.target as HTMLAnchorElement).style.transform = "scale(1)";
            }}
          >
            Hire Me
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              padding: 8,
            }}
            className="flex md:hidden"
          >
            <motion.span
              animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }}
              style={{ display: "block", width: 22, height: 1.5, background: "#f0f2f0", borderRadius: 1 }}
            />
            <motion.span
              animate={{ opacity: open ? 0 : 1 }}
              style={{ display: "block", width: 22, height: 1.5, background: "#f0f2f0", borderRadius: 1 }}
            />
            <motion.span
              animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }}
              style={{ display: "block", width: 22, height: 1.5, background: "#f0f2f0", borderRadius: 1 }}
            />
          </button>
        </motion.nav>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 700,
              background: "rgba(22,20,22,0.97)",
              backdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleNav(link.href)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "clamp(2rem, 6vw, 3.5rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#5a6358",
                  fontFamily: "Inter, sans-serif",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.color = "#f0f2f0")}
                onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.color = "#5a6358")}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
