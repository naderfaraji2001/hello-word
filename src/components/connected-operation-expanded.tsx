import Link from 'next/link';
import {ArrowUpRight} from '@phosphor-icons/react/dist/ssr/ArrowUpRight';

const sectors = [
  {
    title: 'Medical laboratories',
    description: 'From order and specimen to result, billing and payment.',
    href: '/solutions/integrations',
  },
  {
    title: 'Behavioral health',
    description: 'From admission and treatment to discharge and continued support.',
    href: '/solutions/engagement-workflows',
  },
  {
    title: 'Manufacturing',
    description: 'Connect business systems, operations and reporting across the production environment.',
    href: '/solutions/integrations',
  },
] as const;

const clients = [
  ['/media/clients/sbh.png', 'SBH Laboratories', 'https://sbhlaboratories.com'],
  ['/media/clients/healthquest.png', 'HealthQuest Esoterics', 'https://hqesoterics.com'],
  ['/media/clients/atlas.png', 'Atlas Healthcare Group', 'https://atlashealthcaregroup.com'],
  ['/media/clients/detoxla.png', 'Detox LA', 'https://detoxla.com'],
  ['/media/clients/satori-detox.png', 'Satori Detox', 'https://satoridetox.com'],
  ['/media/clients/satori-bh.png', 'Satori Behavioral Health', 'https://satoribh.com'],
  ['/media/clients/silicon-beach.png', 'Silicon Beach Treatment Center', 'https://siliconbeachtx.com'],
  ['/media/clients/nice.svg', 'Nice North America', 'https://www.niceforyou.com/na'],
] as const;

const vendors = [
  ['Epic', 'https://epic.com', '/media/vendors/epic.png'],
  ['athenahealth', 'https://athenahealth.com', '/media/vendors/athenahealth.svg'],
  ['eClinicalWorks', 'https://eclinicalworks.com', '/media/vendors/eclinicalworks.png'],
  ['MEDITECH', 'https://meditech.com', '/media/vendors/meditech.svg'],
  ['NextGen Healthcare', 'https://nextgen.com', '/media/vendors/nextgen.svg'],
  ['Greenway Health', 'https://greenwayhealth.com', '/media/vendors/greenway.svg'],
  ['Practice Fusion', 'https://practicefusion.com', '/media/vendors/practice-fusion.svg'],
  ['DrChrono', 'https://drchrono.com', '/media/vendors/drchrono.png'],
  ['Office Ally', 'https://officeally.com', '/media/vendors/office-ally.ico'],
  ['PointClickCare', 'https://pointclickcare.com', '/media/vendors/pointclickcare.ico'],
  ['KIPU', 'https://kipuhealth.com', '/media/vendors/kipu.webp'],
  ['Alleva', 'https://helloalleva.com', '/media/vendors/alleva.webp'],
  ['Sunwave Health', 'https://sunwavehealth.com', '/media/vendors/sunwave.svg'],
  ['Lightning Step', 'https://lightningstep.com', '/media/vendors/lightning-step.svg'],
  ['EHR YOUR WAY', 'https://ehryourway.com', '/media/vendors/ehr-your-way.png'],
  ['Benji', 'https://benji.health', '/media/vendors/benji.png'],
  ['Althea Smart EHR', 'https://mdsynergy.com', '/media/vendors/althea.png'],
  ['Tebra', 'https://tebra.com', '/media/vendors/tebra.svg'],
  ['AdvancedMD', 'https://advancedmd.com', '/media/vendors/advancedmd.svg'],
  ['CollaborateMD', 'https://collaboratemd.com', '/media/vendors/collaboratemd.svg'],
  ['PGM Billing', 'https://pgmbilling.com', '/media/vendors/pgm-billing.png'],
  ['ADS', 'https://adsc.com', '/media/vendors/ads.png'],
  ['Ritten', 'https://ritten.io', '/media/vendors/ritten.svg'],
  ['Navix Health', 'https://navixhealth.com', '/media/vendors/navix.svg'],
] as const;

const radarItems = ['EMR / EHR', 'LIS', 'Instruments', 'Billing', 'Data / BI', 'Infrastructure', 'Security', 'Operations'];

function ClientTrack({duplicate = false}: {duplicate?: boolean}) {
  return <div className="connected-client-group">
    {clients.map(([logo, name, url]) => <a className="connected-client" href={url} key={name} aria-hidden={duplicate || undefined} tabIndex={duplicate ? -1 : undefined}>
      <img src={logo} alt={duplicate ? '' : `${name} logo`} width={150} height={60}/>
    </a>)}
  </div>;
}

function VendorTrack({duplicate = false}: {duplicate?: boolean}) {
  return <div className="connected-vendor-group">
    {vendors.map(([name, url, logo]) => <a className="connected-vendor" href={url} key={name} aria-hidden={duplicate || undefined} tabIndex={duplicate ? -1 : undefined}>
      <img src={logo} alt={duplicate ? '' : `${name} logo`} width={125} height={44}/>
    </a>)}
  </div>;
}

export function ConnectedOperationExpanded() {
  return <section className="section connected-operation-expanded" aria-labelledby="connected-operation-expanded-title">
    <div className="container">
      <div className="connected-operation-grid">
        <div className="connected-operation-copy">
          <p className="eyebrow">The connected operation</p>
          <h2 id="connected-operation-expanded-title">Different industries.<br/><mark>One connected view.</mark></h2>
          <p>Laboratories, behavioral health organizations and manufacturers follow different workflows. Each depends on systems, people and vendors working together around the business.</p>
          <div className="connected-sector-list">
            {sectors.map(sector => <Link href={sector.href} key={sector.title}>
              <div>
                <h3>{sector.title}</h3>
                <p>{sector.description}</p>
              </div>
              <ArrowUpRight size={24} aria-hidden="true"/>
            </Link>)}
          </div>
        </div>
        <div className="connected-operation-radar">
          <div className="radar" role="img" aria-label="Illustrative connections across operational systems, data, infrastructure and security.">
            <div className="radar-sweep"/>
            <div className="radar-center">The<br/>operation</div>
            {radarItems.map((item, index) => <span className={`radar-label radar-label-${index}`} key={item}>● {item}</span>)}
          </div>
        </div>
      </div>

      <div className="connected-ecosystem">
        <div className="connected-ecosystem-column">
          <div className="connected-ecosystem-heading">
            <p className="eyebrow">Clients</p>
            <h3>Organizations we have worked with</h3>
          </div>
          <div className="connected-marquee connected-client-marquee" aria-label="Clients">
            <div className="connected-marquee-track"><ClientTrack/><ClientTrack duplicate/></div>
          </div>
        </div>
        <div className="connected-ecosystem-column">
          <div className="connected-ecosystem-heading">
            <p className="eyebrow">Technology ecosystem</p>
            <h3>Vendors we have worked with</h3>
          </div>
          <div className="connected-marquee connected-vendor-marquee" aria-label="Technology vendors">
            <div className="connected-marquee-track connected-marquee-track-reverse"><VendorTrack/><VendorTrack duplicate/></div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
