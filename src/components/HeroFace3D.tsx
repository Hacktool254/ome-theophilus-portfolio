"use client";

import { useEffect, useRef } from "react";

/**
 * Portrait image with smooth 3D card-tilt tracking the mouse.
 * The whole image rotates in 3D perspective toward the cursor —
 * same feel as the Three.js plane rotation we had before.
 */
export function HeroFace3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img  = imgRef.current;
    if (!wrap || !img) return;

    let targetRX = 0, targetRY = 0;
    let currentRX = 0, currentRY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width  - 0.5; // -0.5 → 0.5
      const ny = (e.clientY - r.top)  / r.height - 0.5;
      targetRY =  nx * 22;  // tilt left/right  max ±22deg
      targetRX = -ny * 14;  // tilt up/down     max ±14deg
    };

    const onMouseLeave = () => {
      targetRX = 0;
      targetRY = 0;
    };

    wrap.addEventListener("mousemove", onMouseMove);
    wrap.addEventListener("mouseleave", onMouseLeave);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      currentRX += (targetRX - currentRX) * 0.06;
      currentRY += (targetRY - currentRY) * 0.06;

      img.style.transform = `rotateX(${currentRX}deg) rotateY(${currentRY}deg) scale(1.04)`;
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      wrap.removeEventListener("mousemove", onMouseMove);
      wrap.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "absolute",
        inset: 0,
        perspective: "800px",
        perspectiveOrigin: "center center",
        overflow: "hidden",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="/assets/hero-face.png"
        alt="Ome Theophilus"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          willChange: "transform",
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          transition: "none",
        }}
      />
    </div>
  );
}
