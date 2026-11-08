"use client";

import { useId, useState, type ReactNode } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr/Plus";
import styles from "./solutions-work.module.css";

export function SolutionAccordion({
  title,
  pain,
  status,
  children,
}: {
  title: string;
  pain: string;
  status: string;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  return (
    <article className={styles.accordion}>
      <h3>
        <button
          className={styles.accordionTrigger}
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded(!expanded)}
        >
          <span className={styles.accordionPain}>{pain}</span>
          <span className={styles.accordionTitle}>{title}</span>
          <span className={styles.status}>{status}</span>
          <span className={styles.expandIcon}><Plus size={18} aria-hidden="true" /></span>
        </button>
      </h3>
      <div className={styles.accordionBody} id={panelId} hidden={!expanded}>
        {children}
      </div>
    </article>
  );
}
