export const caseFilters = [
  { id: "all", label: "All work" },
  { id: "revenue-billing", label: "Revenue & Billing" },
  { id: "systems-integration", label: "Systems & Integration" },
  { id: "operations-automation", label: "Operations & Automation" },
  { id: "infrastructure-security", label: "Infrastructure & Security" },
  { id: "data-ai", label: "Data & AI" },
  { id: "patient-engagement", label: "Patient Engagement" },
  { id: "strategy-ownership", label: "Strategy & Ownership" },
] as const;

export type CaseStudyFilter = (typeof caseFilters)[number]["id"];
export type CaseStudyCategory = Exclude<CaseStudyFilter, "all">;

export type CaseStudyVisualType =
  | "revenue-flow"
  | "integration-flow"
  | "workflow-map"
  | "cost-reduction"
  | "infrastructure"
  | "security-recovery"
  | "data-reporting"
  | "ai-assistant"
  | "patient-journey"
  | "technology-roadmap";

export type CaseStudy = {
  number: number;
  slug: string;
  title: string;
  solution: string;
  categories: readonly CaseStudyCategory[];
  introduction?: string;
  challenge: string;
  solutionText: string;
  outcomeType: "results" | "intended-benefits";
  outcomes: readonly string[];
  featuredOutcomeIndices?: readonly number[];
  visualType: CaseStudyVisualType;
};
