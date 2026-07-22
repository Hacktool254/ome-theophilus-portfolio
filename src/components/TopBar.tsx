"use client";

import { useEffect, useRef } from "react";

export function TopBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    // Fill during load
    bar.style.width = "30%";
    bar.style.transition = "width 0.4s ease";

    const grow = setTimeout(() => { bar.style.width = "70%"; }, 200);
    const finish = setTimeout(() => {
      bar.style.width = "100%";
      bar.style.transition = "width 0.3s ease, opacity 0.4s ease 0.3s";
      setTimeout(() => { bar.style.opacity = "0"; }, 600);
    }, 800);

    return () => { clearTimeout(grow); clearTimeout(finish); };
  }, []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 10000, background: "transparent" }}>
      <div
        ref={barRef}
        style={{
          height: "100%",
          width: "0%",
          background: "linear-gradient(90deg, #47b76e, #7b2d8b, #47b76e)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s linear infinite",
          boxShadow: "0 0 8px rgba(71,183,110,0.6)",
          opacity: 1,
        }}
      />
    </div>
  );
}
