import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Button, AssessmentCTA, SectionHead } from "@/components/ui";
import { records } from "@/lib/content/repository";
import { CaseCard } from "./_components/case-card";
import { CaseCollection } from "./_components/case-collection";
import { caseStudies } from "./case-studies";
import styles from "./_components/case-studies.module.css";

const page = records.find(record => record.route === "/case-studies")!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: page.route },
};

export default async function CaseStudiesPage() {
  await connection();

  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{page.label}</span>
          </nav>
          <p className="eyebrow">Our Work</p>
          <h1>{page.title}</h1>
          <p>{page.heroDescription}</p>
          <div className="button-row">
            <Button href="/assessment">Request an assessment</Button>
            <Button href="#case-studies" secondary>Explore the cases</Button>
          </div>
        </div>
      </section>
      <section className={`section ${styles.collection}`} id="case-studies" tabIndex={-1} aria-labelledby="case-studies-heading">
        <div className="container">
          <SectionHead
            eyebrow="Case Studies"
            title={<span id="case-studies-heading">Work shaped by the problem.</span>}
            body="Explore focused examples across revenue, systems, operations, infrastructure, data, patient engagement, and technology leadership."
          />
          <CaseCollection cards={caseStudies.map(study => ({
            slug: study.slug,
            categories: study.categories,
            content: <CaseCard study={study} />,
          }))} />
        </div>
      </section>
      <AssessmentCTA />
    </main>
  );
}
