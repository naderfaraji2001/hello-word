"use client";

import { Fragment, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { caseFilters, type CaseStudyCategory, type CaseStudyFilter } from "./case-types";
import styles from "./case-studies.module.css";

type Card = {
  slug: string;
  categories: readonly CaseStudyCategory[];
  content: ReactNode;
};

export function CaseCollection({ cards }: { cards: readonly Card[] }) {
  const searchParams = useSearchParams();
  const selected = caseFilters.find(({ id }) => id === searchParams.get("category"))?.id ?? "all";

  function selectFilter(category: CaseStudyFilter) {
    if (category === selected) return;

    const url = new URL(window.location.href);
    if (category === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", category);
    }
    window.history.pushState(null, "", url);
  }

  const visibleCards = selected === "all"
    ? cards
    : cards.filter(({ categories }) => categories.includes(selected));

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Filter case studies">
        {caseFilters.map(({ id, label }) => (
          <button key={id} type="button" aria-pressed={selected === id} aria-controls="case-study-grid" onClick={() => selectFilter(id)}>
            {label}
          </button>
        ))}
      </div>
      <div className={styles.grid} id="case-study-grid">
        {visibleCards.map(({ slug, content }) => <Fragment key={slug}>{content}</Fragment>)}
      </div>
    </>
  );
}
