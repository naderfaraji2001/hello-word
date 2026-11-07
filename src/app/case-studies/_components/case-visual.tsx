import type { ReactNode } from "react";
import type { CaseStudyVisualType } from "./case-types";
import styles from "./case-studies.module.css";

const diagrams: Record<CaseStudyVisualType, ReactNode> = {
  "revenue-flow": <>
    <rect x="30" y="28" width="63" height="80" rx="8" />
    <path d="M46 48h31M46 60h22M46 72h16" />
    <path className={styles.signal} d="M75 92h35l27-24h49m-11-11 11 11-11 11" />
    <circle cx="198" cy="68" r="25" />
    <path className={styles.signal} d="m191 68 5 5 9-10" />
  </>,
  "integration-flow": <>
    <path d="M60 38h39l20 29m-59 28h39l20-28m26 0h37" />
    <rect x="32" y="25" width="28" height="26" rx="5" />
    <rect x="32" y="82" width="28" height="26" rx="5" />
    <rect x="182" y="49" width="36" height="36" rx="7" />
    <path className={styles.signal} d="m126 54 13 13-13 13-13-13Z" />
    <path d="M193 67h14m-7-7v14" />
  </>,
  "workflow-map": <>
    <path d="M37 41h41l27 26h40l27-26h36M105 67l-27 26H37m108-26 27 26h36" />
    <circle cx="37" cy="41" r="7" /><circle cx="37" cy="93" r="7" />
    <circle cx="208" cy="41" r="7" /><circle cx="208" cy="93" r="7" />
    <rect className={styles.signal} x="113" y="55" width="24" height="24" rx="5" />
  </>,
  "cost-reduction": <>
    <path d="M44 106h161M60 46h31v60H60zm50 19h31v41h-31zm50 19h31v22h-31z" />
    <path className={styles.signal} d="m76 29 100 39m-8-16 8 16-18 2" />
  </>,
  infrastructure: <>
    <rect x="62" y="31" width="125" height="26" rx="6" />
    <rect x="62" y="77" width="125" height="26" rx="6" />
    <path d="M81 44h42m-42 46h42m27-46h7m-7 46h7M100 57v20m49-20v20" />
    <circle className={styles.signal} cx="171" cy="44" r="2" />
    <circle className={styles.signal} cx="171" cy="90" r="2" />
    <path d="M42 67h20m125 0h20" />
  </>,
  "security-recovery": <>
    <path d="M125 23c13 9 25 12 36 14v25c0 25-16 39-36 49-20-10-36-24-36-49V37c11-2 23-5 36-14Z" />
    <path d="M68 41a61 61 0 0 0 1 51m-11-7 11 7 5-13m108 13a61 61 0 0 0-1-51m11 7-11-7-5 13" />
    <path className={styles.signal} d="m111 66 10 10 18-20" />
  </>,
  "data-reporting": <>
    <rect x="38" y="24" width="174" height="86" rx="8" />
    <path d="M38 42h174m-104 0v68M53 58h38m-38 15h30m-30 15h21m52 7h67" />
    <path className={styles.signal} d="m128 82 18-15 17 7 26-19" />
    <circle cx="189" cy="55" r="3" />
  </>,
  "ai-assistant": <>
    <path d="M59 28h113a9 9 0 0 1 9 9v47a9 9 0 0 1-9 9h-54l-23 14V93H59a9 9 0 0 1-9-9V37a9 9 0 0 1 9-9Z" />
    <path d="M68 53h58m-58 15h40" />
    <path className={styles.signal} d="m161 48 5 12 12 5-12 5-5 12-5-12-12-5 12-5 5-12Z" />
    <path d="M197 39v14m-7-7h14" />
  </>,
  "patient-journey": <>
    <rect x="104" y="19" width="48" height="96" rx="9" />
    <path d="M121 30h14m-11 74h8m-24-37H63m89 0h35" />
    <circle cx="50" cy="67" r="13" /><circle cx="200" cy="67" r="13" />
    <path className={styles.signal} d="M114 66h7l4-9 6 17 4-8h7" />
  </>,
  "technology-roadmap": <>
    <path d="M34 93h47l30-26h37l30-26h39m-12-10 12 10-12 10" />
    <path d="M81 93V55m67 12v32" strokeDasharray="3 5" />
    <circle cx="34" cy="93" r="6" /><circle cx="81" cy="93" r="6" />
    <circle className={styles.signal} cx="148" cy="67" r="6" />
    <circle cx="178" cy="41" r="6" />
  </>,
};

export function CaseVisual({ type }: { type: CaseStudyVisualType }) {
  return (
    <div className={styles.visual} aria-hidden="true">
      <svg viewBox="0 0 250 134" fill="none" focusable="false">
        {diagrams[type]}
      </svg>
    </div>
  );
}
