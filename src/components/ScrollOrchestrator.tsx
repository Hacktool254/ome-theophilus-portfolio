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

      ctx = gsap.context(() => {

        /* ── 1. About entrance: slides up over Hero (same motion as Contact over Stack) */
        const aboutWrap = document.querySelector<HTMLElement>("#about-wrap");
        if (aboutWrap) {
          gsap.fromTo(aboutWrap,
            { yPercent: 5, scale: 0.97 },
            {
              yPercent: 0, scale: 1, ease: "none",
              scrollTrigger: {
                trigger: "#hero",
                start: "bottom 95%",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        }

        /* ── 2. About splits + Projects fades in — same scrub trigger ── */
        const aboutScene = document.querySelector<HTMLElement>("#about-scene");
        const aboutLeft  = document.querySelector<HTMLElement>("#about-left");
        const aboutRight = document.querySelector<HTMLElement>("#about-right");
        const projectsEl = document.querySelector<HTMLElement>("#projects");

        if (aboutScene && aboutLeft && aboutRight) {
          // about-scene is 200dvh. Halves split during the second 100dvh (50%→100%).
          const splitTrigger = {
            trigger: aboutScene,
            start: "50% top",
            end: "58% top",
            scrub: 1.4,
          };

          gsap.to(aboutLeft,  { xPercent: -100, ease: "power2.inOut", scrollTrigger: splitTrigger });
          gsap.to(aboutRight, { xPercent:  100, ease: "power2.inOut", scrollTrigger: splitTrigger });

          // Projects fades in as About splits
          if (projectsEl) {
            gsap.to(projectsEl, {
              opacity: 1, ease: "power2.out",
              scrollTrigger: {
                trigger: aboutScene,
                start: "51% top",
                end: "57% top",
                scrub: 1,
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

          ScrollTrigger.create({
            trigger: projectsSection,
            start: "top top",
            end: () => `+=${getTravel()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            animation: gsap.to(track, { x: () => -getTravel(), ease: "none" }),
            onUpdate: (self) => {
              if (barEl) barEl.style.width = `${self.progress * 100}%`;
            },
          });
        }

        /* ── 4. Contact slides over Stack ── */
        const contactEl = document.querySelector<HTMLElement>("#contact-outer");
        if (contactEl) {
          gsap.fromTo(contactEl,
            { yPercent: 5, scale: 0.97 },
            {
              yPercent: 0, scale: 1, ease: "none",
              scrollTrigger: {
                trigger: contactEl,
                start: "top 98%",
                end: "top top",
                scrub: 1,
              },
            }
          );
        }

        /* ── 5. Stack cards stagger ── */
        gsap.utils.toArray<HTMLElement>(".stack-card").forEach((card) => {
          const fromLeft = card.dataset.from === "left";
          gsap.set(card, { x: fromLeft ? -60 : 60, opacity: 0 });
          gsap.to(card, {
            x: 0, opacity: 1, duration: 0.7, ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          });
        });

        ScrollTrigger.refresh();
      });
    };

    const t = setTimeout(init, 500);
    return () => { clearTimeout(t); ctx?.revert(); };
  }, [reduce]);

  return null;
}
