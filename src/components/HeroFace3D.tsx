"use client";

import { useEffect, useRef, useState } from "react";

export function HeroFace3D() {
  const mountRef    = useRef<HTMLDivElement>(null);
  const spotRef     = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const spotEl    = spotRef.current;

    // WebGL support check
    try {
      const test = document.createElement("canvas");
      const gl = test.getContext("webgl2") || test.getContext("webgl");
      if (!gl) { setWebglFailed(true); return; }
    } catch {
      setWebglFailed(true);
      return;
    }

    let rafId: number;
    let cleanup: (() => void) | null = null;

    // ── CSS spotlight overlay ─────────────────────────────────────────────
    // Runs entirely in CSS via mix-blend-mode:screen so it lights dark surfaces
    let spotX = 50, spotY = 50;         // % positions
    let targetX = 50, targetY = 50;
    let hovered = false;

    const onMouseMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      targetX  = ((e.clientX - r.left) / r.width)  * 100;
      targetY  = ((e.clientY - r.top)  / r.height) * 100;
      hovered  = true;
    };
    const onMouseLeave = () => { hovered = false; };
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    let spotOpacity = 0;

    const updateSpot = () => {
      const lp = (a: number, b: number, t: number) => a + (b - a) * t;
      spotX = lp(spotX, hovered ? targetX : spotX, 0.1);
      spotY = lp(spotY, hovered ? targetY : spotY, 0.1);
      spotOpacity = lp(spotOpacity, hovered ? 1 : 0, 0.07);

      if (spotEl) {
        spotEl.style.opacity    = String(spotOpacity);
        spotEl.style.background = `radial-gradient(circle 200px at ${spotX}% ${spotY}%, rgba(255,255,255,0.75) 0%, rgba(71,183,110,0.35) 35%, transparent 65%)`;
      }
    };

    (async () => {
      try {
        const THREE = await import("three");

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setClearColor(0x161416, 1); // match page bg so canvas is opaque — required for mix-blend-mode to composite over face pixels
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

        const scene  = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.01, 100);
        camera.position.set(0, 0, 2.2);

        const loader = new THREE.TextureLoader();
        const [faceMap, depthMap] = await Promise.all([
          loader.loadAsync("/assets/hero-face.png"),
          loader.loadAsync("/assets/hero-depth.png"),
        ]);
        faceMap.colorSpace = THREE.SRGBColorSpace;

        const planeH = 2.2;
        const planeW = planeH * (1122 / 1402);
        const geo    = new THREE.PlaneGeometry(planeW, planeH, 120, 150);

        const material = new THREE.MeshStandardMaterial({
          map: faceMap,
          displacementMap: depthMap,
          displacementScale: 0.22,
          displacementBias: -0.06,
          roughness: 0.88,
          metalness: 0.04,
        });

        const mesh = new THREE.Mesh(geo, material);
        scene.add(mesh);

        // Permanent lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const rimGreen = new THREE.DirectionalLight(0x47b76e, 1.4);
        rimGreen.position.set(-2.5, 0.5, 1.5);
        scene.add(rimGreen);
        const rimViolet = new THREE.DirectionalLight(0x7b2d8b, 0.6);
        rimViolet.position.set(2.0, -0.3, 1.0);
        scene.add(rimViolet);
        const visorLight = new THREE.PointLight(0xff8c00, 0.8, 3.0);
        visorLight.position.set(0, 0.12, 1.2);
        scene.add(visorLight);

        const mouseNDC = new THREE.Vector2();
        const uMouse   = { x: 0.5, y: 0.5 };
        let   isHoveredGL = false;

        const onMM = (e: MouseEvent) => {
          const r = container.getBoundingClientRect();
          mouseNDC.x  =  ((e.clientX - r.left) / r.width)  * 2 - 1;
          mouseNDC.y  = -((e.clientY - r.top)  / r.height) * 2 + 1;
          uMouse.x    =  (e.clientX - r.left) / r.width;
          uMouse.y    =  (e.clientY - r.top)  / r.height;
          isHoveredGL = true;
        };
        const onML = () => { isHoveredGL = false; };
        container.addEventListener("mousemove", onMM);
        container.addEventListener("mouseleave", onML);

        const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;
        let idleT = 0;

        const animate = () => {
          rafId = requestAnimationFrame(animate);
          idleT += 0.008;

          // Subtle idle sway + cursor tilt
          mesh.rotation.y = lerpN(mesh.rotation.y, (uMouse.x - 0.5) * 0.07 + Math.sin(idleT) * 0.009, 0.04);
          mesh.rotation.x = lerpN(mesh.rotation.x, -(uMouse.y - 0.5) * 0.05 + Math.cos(idleT * 0.7) * 0.006, 0.04);

          updateSpot();
          renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
          camera.aspect = container.clientWidth / container.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener("resize", onResize);

        cleanup = () => {
          cancelAnimationFrame(rafId);
          container.removeEventListener("mousemove", onMM);
          container.removeEventListener("mouseleave", onML);
          window.removeEventListener("resize", onResize);
          renderer.dispose();
          geo.dispose();
          material.dispose();
          faceMap.dispose();
          depthMap.dispose();
          renderer.domElement.parentNode?.removeChild(renderer.domElement);
        };
      } catch {
        setWebglFailed(true);
      }
    })();

    // Cleanup mouse listeners for CSS spotlight too
    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      cleanup?.();
    };
  }, []);

  if (webglFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/assets/hero-face.png" alt="Ome Theophilus"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
    );
  }

  return (
    <div ref={mountRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "none" }}
    >
      {/* CSS screen-blend spotlight — lights even pure-black surfaces */}
      <div
        ref={spotRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          mixBlendMode: "screen",
          opacity: 0,
          zIndex: 2,
          transition: "none",
        }}
      />
    </div>
  );
}
