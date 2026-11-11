"use client";

import { useId, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./solutions-work.module.css";

gsap.registerPlugin(ScrollTrigger);

/** Rounded outer edge with a continuous, concave recess for the case link. */
function cardOutline(width: number, height: number) {
  const w = width - 1;
  const h = height - 1;
  const recess = Math.min(272, w - 64);
  return `M32 .5 H${w - 32} Q${w} .5 ${w} 32 V${h - 106} Q${w} ${h - 80} ${w - 26} ${h - 80} H${w - recess + 26} Q${w - recess} ${h - 80} ${w - recess} ${h - 54} V${h - 26} Q${w - recess} ${h} ${w - recess - 26} ${h} H32 Q.5 ${h} .5 ${h - 32} V32 Q.5 .5 32 .5 Z`;
}

export function FeaturedCard({ children, action, labelledBy }: {
  children: ReactNode;
  action: ReactNode;
  labelledBy: string;
}) {
  const root = useRef<HTMLElement>(null);
  const id = `work-shape-${useId().replace(/:/g, "")}`;

  useLayoutEffect(() => {
    const card = root.current!;
    const surface = card.querySelector<HTMLElement>("[data-card-surface]")!;
    // Scope updates to the silhouette; icon paths must retain their geometry.
    const paths = card.querySelectorAll("[data-card-outline]");
    const observer = new ResizeObserver(() => {
      const d = cardOutline(surface.offsetWidth, surface.offsetHeight);
      paths.forEach(path => path.setAttribute("d", d));
      surface.style.clipPath = `url(#${id})`;
      card.dataset.shaped = "true";
    });
    observer.observe(surface);
    return () => observer.disconnect();
  }, [id]);

  return (
    <article ref={root} className={styles.featureCard} data-feature-card aria-labelledby={labelledBy}>
      <div className={styles.feature} data-card-surface>{children}</div>
      <svg className={styles.cardEdge} aria-hidden="true" focusable="false">
        <defs><clipPath id={id} clipPathUnits="userSpaceOnUse"><path data-card-outline /></clipPath></defs>
        <path className={styles.cardStroke} data-card-outline />
      </svg>
      {action}
    </article>
  );
}

export function FeaturedStack({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scene = root.current!;
    const stage = scene.querySelector<HTMLOListElement>("ol")!;
    const cards = Array.from(stage.children) as HTMLElement[];
    const media = gsap.matchMedia();
    let rebuildFrame = 0;
    let disposeScene: (() => void) | undefined;

    function build() {
      disposeScene?.();
      // Measure in normal flow first. A short desktop or zoomed viewport gets
      // the complete static layout rather than a pinned, clipped reading area.
      const height = Math.max(...cards.map(card => card.offsetHeight));
      const top = Math.max(112, (window.innerHeight - height - 96) / 2);
      if (height > window.innerHeight - top - 116 || cards.length < 2) return;

      const context = gsap.context(() => {
        scene.dataset.stack = "true";
        stage.style.height = `${height}px`;
        cards.forEach((card, i) => {
          card.style.zIndex = String(i + 1);
          card.style.height = `${height}px`;
        });
        const entranceY = () => window.innerHeight - top + 24;
        gsap.set(cards, { y: 0, z: 0, scale: 1, opacity: 1, filter: "blur(0px)" });
        gsap.set(cards.slice(1), { y: entranceY });
        let active = -1;
        const setActive = (index: number) => {
          if (index === active) return;
          active = index;
          cards.forEach((card, i) => {
            card.style.pointerEvents = i === active ? "auto" : "none";
            // Inactive links stay in keyboard order. Focus reveals their card
            // by scrolling the same timeline, including Shift+Tab in reverse.
            card.dataset.active = String(i === active);
          });
        };
        const hold = .35;
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "solutions-work-stack",
            trigger: stage,
            start: () => `top ${top}px`,
            end: () => `+=${(cards.length - 1) * window.innerHeight * .9 + window.innerHeight * .25}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: self => {
              const time = self.animation?.time() ?? 0;
              const index = Math.min(cards.length - 1, Math.max(0, Math.floor((time + .45) / (1 + hold))));
              setActive(time < hold ? 0 : index);
            },
          },
        });
        for (let i = 1; i < cards.length; i++) {
          const at = hold + (i - 1) * (1 + hold);
          timeline.to(cards[i - 1], { scale: .88, z: -200, opacity: .25, filter: "blur(8px)", duration: 1 }, at);
          timeline.to(cards[i], { y: 0, duration: 1 }, at);
        }
        // A brief final reading interval; no unused spacer after release.
        timeline.to({}, { duration: hold });
        setActive(0);
        const focus = (event: FocusEvent) => {
          const index = cards.findIndex(card => card.contains(event.target as Node));
          if (index < 0 || cards[index].dataset.active === "true") return;
          const trigger = timeline.scrollTrigger!;
          const time = index === 0 ? 0 : hold + (index - 1) * (1 + hold) + 1;
          const y = trigger.start + (trigger.end - trigger.start) * time / timeline.duration();
          window.scrollTo({ top: y, behavior: "instant" });
          timeline.time(time);
          setActive(index);
        };
        stage.addEventListener("focusin", focus);
        disposeScene = () => {
          stage.removeEventListener("focusin", focus);
          context.revert();
          delete scene.dataset.stack;
          stage.style.removeProperty("height");
          cards.forEach(card => {
            card.style.removeProperty("height");
            card.style.removeProperty("z-index");
            card.style.removeProperty("pointer-events");
            delete card.dataset.active;
          });
          disposeScene = undefined;
        };
      }, scene);
    }

    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      let live = true;
      const schedule = () => {
        cancelAnimationFrame(rebuildFrame);
        rebuildFrame = requestAnimationFrame(() => { if (live) build(); });
      };
      // Font loading changes card height; never pin using fallback-font metrics.
      document.fonts.ready.then(schedule);
      window.addEventListener("resize", schedule);
      return () => {
        live = false;
        cancelAnimationFrame(rebuildFrame);
        window.removeEventListener("resize", schedule);
        disposeScene?.();
      };
    });
    return () => media.revert();
  }, []);

  return <div ref={root} className={styles.featuredScene}><ol className={styles.featuredList} data-work-stage>{children}</ol></div>;
}
