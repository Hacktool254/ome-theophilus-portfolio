"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";

export function ScrollOrchestrator() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    let ctx: ReturnType<typeof import("gsap").gsap.context>;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // Sync with Lenis — must run after Lenis is set up
      ScrollTrigger.normalizeScroll(false);

      ctx = gsap.context(() => {

        /* ── 1. About card slides up over Hero ── */
        const aboutWrap = document.querySelector<HTMLElement>("#about-wrap");
        if (aboutWrap) {
          gsap.fromTo(aboutWrap,
            { yPercent: 4, scale: 0.98 },
            {
              yPercent: 0, scale: 1, ease: "none",
              scrollTrigger: {
                trigger: "#hero",
                start: "bottom 90%",
                end: "bottom 20%",
                scrub: 0.6,
              },
            }
          );
        }

        /* ── 2. About splits open — Projects revealed behind ── */
        const aboutScene = document.querySelector<HTMLElement>("#about-scene");
        const aboutLeft  = document.querySelector<HTMLElement>("#about-left");
        const aboutRight = document.querySelector<HTMLElement>("#about-right");
        const projectsEl = document.querySelector<HTMLElement>("#projects");

        if (aboutScene && aboutLeft && aboutRight) {
          // Split fires during the second 100dvh of about-scene (50% → 100%)
          // Tighter scrub = snappier wipe, feels more intentional
          const splitTrigger = {
            trigger: aboutScene,
            start: "50% top",
            end: "90% top",
            scrub: 0.8,
          };

          gsap.to(aboutLeft,  { xPercent: -100, ease: "power2.inOut", scrollTrigger: splitTrigger });
          gsap.to(aboutRight, { xPercent:  100, ease: "power2.inOut", scrollTrigger: splitTrigger });

          // Projects fades in as About starts to split — fully visible before About is gone
          if (projectsEl) {
            gsap.to(projectsEl, {
              opacity: 1, ease: "none",
              scrollTrigger: {
                trigger: aboutScene,
                start: "52% top",
                end: "72% top",
                scrub: 0.6,
              },
            });
          }
        }

        /* ── 3. Projects horizontal pin ── */
        const projectsSection = document.querySelector<HTMLElement>("#projects-section");
        const track = document.querySelector<HTMLElement>("[data-projects-track]");
        const barEl = document.querySelector<HTMLElement>("[data-proj-bar]");

        if (projectsSection && track) {
          const getTravel = () => track.scrollWidth - window.innerWidth;

          const hST = ScrollTrigger.create({
            trigger: projectsSection,
            start: "top top",
            end: () => `+=${getTravel()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 0,
            invalidateOnRefresh: true,
            animation: gsap.to(track, { x: () => -getTravel(), ease: "none" }),
            onUpdate: (self) => {
              if (barEl) barEl.style.width = `${self.progress * 100}%`;
            },
          });

          // Refresh on resize so travel distance stays correct
          window.addEventListener("resize", () => hST.refresh());
        }

        /* ── 4. Contact slides over Stack ── */
        const contactEl = document.querySelector<HTMLElement>("#contact-outer");
        if (contactEl) {
          gsap.fromTo(contactEl,
            { yPercent: 4, scale: 0.98 },
            {
              yPercent: 0, scale: 1, ease: "none",
              scrollTrigger: {
                trigger: contactEl,
                start: "top 95%",
                end: "top top",
                scrub: 0.6,
              },
            }
          );
        }

        /* ── 5. Stack cards stagger in ── */
        gsap.utils.toArray<HTMLElement>(".stack-card").forEach((card) => {
          const fromLeft = card.dataset.from === "left";
          gsap.set(card, { x: fromLeft ? -50 : 50, opacity: 0 });
          gsap.to(card, {
            x: 0, opacity: 1, duration: 0.6, ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          });
        });

        ScrollTrigger.refresh();
      });
    };

    // Use requestIdleCallback if available, else short timeout
    // This ensures DOM + Lenis are both ready before GSAP wires triggers
    const schedule = window.requestIdleCallback
      ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 400 })
      : (cb: () => void) => setTimeout(cb, 300);

    let timeoutId: ReturnType<typeof setTimeout>;
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => init(), { timeout: 400 });
    } else {
      timeoutId = setTimeout(init, 300);
    }
    return () => {
      clearTimeout(timeoutId);
      ctx?.revert();
    };
  }, [reduce]);

  return null;
}
