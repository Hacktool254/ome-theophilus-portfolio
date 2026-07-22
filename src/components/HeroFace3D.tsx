"use client";

import { useEffect, useRef } from "react";

export function HeroFace3D() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      const r = img.parentElement!.getBoundingClientRect();
      // Normalise to -1 → 1
      targetX = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      targetY = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    };
    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const parent = img.parentElement!;
    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      // Smooth lerp
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      // Translate image slightly in direction of cursor — max ±18px
      const tx = currentX * 18;
      const ty = currentY * 18;
      // Subtle scale on hover
      const scale = 1 + Math.sqrt(currentX * currentX + currentY * currentY) * 0.012;

      img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
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
        transition: "none",
      }}
    />
  );
}
