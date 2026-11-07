import {SectionHead} from './ui';

type SolutionEntry = {
  id: number;
  pain: string;
  solutionTitle: string;
  solutionDescription: string;
  benefit: string;
};

const solutionEntries: SolutionEntry[] = [
  {
    id: 1,
    pain: '“We’re doing the work, but we’re not collecting what we should.”',
    solutionTitle: 'Revenue Cycle & Billing',
    solutionDescription: 'Improve eligibility verification, claims, denial management, collections, and billing workflows.',
    benefit: 'Capture missed revenue and improve cash flow.',
  },
  {
    id: 2,
    pain: '“Our systems don’t talk to each other.”',
    solutionTitle: 'System Integration',
    solutionDescription: 'Connect LIS, EMR, billing, CRM, and other business applications.',
    benefit: 'Reduce duplicate entry, errors, and delays.',
  },
  {
    id: 3,
    pain: '“Our team spends too much time on repetitive tasks.”',
    solutionTitle: 'Workflow Improvement & Automation',
    solutionDescription: 'Remove unnecessary steps and automate routine work.',
    benefit: 'Free your team to focus on patients, customers, and business priorities.',
  },
  {
    id: 4,
    pain: '“Our IT costs keep increasing, and we don’t understand what we’re paying for.”',
    solutionTitle: 'IT Cost & Vendor Optimization',
    solutionDescription: 'Review support fees, subscriptions, contracts, and overlapping tools to identify unnecessary spending.',
    benefit: 'Lower avoidable costs with clear pricing and defined responsibilities.',
  },
  {
    id: 5,
    pain: '“Our computers, servers, and network can’t keep up with the business.”',
    solutionTitle: 'Infrastructure Modernization',
    solutionDescription: 'Assess and improve servers, networks, cloud resources, and aging equipment.',
    benefit: 'Improve reliability, performance, and capacity for growth.',
  },
  {
    id: 6,
    pain: '“Our Wi-Fi is unreliable, with dead zones and dropped connections.”',
    solutionTitle: 'Wireless Design & Implementation',
    solutionDescription: 'Assess coverage, interference, device needs, and capacity, then deploy and configure wireless access points.',
    benefit: 'Provide more consistent connectivity across offices, facilities, and warehouses.',
  },
  {
    id: 7,
    pain: '“If our systems go down, we don’t know how quickly we can recover.”',
    solutionTitle: 'Backup & Disaster Recovery',
    solutionDescription: 'Establish monitored backups, recovery procedures, and restoration testing for critical systems and data.',
    benefit: 'Reduce the risk of data loss and extended downtime.',
  },
  {
    id: 8,
    pain: '“We’re concerned about cyberattacks and unauthorized access.”',
    solutionTitle: 'Cybersecurity & Access Protection',
    solutionDescription: 'Strengthen endpoint security, monitoring, authentication, and access controls.',
    benefit: 'Reduce exposure and improve the ability to detect and respond to threats.',
  },
  {
    id: 9,
    pain: '“We have plenty of data, but we can’t get clear answers.”',
    solutionTitle: 'Data & Business Intelligence',
    solutionDescription: 'Connect information through dashboards, automated reports, and shared business metrics.',
    benefit: 'Give leadership clearer visibility into performance.',
  },
  {
    id: 10,
    pain: '“We want to use AI, but we don’t know where to start.”',
    solutionTitle: 'Data & AI Enablement',
    solutionDescription: 'Assess readiness, identify practical applications, and implement solutions around specific business needs.',
    benefit: 'Put AI to work with clear priorities and measurable goals.',
  },
  {
    id: 11,
    pain: '“We lose touch with patients after they leave treatment.”',
    solutionTitle: 'Patient Engagement & Aftercare',
    solutionDescription: 'Use a mobile application for check-ins, reminders, recovery resources, alumni connections, and communication with the care team.',
    benefit: 'Support continued engagement and continuity of care after discharge.',
  },
  {
    id: 12,
    pain: '“Our therapists spend too much time preparing group sessions, printing worksheets, and completing paperwork.”',
    solutionTitle: 'Digital Group Therapy Workflows',
    solutionDescription: 'Use a mobile application to distribute worksheets, collect patient responses, organize session materials, and support documentation with therapist review.',
    benefit: 'Reduce printing and administrative work so therapists can spend more time supporting patients.',
  },
  {
    id: 13,
    pain: '“We’ve outgrown our technology, but we don’t have a clear plan.”',
    solutionTitle: 'Technology Leadership & Roadmap',
    solutionDescription: 'Prioritize investments, coordinate providers, and guide implementation.',
    benefit: 'Align technology improvements with business goals and budget.',
  },
  {
    id: 14,
    pain: '“We depend on one provider and don’t feel in control.”',
    solutionTitle: 'Technology Ownership & Transparency',
    solutionDescription: 'Establish administrative access, documentation, clear responsibilities, and knowledge transfer.',
    benefit: 'Keep control of your systems and future decisions.',
  },
];

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
