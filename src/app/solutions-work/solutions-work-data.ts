import { caseFilters } from "@/app/case-studies/_components/case-types";
import { caseHref, caseStudies, featuredOutcomes } from "@/app/case-studies/case-studies";
import { solutionEntries } from "@/content/solution-entries";
import { repository } from "@/lib/content/repository";

type EvidenceStatus = "Case study available" | "Related work" | "Product in development" | "Solution area";

type SolutionConnection = {
  caseSlug: string;
  detailSlug?: string;
  product?: { href: string; label: string };
  status?: EvidenceStatus;
  feature?: {
    pain?: string;
    description: string;
    outcomeEdits?: Readonly<Record<string, string | readonly string[]>>;
  };
};

const behavioralHealthApp = {
  href: "/products/behavioral-health-application",
  label: "Explore the behavioral health application",
};

const connections: Readonly<Record<number, SolutionConnection>> = {
  1: {
    caseSlug: "saving-40-plus-staff-hours-a-week-by-connecting-lab-and-billing-systems",
    feature: {
      pain: "“Our team spends too much time moving billing information between disconnected systems.”",
      description: "Connect laboratory and billing workflows, reduce manual reconciliation, and make the information needed for billing available at the right point in the process.",
      outcomeEdits: { "40+ staff hours saved every week (2,000+ hours a year)": "40+ staff hours saved every week" },
    },
  },
  2: {
    caseSlug: "building-20-lab-interfaces-in-two-months",
    feature: {
      description: "Connect LIS, EMR, billing, CRM and other business applications through a reusable integration foundation.",
      outcomeEdits: { "$40,000 saved in development fees ($2,000 per interface)": "$40,000 saved in development fees" },
    },
  },
  3: {
    caseSlug: "removing-bottlenecks-from-daily-operations",
    feature: {
      pain: "“Our daily work depends on spreadsheets, manual handoffs and what a few people know.”",
      description: "Document responsibilities, remove unnecessary steps, define escalation paths and automate repetitive work where it is useful.",
      outcomeEdits: {
        "Documented, validated procedures in place across 3 departments": "Validated procedures across three departments",
        "Every employee has clear troubleshooting steps, owners and escalation contacts": "Clear troubleshooting steps, owners and escalation contacts",
        "Operations keep running when a key person is unavailable": "Operations continue when a key person is unavailable",
      },
    },
  },
  4: {
    caseSlug: "cutting-microsoft-365-licensing-costs-by-47-percent",
    feature: {
      pain: "“Our technology costs keep increasing, and we don’t understand what we’re paying for.”",
      description: "Review licensing, subscriptions, support arrangements, contracts and overlapping tools to identify avoidable costs and unclear responsibilities.",
      outcomeEdits: {
        "Annual licensing cut from $75,000 to $40,000 (47%)": [
          "Annual licensing reduced from $75,000 to $40,000",
          "47% reduction in licensing cost",
        ],
      },
    },
  },
  5: {
    caseSlug: "making-patient-results-reliably-accessible",
    feature: {
      pain: "“Our existing infrastructure can’t reliably support the business.”",
      description: "Assess and improve servers, networks, cloud resources and aging equipment around the organization’s reliability and capacity requirements.",
      outcomeEdits: { "Portal five times more responsive": "Portal became five times more responsive" },
    },
  },
  6: {
    caseSlug: "bringing-reliable-wi-fi-across-the-facility",
    detailSlug: "managed-it",
  },
  7: {
    caseSlug: "protecting-patient-records-and-passing-inspection",
    detailSlug: "managed-it",
  },
  8: {
    caseSlug: "strengthening-security-and-inspection-readiness",
    detailSlug: "managed-it",
  },
  9: {
    caseSlug: "turning-disconnected-data-into-daily-business-insight",
    feature: {
      description: "Connect information through a shared data environment, dashboards, automated reporting and clearly defined business metrics.",
      outcomeEdits: { "Delivered in under 10 days": "Delivered in under ten days" },
    },
  },
  10: {
    caseSlug: "putting-ai-to-work-in-everyday-operations",
    detailSlug: "ai-automation",
    status: "Related work",
    product: { href: "/products/ai-agent", label: "Explore the AI agent in development" },
  },
  11: {
    caseSlug: "keeping-patients-connected-after-treatment",
    detailSlug: "engagement-workflows",
    status: "Product in development",
    product: behavioralHealthApp,
  },
  12: {
    caseSlug: "giving-therapists-more-time-for-patient-care",
    status: "Product in development",
    product: behavioralHealthApp,
  },
  13: { caseSlug: "creating-a-clear-technology-roadmap" },
  14: { caseSlug: "returning-technology-control-to-the-business" },
};

const studiesBySlug = new Map(caseStudies.map(study => [study.slug, study]));

const connectedSolutions = solutionEntries.map(entry => {
  const connection = connections[entry.id];
  const study = studiesBySlug.get(connection.caseSlug);
  if (!study) throw new Error(`Missing case study for solution ${entry.id}: ${connection.caseSlug}`);

  const hasResults = study.outcomeType === "results";
  const status = connection.status ?? (hasResults ? "Case study available" : "Related work");
  const detail = connection.detailSlug ? repository.getSolution(connection.detailSlug) : undefined;

  return { ...entry, ...connection, study, hasResults, status, detail };
});

export const featuredWork = connectedSolutions.flatMap(({ feature, study, hasResults, ...entry }) => {
  if (!feature) return [];

  return [{
    id: entry.id,
    title: entry.solutionTitle,
    pain: feature.pain ?? entry.pain,
    description: feature.description,
    study,
    outcomeLabel: hasResults ? "Verified results" : "Intended benefits",
    outcomes: featuredOutcomes(study)
      .flatMap(outcome => hasResults ? feature.outcomeEdits?.[outcome] ?? outcome : outcome)
      .slice(0, 3),
  }];
});

export const moreSolutions = connectedSolutions.filter(entry => !entry.feature);

const archiveHighlightIndex: Readonly<Partial<Record<number, number>>> = {
  1: 1,
  4: 1,
  5: 1,
  7: 3,
  8: 2,
  9: 3,
  15: 2,
  16: 1,
  17: 1,
};

const archiveStatuses = new Map(
  moreSolutions.map(({ caseSlug, status }) => [caseSlug, status] as const),
);

export const archiveEntries = caseStudies.map(study => {
  const archiveStatus = archiveStatuses.get(study.slug);
  const highlightIndex = archiveHighlightIndex[study.number] ?? 0;

  return {
    number: study.number,
    href: caseHref(study),
    title: study.title,
    categories: study.categories,
    category: caseFilters.find(filter => filter.id === study.categories[0])!.label,
    evidence: study.outcomeType === "results"
      ? study.outcomes[highlightIndex]
      : archiveStatus === "Product in development" ? archiveStatus : "Intended benefits",
  };
});
