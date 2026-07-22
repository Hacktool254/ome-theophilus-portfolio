"use client";

import { useEffect, useRef, useState } from "react";

export function HeroFace3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

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

    (async () => {
      try {
        const THREE = await import("three");

        // ── Renderer ────────────────────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

        // ── Scene / Camera ──────────────────────────────────────────────────
        const scene  = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          42, container.clientWidth / container.clientHeight, 0.01, 100
        );
        camera.position.set(0, 0, 2.2);

        // ── Textures ────────────────────────────────────────────────────────
        const loader = new THREE.TextureLoader();
        const [faceMap, depthMap] = await Promise.all([
          loader.loadAsync("/assets/hero-face.png"),
          loader.loadAsync("/assets/hero-depth.png"),
        ]);
        faceMap.colorSpace = THREE.SRGBColorSpace;

        // ── Geometry ────────────────────────────────────────────────────────
        const planeH = 2.2;
        const planeW = planeH * (1122 / 1402);
        const geo    = new THREE.PlaneGeometry(planeW, planeH, 120, 150);

        // ── Material + custom GLSL spotlight ────────────────────────────────
        const uHit   = new THREE.Vector3(0, 1000, 0);
        const uMouse = { x: 0.5, y: 0.5 };
        let   isHovered = false;
        let   uActive   = 0;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const shaderRefs: any[] = [];

        const material = new THREE.MeshStandardMaterial({
          map: faceMap,
          displacementMap: depthMap,
          displacementScale: 0.22,
          displacementBias: -0.06,
          roughness: 0.88,
          metalness: 0.04,
        });

        material.onBeforeCompile = (shader) => {
          shader.uniforms.uHitPoint = { value: uHit };
          shader.uniforms.uActive   = { value: 0.0 };
          shader.uniforms.uRadius   = { value: 0.28 };
          shader.uniforms.uSoftness = { value: 0.38 };

          shader.vertexShader = shader.vertexShader
            .replace("#include <common>", "#include <common>\nvarying vec3 vWPos;")
            .replace(
              "#include <worldpos_vertex>",
              "#include <worldpos_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;"
            );

          shader.fragmentShader = shader.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
uniform vec3  uHitPoint;
uniform float uActive, uRadius, uSoftness;
varying vec3  vWPos;`
            )
            .replace(
              "#include <roughnessmap_fragment>",
              `#include <roughnessmap_fragment>
float _d   = distance(vWPos, uHitPoint);
float _rev = 1.0 - smoothstep(uRadius, uRadius + uSoftness, _d);
float _m   = _rev * uActive;
roughnessFactor = mix(roughnessFactor, 0.08, _m * 0.9);
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.18, _m * 0.55);`
            );

          shaderRefs.push(shader);
        };
        material.needsUpdate = true;

        const mesh = new THREE.Mesh(geo, material);
        scene.add(mesh);

        // ── Lighting ────────────────────────────────────────────────────────
        scene.add(new THREE.AmbientLight(0xffffff, 0.55));
        const rimGreen = new THREE.DirectionalLight(0x47b76e, 1.6);
        rimGreen.position.set(-2.5, 0.5, 1.5);
        scene.add(rimGreen);
        const rimViolet = new THREE.DirectionalLight(0x7b2d8b, 0.7);
        rimViolet.position.set(2.0, -0.3, 1.0);
        scene.add(rimViolet);
        const visorLight = new THREE.PointLight(0xff8c00, 0.9, 3.0);
        visorLight.position.set(0, 0.12, 1.2);
        scene.add(visorLight);

        // ── Mouse tracking ──────────────────────────────────────────────────
        const raycaster = new THREE.Raycaster();
        const plane3D   = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const planeHit  = new THREE.Vector3();
        const mouseNDC  = new THREE.Vector2();

        const onMouseMove = (e: MouseEvent) => {
          const r = container.getBoundingClientRect();
          mouseNDC.x =  ((e.clientX - r.left) / r.width)  * 2 - 1;
          mouseNDC.y = -((e.clientY - r.top)  / r.height) * 2 + 1;
          uMouse.x   =  (e.clientX - r.left) / r.width;
          uMouse.y   =  (e.clientY - r.top)  / r.height;
          isHovered  = true;
        };
        const onMouseLeave = () => { isHovered = false; };
        container.addEventListener("mousemove", onMouseMove);
        container.addEventListener("mouseleave", onMouseLeave);

        // ── Animate ─────────────────────────────────────────────────────────
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        let idleT = 0;

        const animate = () => {
          rafId = requestAnimationFrame(animate);
          idleT += 0.008;

          uActive = lerp(uActive, isHovered ? 1 : 0, 0.06);

          raycaster.setFromCamera(mouseNDC, camera);
          raycaster.ray.intersectPlane(plane3D, planeHit);
          const target = isHovered ? planeHit : new THREE.Vector3(0, 1000, 0);
          uHit.lerp(target, 0.06);

          for (const s of shaderRefs) {
            s.uniforms.uHitPoint.value.copy(uHit);
            s.uniforms.uActive.value = uActive;
          }

          mesh.rotation.y = lerp(mesh.rotation.y, (uMouse.x - 0.5) * 0.06 + Math.sin(idleT) * 0.008, 0.04);
          mesh.rotation.x = lerp(mesh.rotation.x, -(uMouse.y - 0.5) * 0.04 + Math.cos(idleT * 0.7) * 0.005, 0.04);

          renderer.render(scene, camera);
        };
        animate();

        // ── Resize ──────────────────────────────────────────────────────────
        const onResize = () => {
          camera.aspect = container.clientWidth / container.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener("resize", onResize);

        cleanup = () => {
          cancelAnimationFrame(rafId);
          container.removeEventListener("mousemove", onMouseMove);
          container.removeEventListener("mouseleave", onMouseLeave);
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

    return () => { cleanup?.(); };
  }, []);

  // Fallback: plain image if WebGL unavailable
  if (webglFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/assets/hero-face.png"
        alt="Ome Theophilus"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
        }}
      />
    );
  }

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "none" }}
    />
  );
}
