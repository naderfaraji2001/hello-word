import {QuestionsSection} from '@/components/page-sections';
import {SolutionsOverview} from '@/components/solutions-overview';
import {AboutPage} from '@/components/about-page';
import {CaseDetail} from '@/app/case-studies/_components/case-detail';
import {caseHref,caseStudies} from '@/app/case-studies/case-studies';
import {notFound} from 'next/navigation';import type {Metadata} from 'next';import Link from 'next/link';import Markdown from 'react-markdown';import remarkGfm from 'remark-gfm';import {records,repository} from '@/lib/content/repository';import {services,cases} from '@/content/site';import {Button,AssessmentCTA} from '@/components/ui';import {Workflow,Process} from '@/components/interactions';import {ProductShowcase,ProductBoards,AgentBoards} from '@/components/products';import {IntegrationFeature} from '@/components/services';import {ArrowUpRight} from '@phosphor-icons/react/dist/ssr/ArrowUpRight';import {ArrowsLeftRight} from '@phosphor-icons/react/dist/ssr/ArrowsLeftRight';import {WaveSine} from '@phosphor-icons/react/dist/ssr/WaveSine';import {CirclesThree} from '@phosphor-icons/react/dist/ssr/CirclesThree';
function getNewCase(slug: string[]) {
  return slug.length === 2 && slug[0] === 'case-studies'
    ? caseStudies.find(study => study.slug === slug[1])
    : undefined;
}

export function generateStaticParams() {
  const pages = records
    .filter(record => !['/', '/assessment', '/assessment/thank-you', '/case-studies', '/contact', 'not-found'].includes(record.route))
    .map(record => ({ slug: record.route.slice(1).split('/') }));
  return [...pages, ...caseStudies.map(study => ({ slug: ['case-studies', study.slug] }))];
}

export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}):Promise<Metadata> {
  const {slug} = await params;
  const study = getNewCase(slug);
  if (study) {
    return {
      title: `${study.title} | Utopia Tech`,
      description: study.challenge,
      alternates: {canonical: caseHref(study)},
    };
  }

  const record = records.find(r => r.route === '/' + slug.join('/'));
  return record ? {title:record.seoTitle,description:record.description,alternates:{canonical:record.route}} : {};
}

