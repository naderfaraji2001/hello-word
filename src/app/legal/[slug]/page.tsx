import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {LegalPage} from '@/components/legal-page';
import {legalDocuments, type LegalSlug} from '@/content/legal';

type Props = {params:Promise<{slug:string}>};
const descriptions:Record<LegalSlug,string> = {
  'privacy-policy':'How Utopia Tech Solutions handles website inquiries, assessment requests, technical data, and privacy choices.',
  'cookie-policy':'The first-party cookies and browser storage used by the Utopia Tech Solutions website and how to control them.',
  'terms-conditions':'Terms governing access to and use of the public Utopia Tech Solutions website.',
};
export function generateStaticParams() { return Object.keys(legalDocuments).map(slug => ({slug})); }
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {slug} = await params;
  if (!(slug in legalDocuments)) return {};
  const key = slug as LegalSlug, document = legalDocuments[key], path = `/legal/${key}`;
  return {title:`${document.title} — Utopia Tech`, description:descriptions[key], alternates:{canonical:path}, openGraph:{title:`${document.title} — Utopia Tech`, description:descriptions[key], url:path, type:'website'}, twitter:{card:'summary', title:`${document.title} — Utopia Tech`, description:descriptions[key]}};
}
export default async function LegalRoute({params}:Props) {
  const {slug} = await params;
  if (!(slug in legalDocuments)) notFound();
  return <LegalPage document={legalDocuments[slug as LegalSlug]}/>;
}
