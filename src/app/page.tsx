import {ProposedWork} from '@/components/proposed-work';
import {ConnectedOperationExpanded} from '@/components/connected-operation-expanded';
import {HeroFocusStrip} from '@/components/hero-focus-strip';
import {RevealEnhancement} from '@/components/motion';import {Button,SectionHead} from '@/components/ui';import {Process,Fragmentation} from '@/components/interactions';
export default function Home(){return <main id="main"><RevealEnhancement/><section className="hero hero-business"><div className="hero-main"><h1>Solutions built around<br/>your business</h1><p>We assess four critical areas of your business to uncover gaps, reduce costs, and turn technology and AI into measurable results.</p><HeroFocusStrip/><div className="button-row"><Button href="/assessment" secondary>Request an assessment</Button><Button href="#home-content" secondary icon="down">Explore the website</Button></div></div></section>
<section className="section process-section" id="home-content"><div className="container"><Process/></div></section>
<ConnectedOperationExpanded/>
<section className="section why"><div className="container"><SectionHead eyebrow="Why Utopia" title={<>Follow the workflow.<br/><mark>Find the real problem.</mark></>} body="A billing issue can start at admission. A slow report can begin with a disconnected system. We look across the operation before deciding what to change." href="/how-we-work" action="How we work"/><p className="supporting">Our work brings together healthcare experience and technical execution. We can examine the handoff, identify the right response and help put it into practice.</p><Fragmentation/></div></section>



<ProposedWork/>
</main>}
