"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import styles from "./solutions-work.module.css";

type Range = { first: number; last: number; total: number };

export function SolutionCarousel({ children }: { children: ReactNode }) {
  const track = useRef<HTMLOListElement>(null);
  const id = useId();
  const [range, setRange] = useState<Range | null>(null);

  useEffect(() => {
    const list = track.current!;
    let frame = 0;
    const update = () => {
      const items = Array.from(list.children) as HTMLElement[];
      const left = list.getBoundingClientRect().left;
      const right = left + list.clientWidth;
      const visible = items.flatMap((item, index) => {
        const box = item.getBoundingClientRect();
        return box.left >= left - 2 && box.right <= right + 2 ? [index] : [];
      });
      if (!visible.length) return;
      const next = { first: visible[0], last: visible[visible.length - 1], total: items.length };
      setRange(previous => previous?.first === next.first && previous.last === next.last ? previous : next);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(list);
    list.addEventListener("scroll", schedule, { passive: true });
    update();
    return () => {
      observer.disconnect();
      list.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  const move = (direction: -1 | 1) => {
    const list = track.current!;
    const items = list.children;
    if (items.length < 2) return;
    const step = (items[1] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft;
    const index = Math.round(list.scrollLeft / step) + direction;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left: index * step, behavior: reduceMotion ? "instant" : "smooth" });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLOListElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  };

  return (
    <div className={styles.solutionCarousel} role="region" aria-roledescription="carousel" aria-labelledby="more-solutions-title">
      <ol ref={track} id={id} className={styles.solutionTrack} tabIndex={0} aria-label="More solutions" onKeyDown={onKeyDown}>
        {children}
      </ol>
      {range && (
        <div className={styles.carouselControls}>
          <p className={styles.carouselPosition} role="status" aria-live="polite" aria-atomic="true">
            <span className="sr-only">Showing solutions </span>{String(range.first + 1).padStart(2, "0")}–{String(range.last + 1).padStart(2, "0")}
            <span aria-hidden="true"> / </span><span className="sr-only"> of </span>{String(range.total).padStart(2, "0")}
          </p>
          <div className={styles.carouselButtons}>
            <button type="button" aria-label="Previous solutions" aria-controls={id} disabled={range.first === 0} onClick={() => move(-1)}>
              <ArrowLeft size={22} aria-hidden="true" />
            </button>
            <button type="button" aria-label="Next solutions" aria-controls={id} disabled={range.last === range.total - 1} onClick={() => move(1)}>
              <ArrowRight size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
