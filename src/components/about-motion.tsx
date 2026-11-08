'use client';

import {useEffect} from 'react';

export function AboutMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const targets = document.querySelectorAll<HTMLElement>('[data-about-reveal]');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.aboutVisible = 'true';
        observer.unobserve(entry.target);
      }
    }, {threshold: .16});
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return null;
}
