"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { caseFilters, type CaseStudyFilter } from "@/app/case-studies/_components/case-types";
import type { archiveEntries } from "./solutions-work-data";
import styles from "./solutions-work.module.css";

export function WorkArchive({ entries }: { entries: typeof archiveEntries }) {
  const [selected, setSelected] = useState<CaseStudyFilter>("all");
  const visible = selected === "all"
    ? entries
    : entries.filter(entry => entry.categories.includes(selected));

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Filter case studies">
        {caseFilters.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-pressed={selected === id}
            aria-controls="work-archive-list"
            onClick={() => setSelected(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className={styles.archiveCount} role="status">
        Showing {visible.length} of {entries.length} case studies
      </p>
      <ul className={styles.archiveList} id="work-archive-list" key={selected}>
        {visible.map(entry => (
          <li key={entry.number}>
            <Link className={styles.archiveLink} href={entry.href} prefetch={false}>
              <span className={styles.caseNumber}>
                <span className="sr-only">Case </span>
                {String(entry.number).padStart(2, "0")}
              </span>
              <div className={styles.archiveCopy}>
                <span className={styles.archiveCategory}>{entry.category}</span>
                <h3>{entry.title}</h3>
                <span className={styles.archiveEvidence}>{entry.evidence}</span>
              </div>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
