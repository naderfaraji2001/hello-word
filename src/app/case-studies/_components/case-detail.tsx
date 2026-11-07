import Link from "next/link";
import { AssessmentCTA } from "@/components/ui";
import { caseSummary, featuredOutcomes } from "../case-studies";
import { CaseLink, CaseOutcomes } from "./case-card";
import type { CaseStudy } from "./case-types";
import { CaseVisual } from "./case-visual";
import styles from "./case-studies.module.css";

function getRelated(study: CaseStudy, studies: readonly CaseStudy[]) {
  function relevance(candidate: CaseStudy) {
    const sameSolution = candidate.solution === study.solution;
    const sharedCategory = candidate.categories.some(category => study.categories.includes(category));
    const sameVisual = candidate.visualType === study.visualType;
    return 4 * Number(sameSolution) + 2 * Number(sharedCategory) + Number(sameVisual);
  }

  return studies
    .filter(candidate => candidate.slug !== study.slug && relevance(candidate) > 0)
    .sort((a, b) => relevance(b) - relevance(a) || a.number - b.number)
    .slice(0, 3);
}

export function CaseDetail({ study, studies }: { study: CaseStudy; studies: readonly CaseStudy[] }) {
  const hasResults = study.outcomeType === "results";
  const outcomeHeading = hasResults ? "The Results" : "Intended Business Benefits";
  const related = getRelated(study, studies);

  return (
    <main id="main">
      <section className={`page-hero dark ${styles.detailHero}`}>
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link className={styles.breadcrumbParent} href="/case-studies">Case Studies</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{study.title}</span>
          </nav>
          <p className="eyebrow">Case study</p>
          <p className={`eyebrow ${styles.solutionLabel}`}>{study.solution}</p>
          <h1>{study.title}</h1>
          <p>{caseSummary(study)}</p>
          <div className={`${styles.detailSummary} ${hasResults ? styles.resultsSummary : ""}`}>
            <h2 className={styles.outcomeLabel}>{hasResults ? "Results" : outcomeHeading}</h2>
            <CaseOutcomes outcomes={featuredOutcomes(study)} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.detailBody}`}>
          <div className={styles.detailSection}>
            <h2>The Challenge</h2>
            <p>{study.challenge}</p>
          </div>
          <div className={styles.detailSection}>
            <h2>Our Solution</h2>
            <p>{study.solutionText}</p>
          </div>
          <div className={styles.detailSection}>
            <h2>{outcomeHeading}</h2>
            <CaseOutcomes outcomes={study.outcomes} />
          </div>
          <div className={styles.detailVisual}>
            <CaseVisual type={study.visualType} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className={`section ${styles.related}`}>
          <div className="container">
            <h2>Related Case Studies</h2>
            <div className={styles.relatedGrid}>
              {related.map(candidate => (
                <article className={styles.relatedCard} key={candidate.slug}>
                  <p className={`eyebrow ${styles.solutionLabel}`}>{candidate.solution}</p>
                  <h3>{candidate.title}</h3>
                  <CaseLink study={candidate} />
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      <AssessmentCTA />
    </main>
  );
}
