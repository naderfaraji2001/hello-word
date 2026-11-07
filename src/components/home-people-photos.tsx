'use client';

import type {PointerEvent, ReactNode} from 'react';

export function HomePeoplePhotos({children}: {children: ReactNode}) {
  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return;
    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    element.style.setProperty('--photo-x', `${-x * 16}px`);
    element.style.setProperty('--photo-y', `${-y * 18}px`);
  }

  function reset(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.removeProperty('--photo-x');
    event.currentTarget.style.removeProperty('--photo-y');
  }

  return (
    <div className="home-people-photos" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
      {children}
    </div>
  );
}
