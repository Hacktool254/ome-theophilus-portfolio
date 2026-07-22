"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { damping: 28, stiffness: 300 });
  const ringY = useSpring(dotY, { damping: 28, stiffness: 300 });
  const ringScale = useSpring(1, { damping: 20, stiffness: 250 });
  const dotScale = useSpring(1, { damping: 20, stiffness: 300 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX - 4);
      dotY.set(e.clientY - 4);
    };

    const onEnter = () => {
      ringScale.set(2.2);
      dotScale.set(0.4);
    };
    const onLeave = () => {
      ringScale.set(1);
      dotScale.set(1);
    };

    document.addEventListener("mousemove", onMove);

    const attach = () => {
      document.querySelectorAll("a, button, [data-hover]").forEach(el => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, [dotX, dotY, ringScale, dotScale]);

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9998, x: dotX, y: dotY, scale: dotScale, mixBlendMode: "difference" }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffffff" }} />
      </motion.div>

      {/* Ring */}
      <motion.div
        style={{ position: "fixed", top: -18, left: -18, pointerEvents: "none", zIndex: 9997, x: ringX, y: ringY, scale: ringScale, mixBlendMode: "difference" }}
      >
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.65)" }} />
      </motion.div>
    </>
  );
}
