'use client';
import Link from 'next/link';
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main" className="status-page"><div className="container"><p className="eyebrow">Something went wrong</p><h1>Let’s try that again.</h1><p>This page could not load. You can retry or contact Utopia.</p><button className="button" onClick={reset}>Try again</button> <Link href="/contact">Contact Utopia</Link></div></main>}
