'use client';

import {useId, useLayoutEffect, useRef, useState} from 'react';

const pillars = [
  {
    title: 'Revenue Cycle & Billing',
    description: 'Eligibility and benefits verification, billing workflows, claim accuracy, denials, outstanding receivables, collections, and revenue leakage.',
  },
  {
    title: 'Technology & Vendors',
    description: 'IT infrastructure, software, cybersecurity, backups, system integrations, vendor performance, subscription costs, and overlapping or underused tools.',
  },
  {
    title: 'Operations & Workflow',
    description: 'Daily processes, staff responsibilities, manual and duplicate tasks, bottlenecks, communication gaps, and opportunities to simplify and automate work.',
  },
  {
    title: 'Data & AI Enablement',
    description: 'Data quality, accessibility, integration, privacy and access controls, reporting capabilities, employee readiness, and practical opportunities to use AI—with priorities based on business value and implementation effort.',
  },
];

// Each side has its own fixed offsets, bends, and stroke weights.
const leftStrands = [
  [-172, -78, -5, .85, .55],
  [-55, -15, 18, 1.35, .8],
  [66, 74, -17, 1.05, .7],
  [187, 135, 25, .7, .5],
];
const rightStrands = [
  [-199, -139, -23, 1.1, .7],
  [-73, -21, 11, .75, .48],
  [85, 63, -13, 1.4, .8],
  [205, 156, 27, .9, .58],
];

export function HeroFocusStrip() {
  const tooltipId = useId();
  const [active, setActive] = useState<number | null>(null);
  const strip = useRef<HTMLUListElement>(null);
  const [bounds, setBounds] = useState({width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0, radius: 0, offsetX: 0, offsetY: 0});

  useLayoutEffect(() => {
    const element = strip.current!;
    const hero = element.closest('section')!;
    function measure() {
      const frame = hero.getBoundingClientRect();
      const box = element.getBoundingClientRect();
      const content = element.parentElement!.getBoundingClientRect();
      setBounds({
        width: frame.width,
        offsetX: frame.left - content.left,
        offsetY: frame.top - content.top,
        height: frame.height,
        left: box.left - frame.left,
        right: box.right - frame.left,
        top: box.top - frame.top + .5,
        bottom: box.bottom - frame.top - .5,
        radius: parseFloat(getComputedStyle(element).borderTopLeftRadius),
      });
    }
    const observer = new ResizeObserver(measure);
    observer.observe(hero);
    observer.observe(element);
    observer.observe(element.parentElement!);
    measure();
    return () => observer.disconnect();
  }, []);

  const {width, height, left, right, top, bottom, radius, offsetX, offsetY} = bounds;
  const center = (top + bottom) / 2;
  const spread = Math.min(1, width / 680);
  function strand(shape: number[], index: number, edge: number, corner: number) {
    const [offset, bend, approach, weight, opacity] = shape;
    const y = index < 2 ? top : bottom;
    const run = edge - corner;
    const join = `${corner} ${y}`;
    const first = `${corner + run * .2} ${y}`;
    const second = `${corner + run * .28} ${y + approach * spread}`;
    const bendY = center + bend * spread;
    const middle = `${corner + run * .48} ${bendY}`;
    const third = `${corner + run * .68} ${2 * bendY - y - approach * spread}`;
    const fourth = `${corner + run * .82} ${center + (offset - approach) * spread}`;
    const end = `${edge} ${center + offset * spread}`;

    return {
      join,
      forward: `C ${first}, ${second}, ${middle} C ${third}, ${fourth}, ${end}`,
      fromEdge: `M ${end} C ${fourth}, ${third}, ${middle} C ${second}, ${first}, ${join}`,
      weight,
      opacity,
    };
  }

  const incoming = leftStrands.map((shape, index) => strand(shape, index, -8, left + radius));
  const outgoing = rightStrands.map((shape, index) => strand(shape, index, width + 8, right - radius));
  const pulseTiming = [
    [[26, -3], [31, -15], [28, -23]],
    [[30, -9], [25, -20], [32, -2]],
    [[27, -6], [32, -23], [29, -14]],
    [[31, -12], [28, -26], [25, -4]],
  ];

  return (
    <>
      <ul className="hero-focus-areas" ref={strip} aria-label="Business focus areas">
        {pillars.map(({title, description}, index) => (
          <li
            key={title}
            onPointerEnter={event => {
              if (event.pointerType === 'mouse') setActive(index);
            }}
            onPointerLeave={event => {
              if (event.pointerType === 'mouse') setActive(current => current === index ? null : current);
            }}
            data-active={active === index}
          >
            <button
              type="button"
              aria-expanded={active === index}
              aria-controls={`${tooltipId}-${index}`}
              onFocus={event => {
                if (event.currentTarget.matches(':focus-visible')) setActive(index);
              }}
              onBlur={() => setActive(current => current === index ? null : current)}
              onClick={event => {
                if (event.detail === 0) setActive(index);
                else if (event.nativeEvent instanceof PointerEvent && event.nativeEvent.pointerType !== 'mouse') {
                  setActive(current => current === index ? null : index);
                } else setActive(index);
              }}
              onKeyDown={event => {
                if (event.key === 'Escape') setActive(null);
              }}
            >
              {title}
            </button>
            <div className="hero-pillar-popup" id={`${tooltipId}-${index}`} hidden={active !== index}>
              <span className="hero-pillar-kicker">What we assess</span>
              <strong>{title}</strong>
              <p>{description}</p>
            </div>
          </li>
        ))}
      </ul>
      {width > 0 && (
        <svg className="hero-light-flow" style={{left: offsetX, top: offsetY, width, height}} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          <g fill="none" stroke="#a5e34b">
            {incoming.map(({fromEdge, weight, opacity}) => (
              <path key={fromEdge} d={fromEdge} strokeWidth={weight} opacity={opacity * .48}/>
            ))}
            {outgoing.map(({join, forward, weight, opacity}) => (
              <path key={join + forward} d={`M ${join} ${forward}`} strokeWidth={weight} opacity={opacity * .48}/>
            ))}
          </g>
          <g fill="none" strokeLinecap="round">
            {incoming.map(({fromEdge, weight}, index) => {
              const exit = outgoing[index];
              const route = `${fromEdge} L ${exit.join} ${exit.forward}`;
              return (
                <g key={index}>
                  {pulseTiming[index].map(([duration, delay], pulse) => (
                    <path
                      key={pulse}
                      className="hero-light-pulse"
                      d={route}
                      pathLength={100}
                      stroke={pulse === 0 ? '#eaffb0' : '#c7ff73'}
                      strokeWidth={weight + (pulse === 0 ? .65 : .35)}
                      strokeDasharray={['1.05 98.95', '.72 99.28', '.88 99.12'][pulse]}
                      strokeDashoffset={100 * delay / duration}
                      style={{animationDuration: `${duration}s`, animationDelay: `${delay}s`}}
                    />
                  ))}
                </g>
              );
            })}
          </g>
        </svg>
      )}
    </>
  );
}
