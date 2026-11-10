import Image from 'next/image';
import {AboutMotion} from '@/components/about-motion';
import {HomePeoplePhotos} from '@/components/home-people-photos';
import {AssessmentCTA, Button} from '@/components/ui';
import styles from './about-page.module.css';

const experience = [
  'Laboratory workflows',
  'Behavioral health operations',
  'Enterprise technology',
  'Integration and implementation',
] as const;

const milestones = [
  ['2015', 'Work inside a behavioral health organization and its laboratory.'],
  ['2018', 'Move into enterprise technology and manufacturing.'],
  ['2021', 'VP of IT role.'],
  ['Early 2024', 'Full-time focus on Utopia.'],
  ['Today', 'Healthcare technology and operations work, with new product directions in development.'],
] as const;

const principles = [
  ['01', 'Start with the operation', 'We first understand how the organization, teams, systems and responsibilities work today.'],
  ['02', 'Find the real constraint', 'The visible problem may come from a workflow, a system connection, a vendor arrangement or an unclear handoff.'],
  ['03', 'Stay through implementation', 'We recommend practical next steps and work alongside the people responsible for putting them into action.'],
] as const;

export function AboutPage() {
  return <main id="main" className={styles.page}>
    <AboutMotion/>

    <section className={styles.hero}>
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy} data-about-reveal>
          <p className="eyebrow">About Utopia</p>
          <h1>We learned the operation from the inside.</h1>
          <p>Utopia Tech Solutions brings together healthcare operational experience and enterprise technology execution. We work with medical laboratories and behavioral health organizations to understand the business and improve the systems supporting it.</p>
          <div className={styles.actions}>
            <Button href="/case-studies">Explore our work</Button>
            <Button href="/assessment" secondary>Request an assessment</Button>
          </div>
        </div>
        <figure className={styles.heroVisual} data-about-reveal>
          <span className={styles.heroOutline} aria-hidden="true"/>
          <Image src="/media/founder.webp" alt="Nader Faraji, founder of Utopia Tech Solutions" width={800} height={1000} priority sizes="(max-width: 800px) 100vw, 38vw"/>
          <figcaption>Nader Faraji · Founder, Utopia Tech Solutions</figcaption>
        </figure>
      </div>
    </section>

    <section className={`section ${styles.people}`}>
      <div className={`container home-people-layout ${styles.peopleGrid}`}>
        <HomePeoplePhotos>
          <Image className="home-people-conversation" src="/media/founder-home-conversation.webp" alt="Nader Faraji speaking with attendees at a healthcare technology event" width={580} height={773} sizes="(max-width: 700px) 49vw, 285px"/>
          <Image className="home-people-portrait" src="/media/founder-home-portrait.webp" alt="Nader Faraji at a healthcare technology event" width={900} height={675} sizes="(max-width: 700px) 48vw, 265px"/>
        </HomePeoplePhotos>
        <div className={`home-people-copy ${styles.peopleCopy}`} data-about-reveal>
          <p className="eyebrow">The people behind the work</p>
          <h2>Healthcare experience.<br/><mark>Technical depth.</mark></h2>
          <p>Utopia is a small, senior team led by Nader Faraji. The work combines knowledge of healthcare operations with experience building and running enterprise technology.</p>
          <div className={styles.founderIdentity}>
            <strong>Nader Faraji</strong>
            <span>Founder, Utopia Tech Solutions</span>
          </div>
          <blockquote>“We understand the healthcare operation first. Then we use technology to make it work better.”</blockquote>
          <ul className={styles.experienceLabels} aria-label="Experience areas">
            {experience.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>

    <section className={`section dark ${styles.why}`}>
      <div className={`container ${styles.whyGrid}`}>
        <div data-about-reveal>
          <p className="eyebrow">Why it matters</p>
          <h2>Operational problems rarely stay inside one department.</h2>
          <p>An operational issue rarely stays inside one department or one system. Understanding the context helps us ask better questions, work with the people involved and decide whether the useful response is an integration, a process change, stronger infrastructure or specialist support.</p>
        </div>
        <div className={styles.systemMap} role="img" aria-label="Operations, technology, revenue and vendors are connected around the business operation.">
          <svg viewBox="0 0 600 600" aria-hidden="true">
            <circle cx="300" cy="300" r="230"/>
            <circle cx="300" cy="300" r="138"/>
            <path d="M300 70 V530 M70 300 H530 M137 137 L463 463 M463 137 L137 463"/>
            <circle className={styles.signal} cx="300" cy="300" r="230" pathLength="100"/>
          </svg>
          <span className={`${styles.mapNode} ${styles.mapOperations}`}>Operations</span>
          <span className={`${styles.mapNode} ${styles.mapTechnology}`}>Technology</span>
          <span className={`${styles.mapNode} ${styles.mapRevenue}`}>Revenue</span>
          <span className={`${styles.mapNode} ${styles.mapVendors}`}>Vendors</span>
          <strong>Business<br/>operation</strong>
        </div>
      </div>
    </section>

    <section className={`section ${styles.story}`}>
      <div className={`container ${styles.storyGrid}`}>
        <div data-about-reveal>
          <p className="eyebrow">From operations to technology</p>
          <h2>The experience behind Utopia’s approach.</h2>
          <p>Nader’s healthcare work began inside a behavioral health organization in Southern California that also operated a medical laboratory. That experience brought him into the practical details of admissions, care coordination, billing, instruments, laboratory systems and results.</p>
          <p>He later moved into enterprise technology, progressing through management to a VP of IT role. During the increase in laboratory testing demand associated with COVID, he began supporting laboratories that needed both technical delivery and an understanding of the way they worked. In early 2024, he moved into Utopia full time.</p>
        </div>
        <figure data-about-reveal>
          <Image src="/media/event.webp" alt="Nader Faraji at a healthcare technology event" width={1000} height={750} sizes="(max-width: 800px) 100vw, 42vw"/>
          <figcaption>Industry conversation · Event context — no endorsement implied</figcaption>
        </figure>
      </div>
    </section>

    <section className={`section dark ${styles.timelineSection}`}>
      <div className="container">
        <p className="eyebrow">Experience timeline</p>
        <h2>Experience that shaped the approach.</h2>
        <ol className={styles.timeline} data-about-reveal>
          {milestones.map(([year, text]) => <li key={year}>
            <span aria-hidden="true"/>
            <strong>{year}</strong>
            <p>{text}</p>
          </li>)}
        </ol>
      </div>
    </section>

    <section className={`section lime ${styles.principles}`}>
      <div className="container">
        <p className="eyebrow">How Utopia approaches the work</p>
        <h2>Understand first. Then act.</h2>
        <div className={styles.principleGrid}>
          {principles.map(([number, title, body]) => <article key={number} data-about-reveal>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className={`section ${styles.team}`}>
      <div className={`container ${styles.teamGrid}`}>
        <div data-about-reveal>
          <p className="eyebrow">How the team is built</p>
          <h2>Senior experience, shaped around the work.</h2>
          <p>Utopia works as a small, senior team, bringing specialist expertise into the engagement when the work requires it.</p>
          <p>The team is defined around the problem, the systems involved and the expertise the organization already has.</p>
        </div>
        <div className={styles.engagementModel} role="img" aria-label="Utopia works with the client team, specialist expertise and existing vendors around one defined engagement.">
          <span className={styles.engagementCenter}>Defined<br/>engagement</span>
          <span className={styles.engagementUtopia}>Utopia</span>
          <span className={styles.engagementClient}>Client team</span>
          <span className={styles.engagementSpecialists}>Specialist expertise</span>
          <span className={styles.engagementVendors}>Existing vendors</span>
        </div>
      </div>
    </section>

    <section className={`section dark ${styles.media}`}>
      <div className="container">
        <div className={styles.mediaHeading}>
          <div><p className="eyebrow">Staying close to the field</p><h2>At the industry conversation.</h2></div>
          <p>Staying close to the field is part of understanding it.</p>
        </div>
        <figure className={styles.mediaLead} data-about-reveal>
          <Image src="/media/event.webp" alt="Nader Faraji speaking at a healthcare technology event" width={1400} height={820} sizes="100vw"/>
          <figcaption>Healthcare technology event · Event context — no endorsement implied</figcaption>
        </figure>
        <div className={styles.mediaGrid}>
          <figure data-about-reveal>
            <video controls preload="none" poster="/media/event-clip-poster.webp" aria-label="Healthcare technology event footage">
              <source src="/media/event-clip.mp4" type="video/mp4"/>
              <track kind="descriptions" src="/media/event.vtt" srcLang="en" label="English descriptions"/>
            </video>
            <figcaption>Industry conversation · Event context — no endorsement implied</figcaption>
          </figure>
          <figure data-about-reveal>
            <video controls preload="none" poster="/media/exhibit-poster.webp" aria-label="Laboratory technology exhibit footage">
              <source src="/media/exhibit.mp4" type="video/mp4"/>
              <track kind="descriptions" src="/media/exhibit.vtt" srcLang="en" label="English descriptions"/>
            </video>
            <figcaption>Exploring laboratory technology · Exhibit equipment is not represented as Utopia property.</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <AssessmentCTA/>
  </main>;
}
