import {SectionHead} from './ui';
import {solutionEntries} from '@/content/solution-entries';

const steps = [
  {
    title: 'Assess your business',
    description: 'Review the systems, workflows, costs, vendors, and operational constraints behind the problem.',
  },
  {
    title: 'Recommend practical solutions',
    description: 'Prioritize the changes that can produce the clearest business benefit.',
  },
  {
    title: 'Work alongside your team',
    description: 'Coordinate implementation, vendors, documentation, and ongoing ownership.',
  },
];

function EntryLabel({children}: {children: React.ReactNode}) {
  return <span className="solution-entry-label">{children}</span>;
}

export function SolutionsOverview() {
  return <>
    <section className="section solutions-overview" id="solutions-overview" aria-labelledby="solutions-overview-title">
      <div className="container">
        <SectionHead
          eyebrow="Solutions"
          title={<span id="solutions-overview-title">Real problems. Practical solutions.</span>}
          body="Start with the issue your team is facing. See the practical solution and the business outcome it is intended to support."
        />
        <div className="solution-column-labels" aria-hidden="true">
          <span>Your pain</span>
          <span>Our solution</span>
          <span>The business benefit</span>
        </div>
        <ol className="solution-entry-list">
          {solutionEntries.map((entry) => <li key={entry.id}>
            <article className="solution-entry">
              <div className="solution-entry-pain">
                <EntryLabel>Your pain</EntryLabel>
                <span className="solution-entry-index" aria-hidden="true">{String(entry.id).padStart(2, '0')}</span>
                <p>{entry.pain}</p>
              </div>
              <div className="solution-entry-solution">
                <EntryLabel>Our solution</EntryLabel>
                <h3>{entry.solutionTitle}</h3>
                <p>{entry.solutionDescription}</p>
              </div>
              <div className="solution-entry-benefit">
                <EntryLabel>The business benefit</EntryLabel>
                <p>{entry.benefit}</p>
              </div>
            </article>
          </li>)}
        </ol>
      </div>
    </section>
    <section className="section solutions-process" aria-labelledby="solutions-process-title">
      <div className="container">
        <SectionHead
          eyebrow="How we work"
          title={<span id="solutions-process-title">Assessment first. Action next.</span>}
          body="We start with an assessment of your business, recommend practical solutions, and work alongside your team to put them into action."
        />
        <ol className="solutions-process-list">
          {steps.map((step, index) => <li key={step.title}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>)}
        </ol>
      </div>
    </section>
  </>;
}
