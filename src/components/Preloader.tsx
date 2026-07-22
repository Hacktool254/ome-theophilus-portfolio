"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const total = 100;
    const duration = 1400;
    const steps = 40;
    const interval = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += Math.ceil(total / steps);
      if (current >= total) {
        current = total;
        clearInterval(timer);
        setTimeout(() => setDone(true), 200);
      }
      setCount(current);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!done && (
        <motion.div
          className="preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#161416", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}
        >
          {/* Logo / Name */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
          >
            <span
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#f0f2f0",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Ome Theophilus
            </span>
            <span
              style={{
                fontSize: 13,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#47b76e",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Developer · AI Builder · Automation
            </span>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ width: 200, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}
          >
            <div
              style={{
                width: "100%",
                height: 1,
                background: "#2a2d2b",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #47b76e, #7b2d8b)",
                  borderRadius: 1,
                  width: `${count}%`,
                  transition: "width 0.05s linear",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                color: "#5a6358",
                letterSpacing: "0.06em",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              {count}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
