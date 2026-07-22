"use client";

import { useEffect, useRef } from "react";

/**
 * 3D cursor-spotlight effect on the hero face image.
 * Technique:
 *   - Three.js PlaneGeometry with ~120x150 subdivisions
 *   - hero-face.png as the diffuse map
 *   - hero-depth.png as a displacement map applied in the vertex shader
 *   - Custom GLSL spotlight injected into Three's MeshStandardMaterial:
 *     cursor position → world-space hit → radial shininess reveal on the surface
 * The face curves outward (cheeks, forehead, visor) giving the spotlight
 * physically plausible reflections as the cursor moves.
 */
export function HeroFace3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let rafId: number;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import("three");

      // ── Renderer ──────────────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);

      // ── Scene / Camera ────────────────────────────────────────────────────
      const scene = new THREE.Scene();
      const aspect = container.clientWidth / container.clientHeight;
      const camera = new THREE.PerspectiveCamera(42, aspect, 0.01, 100);
      camera.position.set(0, 0, 2.2);

      // ── Textures ──────────────────────────────────────────────────────────
      const loader = new THREE.TextureLoader();
      const [faceMap, depthMap] = await Promise.all([
        loader.loadAsync("/assets/hero-face.png"),
        loader.loadAsync("/assets/hero-depth.png"),
      ]);
      faceMap.colorSpace = THREE.SRGBColorSpace;

      // ── Geometry — subdivided plane matching image aspect 1122/1402 ──────
      const imgAspect = 1122 / 1402; // width / height of the source image
      const planeH = 2.2;
      const planeW = planeH * imgAspect;
      const geo = new THREE.PlaneGeometry(planeW, planeH, 120, 150);

      // ── Material with custom GLSL ─────────────────────────────────────────
      const uHit   = new THREE.Vector3(0, 1000, 0); // starts off-screen
      const uMouse = { x: 0.5, y: 0.5 };
      let   isHovered = false;
      let   uActive = 0;

      const material = new THREE.MeshStandardMaterial({
        map: faceMap,
        displacementMap: depthMap,
        displacementScale: 0.22,
        displacementBias: -0.06,
        roughness: 0.88,
        metalness: 0.04,
      });

      // Inject spotlight shader into Three's standard material
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shaderRefs: any[] = [];

      material.onBeforeCompile = (shader) => {
        shader.uniforms.uHitPoint = { value: uHit };
        shader.uniforms.uActive   = { value: 0.0 };
        shader.uniforms.uRadius   = { value: 0.28 };
        shader.uniforms.uSoftness = { value: 0.38 };

        // Pass world position to fragment
        shader.vertexShader = shader.vertexShader
          .replace(
            "#include <common>",
            `#include <common>\nvarying vec3 vWPos;`
          )
          .replace(
            "#include <worldpos_vertex>",
            `#include <worldpos_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`
          );

        // Spotlight on roughness + emissive green rim glow
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
float _d    = distance(vWPos, uHitPoint);
float _rev  = 1.0 - smoothstep(uRadius, uRadius + uSoftness, _d);
float _mask = _rev * uActive;
// Reduce roughness in spotlight → shiny
roughnessFactor = mix(roughnessFactor, 0.08, _mask * 0.9);
// Slightly desaturate + brighten the lit area
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.18, _mask * 0.55);`
          );

        shaderRefs.push(shader);
      };
      material.needsUpdate = true;

      // ── Mesh ──────────────────────────────────────────────────────────────
      const mesh = new THREE.Mesh(geo, material);
      scene.add(mesh);

      // ── Lighting — matches image mood ────────────────────────────────────
      // Ambient
      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      // Green rim from left (matches the photo's green rim light)
      const rimGreen = new THREE.DirectionalLight(0x47b76e, 1.6);
      rimGreen.position.set(-2.5, 0.5, 1.5);
      scene.add(rimGreen);
      // Violet fill from right
      const rimViolet = new THREE.DirectionalLight(0x7b2d8b, 0.7);
      rimViolet.position.set(2.0, -0.3, 1.0);
      scene.add(rimViolet);
      // Warm orange point — the visor glow area
      const visorLight = new THREE.PointLight(0xff8c00, 0.9, 3.0);
      visorLight.position.set(0, 0.12, 1.2);
      scene.add(visorLight);

      // ── Raycaster for cursor → world position ────────────────────────────
      const raycaster = new THREE.Raycaster();
      const plane3D   = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const planeHit  = new THREE.Vector3();
      const target    = new THREE.Vector3(0, 1000, 0);
      const mouseNDC  = new THREE.Vector2();

      const onMouseMove = (e: MouseEvent) => {
        const r = container.getBoundingClientRect();
        mouseNDC.x =  ((e.clientX - r.left) / r.width)  * 2 - 1;
        mouseNDC.y = -((e.clientY - r.top)  / r.height) * 2 + 1;
        uMouse.x = (e.clientX - r.left) / r.width;
        uMouse.y = (e.clientY - r.top)  / r.height;
        isHovered = true;
      };
      const onMouseLeave = () => { isHovered = false; };

      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseleave", onMouseLeave);

      // Subtle idle sway
      let idleT = 0;

      // ── Animate ───────────────────────────────────────────────────────────
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      const animate = () => {
        rafId = requestAnimationFrame(animate);
        idleT += 0.008;

        // Smooth active blend
        uActive = lerp(uActive, isHovered ? 1 : 0, 0.06);

        // Project cursor to world plane
        raycaster.setFromCamera(mouseNDC, camera);
        raycaster.ray.intersectPlane(plane3D, planeHit);
        target.copy(isHovered ? planeHit : new THREE.Vector3(0, 1000, 0));
        uHit.lerp(target, 0.06);

        // Push uniforms
        for (const s of shaderRefs) {
          s.uniforms.uHitPoint.value.copy(uHit);
          s.uniforms.uActive.value = uActive;
        }

        // Subtle idle sway (very gentle tilt following cursor loosely)
        mesh.rotation.y = lerp(mesh.rotation.y, (uMouse.x - 0.5) * 0.06 + Math.sin(idleT) * 0.008, 0.04);
        mesh.rotation.x = lerp(mesh.rotation.x, -(uMouse.y - 0.5) * 0.04 + Math.cos(idleT * 0.7) * 0.005, 0.04);

        renderer.render(scene, camera);
      };
      animate();

      // ── Resize ────────────────────────────────────────────────────────────
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
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    })();

    return () => { cleanup?.(); };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
        cursor: "none",
      }}
    />
  );
}
