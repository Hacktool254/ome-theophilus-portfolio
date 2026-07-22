"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#47b76e", "#7b2d8b", "#a4edbe", "#a855c8", "#2e5a42", "#5a6358"];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export function ParticleField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];
    const count = 28;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement("div");
      const size = randomBetween(3, 8);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const x = randomBetween(0, 100);
      const y = randomBetween(0, 100);
      const dur = randomBetween(8, 20);
      const delay = randomBetween(0, 10);
      const dx = randomBetween(-30, 30);
      const dy = randomBetween(-30, 30);

      dot.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        opacity: ${randomBetween(0.2, 0.6)};
        left: ${x}%;
        top: ${y}%;
        pointer-events: none;
        animation: particle-float-${i} ${dur}s ${delay}s ease-in-out infinite alternate;
      `;

      const keyframes = `
        @keyframes particle-float-${i} {
          from { transform: translate(0, 0); opacity: ${randomBetween(0.1, 0.4)}; }
          to   { transform: translate(${dx}px, ${dy}px); opacity: ${randomBetween(0.3, 0.7)}; }
        }
      `;
      const style = document.createElement("style");
      style.textContent = keyframes;
      document.head.appendChild(style);

      container.appendChild(dot);
      particles.push(dot);
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
