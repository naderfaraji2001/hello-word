import Link from 'next/link';
import type {ReactNode} from 'react';

export type LegalSection = {id:string; title:string; content:ReactNode};
export type LegalDocument = {slug:string; title:string; intro:string; updated:string; sections:LegalSection[]};

export function LegalPage({document}:{document:LegalDocument}) {
  return <main id="main" className="legal-page">
    <header className="legal-hero dark"><div className="container">
      <p className="eyebrow">Legal</p><h1>{document.title}</h1><p>{document.intro}</p><p className="legal-updated">Last updated: {document.updated}</p>
    </div></header>
    <div className="container legal-layout">
      <aside className="legal-toc" aria-label={`${document.title} contents`}><p className="eyebrow">On this page</p><ol>{document.sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`}><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</a></li>)}</ol></aside>
      <article className="legal-content">
        {document.sections.map((section, index) => <section id={section.id} tabIndex={-1} key={section.id}><p className="legal-number">{String(index + 1).padStart(2, '0')}</p><h2>{section.title}</h2>{section.content}</section>)}
        <nav className="legal-crosslinks" aria-label="Other legal policies"><p className="eyebrow">Related policies</p><div><Link href="/legal/privacy-policy">Privacy Policy</Link><Link href="/legal/cookie-policy">Cookie Policy</Link><Link href="/legal/terms-conditions">Terms &amp; Conditions</Link></div></nav>
        <section className="legal-contact" aria-labelledby="legal-contact-title"><p className="eyebrow">Questions</p><h2 id="legal-contact-title">Contact Utopia</h2><p>For questions about these policies or how Utopia handles information, contact:</p><address><strong>Utopia Tech Solutions</strong><br/>Irvine, California<br/><a href="mailto:info@utopiats.com">info@utopiats.com</a><br/><a href="tel:+19492298100">+1 (949) 229-8100</a></address></section>
      </article>
    </div>
  </main>;
}
