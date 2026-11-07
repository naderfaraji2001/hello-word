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
  ['sbh', 'SBH Laboratories', 'https://sbhlaboratories.com'],
  ['healthquest', 'HealthQuest Esoterics', 'https://hqesoterics.com'],
  ['atlas', 'Atlas Healthcare Group', 'https://atlashealthcaregroup.com'],
  ['detoxla', 'Detox LA', 'https://detoxla.com'],
  ['satori-detox', 'Satori Detox', 'https://satoridetox.com'],
  ['satori-bh', 'Satori Behavioral Health', 'https://satoribh.com'],
  ['silicon-beach', 'Silicon Beach Treatment Center', 'https://siliconbeachtx.com'],
] as const;

const vendors = [
  ['Epic', 'https://epic.com'],
  ['athenahealth', 'https://athenahealth.com'],
  ['eClinicalWorks', 'https://eclinicalworks.com'],
  ['MEDITECH', 'https://meditech.com'],
  ['NextGen Healthcare', 'https://nextgen.com'],
  ['Greenway Health', 'https://greenwayhealth.com'],
  ['Practice Fusion', 'https://practicefusion.com'],
  ['DrChrono', 'https://drchrono.com'],
  ['Office Ally', 'https://officeally.com'],
  ['PointClickCare', 'https://pointclickcare.com'],
  ['KIPU', 'https://kipuhealth.com'],
  ['Alleva', 'https://helloalleva.com'],
  ['Sunwave Health', 'https://sunwavehealth.com'],
  ['Lightning Step', 'https://lightningstep.com'],
  ['EHR YOUR WAY', 'https://ehryourway.com'],
  ['Benji', 'https://benji.health'],
  ['Althea Smart EHR', 'https://mdsynergy.com'],
  ['Tebra', 'https://tebra.com'],
  ['AdvancedMD', 'https://advancedmd.com'],
  ['CollaborateMD', 'https://collaboratemd.com'],
  ['PGM Billing', 'https://pgmbilling.com'],
  ['ADS', 'https://adsc.com'],
  ['Ritten', 'https://ritten.io'],
  ['Navix Health', 'https://navixhealth.com'],
] as const;

const radarItems = ['EMR / EHR', 'LIS', 'Instruments', 'Billing', 'Data / BI', 'Infrastructure', 'Security', 'Operations'];

function ClientTrack() {
  return <div className="connected-client-group">
    {clients.map(([slug, name, url]) => <a className="connected-client" href={url} key={name}>
      <img src={`/media/clients/${slug}.png`} alt={name} width={220} height={90}/>
      <span>{name}</span>
    </a>)}
  </div>;
}

function VendorTrack() {
  return <div className="connected-vendor-group">
    {vendors.map(([name, url]) => <a className="connected-vendor" href={url} key={name}>
      <span aria-hidden="true">●</span>{name}
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
        <div className="connected-ecosystem-heading">
          <div><p className="eyebrow">Clients</p><h3>Organizations we have worked with</h3></div>
          <p>Medical laboratories and behavioral health organizations represented in the current client list.</p>
        </div>
        <div className="connected-marquee connected-client-marquee" aria-label="Clients">
          <div className="connected-marquee-track"><ClientTrack/></div>
        </div>

        <div className="connected-ecosystem-heading connected-vendor-heading">
          <div><p className="eyebrow">Technology ecosystem</p><h3>Vendors we have worked with</h3></div>
          <p>EMR, EHR and billing platforms encountered across client environments and integration work.</p>
        </div>
        <div className="connected-marquee connected-vendor-marquee" aria-label="Technology vendors">
          <div className="connected-marquee-track connected-marquee-track-reverse"><VendorTrack/></div>
        </div>
      </div>
    </div>
  </section>;
}
