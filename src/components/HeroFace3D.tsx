"use client";

import { useEffect, useRef, useState } from "react";

export function HeroFace3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const spotRef  = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const spotEl    = spotRef.current;

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

    // ── CSS spotlight (screen blend) ─────────────────────────────────────
    let spotX = 50, spotY = 50, targetX = 50, targetY = 50;
    let hovered = false, spotOpacity = 0;

    const onMouseMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width)  * 100;
      targetY = ((e.clientY - r.top)  / r.height) * 100;
      hovered = true;
    };
    const onMouseLeave = () => { hovered = false; };
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;

    const updateSpot = () => {
      spotX       = lerpN(spotX, hovered ? targetX : spotX, 0.1);
      spotY       = lerpN(spotY, hovered ? targetY : spotY, 0.1);
      spotOpacity = lerpN(spotOpacity, hovered ? 1 : 0, 0.07);
      if (spotEl) {
        spotEl.style.opacity    = String(spotOpacity);
        spotEl.style.background = `radial-gradient(circle 240px at ${spotX}% ${spotY}%, rgba(255,255,255,0.85) 0%, rgba(71,183,110,0.4) 38%, transparent 68%)`;
      }
    };

    (async () => {
      try {
        const THREE      = await import("three");
        const { GLTFLoader }      = await import("three/examples/jsm/loaders/GLTFLoader.js");
        const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");

        // ── Renderer ──────────────────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setClearColor(0x161416, 1);
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = false;
        container.appendChild(renderer.domElement);

        // ── Scene ─────────────────────────────────────────────────────────
        const scene = new THREE.Scene();

        // PMREMGenerator for environment lighting
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment()).texture;
        pmrem.dispose();

        // ── Camera ────────────────────────────────────────────────────────
        const camera = new THREE.PerspectiveCamera(
          45,
          container.clientWidth / container.clientHeight,
          0.1,
          100
        );

        // ── Load GLB ──────────────────────────────────────────────────────
        const loader = new GLTFLoader();
        const gltf   = await loader.loadAsync("/assets/hero-face.glb");

        const model = gltf.scene;

        // Centre model
        const box    = new THREE.Box3().setFromObject(model);
        const centre = box.getCenter(new THREE.Vector3());
        const size   = box.getSize(new THREE.Vector3());
        model.position.sub(centre);

        // Camera — model is normalised to ~2 units, fit it to the viewport
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov    = camera.fov * (Math.PI / 180);
        const dist   = (maxDim / 2) / Math.tan(fov / 2);
        camera.position.set(0, 0.1, dist * 2.1);
        camera.near = 0.01;
        camera.far  = dist * 20;
        camera.updateProjectionMatrix();
        camera.lookAt(0, 0, 0);

        // ── Shader spotlight (same as original repo) ──────────────────────
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const shaderRefs: any[] = [];
        const uHit    = new THREE.Vector3(0, 100, 0);
        const config  = { radius: 0.28, softness: 0.45, lerp: 0.06 };

        model.traverse((node) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mesh = node as any;
          if (!mesh.isMesh) return;
          mesh.material.roughness = 0.92;

          mesh.material.onBeforeCompile = (shader: { uniforms: Record<string, { value: unknown }>; vertexShader: string; fragmentShader: string }) => {
            shader.uniforms.uHitPoint = { value: uHit };
            shader.uniforms.uActive   = { value: 0 };
            shader.uniforms.uRadius   = { value: config.radius };
            shader.uniforms.uSoftness = { value: config.softness };

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
float _mask = _rev * uActive;
roughnessFactor  = mix(0.92, 0.05, _mask);
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 0.4, _mask);`
              );

            shaderRefs.push(shader);
          };
          mesh.material.needsUpdate = true;
        });

        scene.add(model);

        // ── Raycaster ────────────────────────────────────────────────────
        const raycaster = new THREE.Raycaster();
        const plane3D   = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const planeHit  = new THREE.Vector3();
        const mouseNDC  = new THREE.Vector2();
        const target    = new THREE.Vector3(0, 100, 0);
        let   isHov     = false;
        let   uActive   = 0;
        const uMouse    = { x: 0.5, y: 0.5 };

        const onMM = (e: MouseEvent) => {
          const r = container.getBoundingClientRect();
          mouseNDC.x = ((e.clientX - r.left) / r.width)  * 2 - 1;
          mouseNDC.y = -((e.clientY - r.top)  / r.height) * 2 + 1;
          uMouse.x   = (e.clientX - r.left) / r.width;
          uMouse.y   = (e.clientY - r.top)  / r.height;
          isHov = true;
        };
        const onML = () => { isHov = false; };
        container.addEventListener("mousemove", onMM);
        container.addEventListener("mouseleave", onML);

        // ── Animate ──────────────────────────────────────────────────────
        let idleT = 0;

        const animate = () => {
          rafId = requestAnimationFrame(animate);
          idleT += 0.006;

          uActive = lerpN(uActive, isHov ? 1 : 0, config.lerp);

          raycaster.setFromCamera(mouseNDC, camera);
          raycaster.ray.intersectPlane(plane3D, planeHit);
          target.copy(isHov ? planeHit : new THREE.Vector3(0, 100, 0));
          uHit.lerp(target, config.lerp);

          for (const s of shaderRefs) {
            s.uniforms.uHitPoint.value.copy(uHit);
            s.uniforms.uActive.value = uActive;
          }

          // Gentle idle rotation + cursor tilt
          model.rotation.y = lerpN(model.rotation.y, (uMouse.x - 0.5) * 0.25 + Math.sin(idleT) * 0.04, 0.03);
          model.rotation.x = lerpN(model.rotation.x, -(uMouse.y - 0.5) * 0.15 + Math.cos(idleT * 0.6) * 0.02, 0.03);

          updateSpot();
          renderer.render(scene, camera);
        };
        animate();

        // ── Resize ───────────────────────────────────────────────────────
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
          renderer.domElement.parentNode?.removeChild(renderer.domElement);
        };
      } catch (err) {
        console.error("HeroFace3D error:", err);
        setWebglFailed(true);
      }
    })();

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
      <div ref={spotRef}
        style={{
          position: "absolute", inset: 0,
          pointerEvents: "none",
          mixBlendMode: "screen",
          opacity: 0, zIndex: 2,
        }}
      />
    </div>
  );
}
