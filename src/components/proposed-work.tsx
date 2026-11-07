'use client';

import {useId, useRef, useState, type KeyboardEvent, type PointerEvent} from 'react';
import {ArrowsHorizontal} from '@phosphor-icons/react/dist/ssr/ArrowsHorizontal';
import {comparisonKey, comparisonPosition} from '@/lib/interaction-math';
import {Button, SectionHead} from './ui';
import {proposedCases} from './proposed-work-data';
import styles from './proposed-work.module.css';

const initialPosition = 50;

function Diagram({diagram, after, hidden}: {
  diagram: typeof proposedCases[number]['after'];
  after: boolean;
  hidden: boolean;
}) {
  return (
    <div
      className={`${styles.layer} ${after ? styles.after : styles.before}`}
      aria-hidden={hidden}
      style={{visibility: hidden ? 'hidden' : undefined}}
    >
      <span className={`eyebrow ${styles.heading}`}>{after ? 'After' : 'Before'} · {diagram.heading}</span>
      <div className={styles.diagram} data-flow={diagram.flow} data-columns={diagram.columns.length}>
        {diagram.columns.map((column, index) => (
          <div className={styles.column} data-branch={column.length > 1 || undefined} key={column[0].title}>
            {index > 0 && diagram.flow && (
              <span className={styles.connector} aria-hidden="true">
                {diagram.flow === 'two-way' && !(diagram.finalForward && index === diagram.columns.length - 1) ? '↔' : '→'}
              </span>
            )}
            {column.map(({title, detail, annotation}) => (
              <div className={styles.node} key={title}>
                <strong>{title}</strong>
                {detail && <span>{detail}</span>}
                {annotation && <small>{annotation}</small>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className={styles.result}>{diagram.summary}</p>
    </div>
  );
}

export function ProposedWork() {
  const id = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const pointer = useRef<number | null>(null);
  const [selected, setSelected] = useState(0);
  const [position, setPosition] = useState(initialPosition);

  function select(index: number) {
    if (index !== selected) {
      setSelected(index);
      setPosition(initialPosition);
    }
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const count = proposedCases.length;
    const destination = {
      ArrowLeft: (index + count - 1) % count,
      ArrowRight: (index + 1) % count,
      Home: 0,
      End: count - 1,
    }[event.key];
    if (destination === undefined) return;
    event.preventDefault();
    select(destination);
    tabs.current[destination]?.focus();
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const {left, width} = event.currentTarget.getBoundingClientRect();
    setPosition(comparisonPosition(event.clientX, left, width));
  }

  return (
    <section className="section dark" id="work">
      <div className="container">
        <SectionHead
          eyebrow="Our Work"
          title={<>Real problems.<br/><em>Specific work.</em></>}
          body="See how we have approached the technology and operational issues behind laboratory growth, recurring costs and disconnected systems."
          href="/case-studies"
          action="Explore the case studies"
        />
        <div className={`case-tabs ${styles.tabs}`} role="tablist" aria-label="Case studies">
          {proposedCases.map((item, index) => (
            <button
              key={item.slug}
              ref={node => { tabs.current[index] = node; }}
              id={`${id}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={selected === index}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={event => navigate(event, index)}
            >
              <span aria-hidden="true">0{index + 1}</span>{item.tabLabel}
            </button>
          ))}
        </div>
        {proposedCases.map((item, index) => (
          <div
            key={item.slug}
            id={`${id}-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${index}`}
            hidden={selected !== index}
          >
            {selected === index && (
              <>
                <div className={styles.comparison}>
                  <Diagram diagram={item.after} after hidden={position === 100}/>
                  <div className={styles.reveal} style={{clipPath: `inset(0 ${100 - position}% 0 0)`}}>
                    <Diagram diagram={item.before} after={false} hidden={position === 0}/>
                  </div>
                  <div
                    className="comparison-track"
                    role="slider"
                    tabIndex={0}
                    aria-label="Compare before and after"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={position}
                    aria-valuetext={`${position}% before, ${100 - position}% after`}
                    onKeyDown={event => {
                      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
                      event.preventDefault();
                      setPosition(current => comparisonKey(event.key, current));
                    }}
                    onPointerDown={event => {
                      if (event.button !== 0 || pointer.current !== null) return;
                      pointer.current = event.pointerId;
                      event.currentTarget.setPointerCapture(event.pointerId);
                      event.currentTarget.focus({preventScroll: true});
                      move(event);
                    }}
                    onPointerMove={event => { if (pointer.current === event.pointerId) move(event); }}
                    onPointerUp={event => {
                      if (pointer.current !== event.pointerId) return;
                      move(event);
                      pointer.current = null;
                    }}
                    onLostPointerCapture={event => {
                      if (pointer.current === event.pointerId) pointer.current = null;
                    }}
                  >
                    <div className="compare-handle" style={{left: `${position}%`}} aria-hidden="true">
                      <span><ArrowsHorizontal size={22} weight="regular"/></span>
                    </div>
                  </div>
                </div>
                <p className="comparison-help small">Drag across the diagram to compare. Use arrow keys, Home or End when focused.</p>
                <div className="case-summary">
                  <div>
                    <p className="eyebrow">{item.category}</p>
                    <h3>{item.title}</h3>
                    <p>{item.client}</p>
                  </div>
                  <Button href={`/case-studies/${item.slug}`}>Read the case study</Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
