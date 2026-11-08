import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { caseHref } from "@/app/case-studies/case-studies";
import { AssessmentCTA, Button, SectionHead } from "@/components/ui";
import { SolutionAccordion } from "./solution-accordion";
import { WorkArchive } from "./work-archive";
import { archiveEntries, featuredWork, moreSolutions } from "./solutions-work-data";
import styles from "./solutions-work.module.css";

export const metadata: Metadata = {
  title: "Solutions & Work — Utopia Tech",
  description: "Explore the business problems Utopia helps solve, the practical solutions behind the work, and related outcomes across revenue, systems, operations, infrastructure and data.",
  alternates: { canonical: "/solutions-work" },
};

const sections = [
  { id: "featured-work", label: "Featured work" },
  { id: "more-solutions", label: "More solutions" },
  { id: "case-studies", label: "All case studies" },
  { id: "how-we-work", label: "How we work" },
];

const steps = [
  {
    title: "Assess your business",
    description: "Review the systems, workflows, costs, vendors and operational constraints behind the problem.",
  },
  {
    title: "Recommend practical solutions",
    description: "Prioritize the changes that can produce the clearest business benefit.",
  },
  {
    title: "Work alongside your team",
    description: "Coordinate implementation, vendors, documentation and ongoing ownership.",
  },
];

function WorkDiagram() {
  return (
    <div className={styles.diagram} aria-hidden="true">
      <div className={styles.diagramHeader}>
        <span>From problem to outcome</span>
        <span>01—03</span>
      </div>
      <div className={styles.diagramCanvas}>
        <svg viewBox="0 0 380 164" fill="none" focusable="false">
          <g className={styles.diagramGuides}>
            <path d="M46 14v136M190 14v136M334 14v136M22 82h336" />
          </g>
          <g className={styles.diagramInputs}>
            <path d="M46 38h42q10 0 17 7l30 30q7 7 17 7h15M46 82h121M46 126h42q10 0 17-7l30-30q7-7 17-7h15" />
            <circle cx="46" cy="38" r="4" />
            <circle cx="46" cy="82" r="4" />
            <circle cx="46" cy="126" r="4" />
          </g>
          <path className={styles.diagramTrace} d="M46 82h288" />
          <path className={styles.diagramOutputs} d="M213 82h18q10 0 17-7l30-30q7-7 17-7h39M213 82h18q10 0 17 7l30 30q7 7 17 7h39" />
          <rect className={styles.diagramJunction} x="167" y="59" width="46" height="46" rx="12" />
          <path className={styles.diagramCross} d="M180 82h20m-10-10v20" />
          <g className={styles.diagramEndpoints}>
            <rect x="330" y="34" width="8" height="8" rx="1" />
            <rect x="330" y="78" width="8" height="8" rx="1" />
            <rect x="330" y="122" width="8" height="8" rx="1" />
          </g>
        </svg>
      </div>
      <div className={styles.diagramLabels}>
        <span>Problem</span>
        <span>Solution</span>
        <span>Outcome</span>
      </div>
    </div>
  );
}

export default function SolutionsWorkPage() {
  return (
    <main id="main" className={styles.page}>
      <div className="container">
        <section className={styles.hero} aria-labelledby="work-title">
          <div className={styles.heroCopy}>
            <p className="eyebrow">Solutions &amp; Work</p>
            <h1 id="work-title">Start with the problem. <em>See what changed.</em></h1>
            <p className={styles.heroIntro}>Explore the problems organizations bring to us, the practical solutions we put in place, and the related work behind them.</p>
            <div className={styles.heroActions}>
              <Button href="#featured-work" icon="down">Explore featured work</Button>
              <Button href="/assessment" secondary>Request an assessment</Button>
            </div>
          </div>
          <WorkDiagram />
        </section>
      </div>

      <nav className={styles.localNav} aria-label="Solutions and work sections">
        <ol>
          {sections.map(({ id, label }, index) => (
            <li key={id}>
              <a href={`#${id}`}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section className={styles.section} id="featured-work" aria-labelledby="featured-work-title">
        <div className="container">
          <SectionHead
            eyebrow="Featured solutions & work"
            title={<span id="featured-work-title">Real problems. Practical responses. Clear outcomes.</span>}
            body="Each example begins with the issue the organization was facing, then connects the solution to the change it supported."
          />
          <ol className={styles.featuredList}>
            {featuredWork.map((entry, index) => (
              <li key={entry.id}>
                <article className={styles.feature} aria-labelledby={`work-solution-${entry.id}`}>
                  <div className={styles.problem}>
                    <div className={styles.problemHeader}>
                      <p className={styles.label}>The problem</p>
                      <span className={styles.featureIndex} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <p className={styles.quote}>{entry.pain}</p>
                  </div>
                  <div className={styles.solution}>
                    <p className={styles.label}>The solution</p>
                    <h3 id={`work-solution-${entry.id}`}>{entry.title}</h3>
                    <p>{entry.description}</p>
                  </div>
                  <div className={styles.outcome}>
                    <div>
                      <p className={styles.label}>The outcome</p>
                      <p className={styles.resultLabel}>{entry.outcomeLabel}</p>
                      <ul className={styles.results}>
                        {entry.outcomes.map(outcome => <li key={outcome}>{outcome}</li>)}
                      </ul>
                    </div>
                    <div className={styles.relatedCase}>
                      <p className={styles.label}>Related case study</p>
                      <p className={styles.caseTitle}>{entry.study.title}</p>
                      <Link
                        className={styles.textLink}
                        href={caseHref(entry.study)}
                        aria-label={`Read the full case study: ${entry.study.title}`}
                      >
                        Read the full case study <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${styles.section} ${styles.more}`} id="more-solutions" aria-labelledby="more-solutions-title">
        <div className="container">
          <SectionHead
            eyebrow="More problems we can help solve"
            title={<span id="more-solutions-title">Not every engagement starts in the same place.</span>}
            body="Some organizations begin with one immediate problem. Others need a broader assessment across systems, costs, operations and ownership."
          />
          <div className={styles.accordionGrid}>
            {moreSolutions.map(entry => (
              <SolutionAccordion key={entry.id} title={entry.solutionTitle} pain={entry.pain} status={entry.status}>
                <p className={styles.label}>The solution</p>
                <p>{entry.solutionDescription}</p>
                <p className={styles.label}>{entry.hasResults ? "Business benefit" : "Intended benefits"}</p>
                <p>{entry.benefit}</p>
                <div className={styles.accordionLinks}>
                  {entry.detail && (
                    <Link href={entry.detail.route} className={styles.textLink}>
                      Explore {entry.detail.label.toLowerCase()} <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                  <Link href={caseHref(entry.study)} className={styles.textLink}>
                    {entry.study.title} <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                  {entry.product && (
                    <Link href={entry.product.href} className={styles.textLink}>
                      {entry.product.label} <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </SolutionAccordion>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="case-studies" aria-labelledby="work-archive-title">
        <div className="container">
          <SectionHead
            eyebrow="All case studies"
            title={<span id="work-archive-title">Explore the complete work archive.</span>}
            body="Browse the full collection by the type of problem, solution area or business outcome."
          />
          <WorkArchive entries={archiveEntries} />
        </div>
      </section>

      <section className={`${styles.section} ${styles.process}`} id="how-we-work" aria-labelledby="work-process-title">
        <div className="container">
          <SectionHead
            eyebrow="How we work"
            title={<span id="work-process-title">Assessment first. Action next.</span>}
            body="We start with an assessment of your business, recommend practical solutions, and work alongside your team to put them into action."
          />
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <AssessmentCTA />
    </main>
  );
}
