import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import Link from "next/link";
import { caseHref, caseSummary, featuredOutcomes } from "../case-studies";
import type { CaseStudy } from "./case-types";
import { CaseVisual } from "./case-visual";
import styles from "./case-studies.module.css";

export function CaseOutcomes({ outcomes }: { outcomes: readonly string[] }) {
  return <ul className={styles.outcomes}>{outcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul>;
}

export function CaseLink({ study }: { study: CaseStudy }) {
  return (
    <Link className={styles.readLink} href={caseHref(study)} aria-label={`Read case study: ${study.title}`}>
      Read case study <ArrowUpRight aria-hidden="true" size={17} />
    </Link>
  );
}

export function CaseCard({ study }: { study: CaseStudy }) {
  return (
    <article className={styles.card}>
      <CaseVisual type={study.visualType} />
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <span className={styles.caseNumber}>Case {String(study.number).padStart(2, "0")}</span>
          <p className="eyebrow">{study.solution}</p>
        </div>
        <h3>{study.title}</h3>
        <p>{caseSummary(study)}</p>
        <p className={styles.outcomeLabel}>{study.outcomeType === "results" ? "Results" : "Intended Benefits"}</p>
        <CaseOutcomes outcomes={featuredOutcomes(study)} />
        <CaseLink study={study} />
      </div>
    </article>
  );
}
