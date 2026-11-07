import {HomePeoplePhotos} from '@/components/home-people-photos';
import {ProposedWork} from '@/components/proposed-work';
import {ConnectedOperationExpanded} from '@/components/connected-operation-expanded';
import {HeroFocusStrip} from '@/components/hero-focus-strip';
import Image from 'next/image';import {RevealEnhancement} from '@/components/motion';import {Button,SectionHead} from '@/components/ui';import {Process,Fragmentation} from '@/components/interactions';
export default function Home(){return <main id="main"><RevealEnhancement/><section className="hero hero-business"><div className="hero-main"><h1>Solutions built around<br/>your business</h1><p>We assess four critical areas of your business—Revenue Cycle &amp; Billing, Technology &amp; Vendor Optimization, Operations &amp; Workflow, and Data &amp; AI Enablement—to identify gaps, reduce unnecessary costs, and build a practical roadmap for growth. Our goal is to help you use technology and AI in ways that improve everyday work and deliver measurable business results.</p><HeroFocusStrip/><div className="button-row"><Button href="/assessment">Request an assessment</Button><Button href="/case-studies" secondary>Explore our work</Button></div></div></section>
<section className="section process-section"><div className="container"><Process/></div></section>
<ConnectedOperationExpanded/>
<section className="section why"><div className="container"><SectionHead eyebrow="Why Utopia" title={<>Follow the workflow.<br/><mark>Find the real problem.</mark></>} body="A billing issue can start at admission. A slow report can begin with a disconnected system. We look across the operation before deciding what to change." href="/how-we-work" action="How we work"/><p className="supporting">Our work brings together healthcare experience and technical execution. We can examine the handoff, identify the right response and help put it into practice.</p><Fragmentation/></div></section>



<ProposedWork/>



<section className="section home-people">
  <div className="container home-people-layout">
    <HomePeoplePhotos>
      <Image className="home-people-conversation" src="/media/founder-home-conversation.webp" alt="Nader Faraji speaking with attendees at a healthcare technology event" width={580} height={773} sizes="(max-width: 700px) 49vw, 285px"/>
      <Image className="home-people-portrait" src="/media/founder-home-portrait.webp" alt="Nader Faraji at a healthcare technology event" width={900} height={675} sizes="(max-width: 700px) 48vw, 265px"/>
    </HomePeoplePhotos>
    <div className="home-people-copy">
      <p className="eyebrow">The people behind the work</p>
      <h2>Healthcare experience.<br/><mark>Technical depth.</mark></h2>
      <p>Led by Nader Faraji, our team brings healthcare operations experience and enterprise technology expertise together.</p>
      <Button href="/about" secondary>Meet Utopia</Button>
    </div>
  </div>
</section>




</main>}