export default async function Page({params}:{params:Promise<{slug:string[]}>}){
const {slug}=await params;
const study=getNewCase(slug);
if(study)return <CaseDetail study={study} studies={caseStudies}/>;
const route='/'+slug.join('/');const page=records.find(r=>r.route===route);if(!page)notFound();if(route==='/about')return <AboutPage/>;const isCase=route.startsWith('/case-studies/'),isResource=route.startsWith('/resources/');const c=cases.find(c=>route.endsWith('/'+c.slug));let title=page.title;let intro='heroDescription' in page?page.heroDescription:page.description;
if(route==='/resources'){title='Ask better questions about the technology you already use.';intro='Practical guidance drawn from laboratory and behavioral health workflows. Start with the handoffs, recurring costs and administrative work that deserve a closer look.';}
return <main id="main"><section className={`page-hero ${isCase?'dark':''} ${route==='/solutions'?'solutions-hero':''}`}><div className="container"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span>{slug.length>1&&<><Link href={'/'+slug[0]}>{records.find(r=>r.route==='/'+slug[0])?.label}</Link><span>/</span></>}<span aria-current="page">{page.label}</span></nav><p className="eyebrow">{isCase?'Case study':isResource?'Utopia insights':page.label}</p><h1>{title}</h1><p>{intro}</p><div className="button-row"><Button href={route.startsWith('/products')?'/contact?intent=products':'/assessment'}>{route.startsWith('/products')?'Discuss the products':'Request an assessment'}</Button><Button href={isCase?'/case-studies':'/case-studies'} secondary>{isCase?'All case studies':'Explore our work'}</Button></div></div></section>
{route==='/solutions'&&<SolutionsOverview/>}
{route==='/resources'&&<section className="section"><div className="container article-grid insights-list">{repository.getResources().map((a,i)=><Link href={a.route} className="article-card" key={a.slug}><div className={'article-art art-'+i}><span>{i===0?<ArrowsLeftRight aria-hidden="true"/>:i===1?<WaveSine aria-hidden="true"/>:<CirclesThree aria-hidden="true"/>}</span></div><p className="eyebrow">{a.label} · {Math.ceil(a.body.split(/\s+/).length/200)} min read</p><h2>{a.title}</h2><p>{a.excerpt}</p></Link>)}</div></section>}{route==='/resources'&&<QuestionsSection/>}
{route==='/industries'&&<section className="section"><div className="container interior-grid">{repository.getIndustries().map(p=><Link href={p.route} key={p.slug} className="interior-card"><p className="eyebrow">{p.label}</p><h2>{p.title} <ArrowUpRight size={22} aria-hidden="true"/></h2><p>{p.description}</p></Link>)}</div></section>}
{c&&<section className="section dark"><div className="container"><p className="eyebrow">{c.client}</p><Workflow labels={c.nodes}/><div className="interior-grid" style={{marginTop:40}}><div><p className="eyebrow">Before</p><h3>{c.before}</h3></div><div><p className="eyebrow">After</p><h3>{c.after}</h3></div></div></div></section>}
{page.body&&<section className="section"><div className="container"><article className="prose"><Markdown remarkPlugins={[remarkGfm]}>{page.body}</Markdown></article></div></section>}
{route==='/how-we-work'&&<section className="section"><div className="container"><Process/></div></section>}
{route==='/products'&&<ProductShowcase/>}
{route==='/products/behavioral-health-application'&&<ProductBoards/>}{route==='/products/ai-agent'&&<AgentBoards/>}
{route==='/solutions/integrations'&&<IntegrationFeature detail/>}
{route.startsWith('/solutions/')&&<section className="section"><div className="container"><h2>What the work can include.</h2><ul className="service-inclusions">{services.find(s=>route==='/solutions/'+s.slug)?.items.map(t=><li key={t}>{t}</li>)}</ul></div></section>}
{(route.startsWith('/solutions/')||route.startsWith('/industries/'))&&<section className="section dark"><div className="container"><h2>Connected in practice.</h2><div className="interior-grid">{cases.map(c=><Link className="interior-card" href={'/case-studies/'+c.slug} key={c.slug}><p className="eyebrow">{c.caption}</p><h3>{c.label} <ArrowUpRight size={20} aria-hidden="true"/></h3><p>{c.client}</p></Link>)}</div></div></section>}
{isCase&&<section className="section"><div className="container"><p className="eyebrow">Related solutions</p><div className="interior-grid">{services.filter(s=>c?.tags.includes('Infrastructure & security')?['integrations','managed-it'].includes(s.slug):s.slug==='integrations').map(s=><Link key={s.slug} className="interior-card" href={'/solutions/'+s.slug}><h3>{s.name} <ArrowUpRight size={20} aria-hidden="true"/></h3><p>{s.description}</p></Link>)}</div></div></section>}
{route.startsWith('/products')?<section className="section lime"><div className="container"><h2>Discuss the product direction.</h2><p>Tell us about your care or laboratory workflow, without including patient information.</p><Button href="/contact?intent=products">Discuss the products</Button></div></section>:!['/privacy','/terms','/accessibility'].includes(route)&&<AssessmentCTA/>}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':isResource?'Article':route.startsWith('/solutions/')?'Service':'WebPage',name:title,description:page.description,...(isResource?{author:{'@type':'Organization',name:'Utopia Tech Solutions'}}:{})}).replace(/</g,'\\u003c')}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000')+'/'},...slug.map((s,i)=>({'@type':'ListItem',position:i+2,name:records.find(r=>r.route==='/'+slug.slice(0,i+1).join('/'))?.label||s,item:(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000')+'/'+slug.slice(0,i+1).join('/')}))]}).replace(/</g,'\\u003c')}}/></main>}
