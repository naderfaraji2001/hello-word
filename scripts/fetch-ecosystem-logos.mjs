import {mkdir, writeFile} from 'node:fs/promises';
import {extname} from 'node:path';

const vendors = [
  ['epic', 'Epic', 'https://epic.com'],
  ['athenahealth', 'athenahealth', 'https://athenahealth.com'],
  ['eclinicalworks', 'eClinicalWorks', 'https://eclinicalworks.com'],
  ['meditech', 'MEDITECH', 'https://meditech.com'],
  ['nextgen', 'NextGen Healthcare', 'https://nextgen.com'],
  ['greenway', 'Greenway Health', 'https://greenwayhealth.com'],
  ['practice-fusion', 'Practice Fusion', 'https://practicefusion.com'],
  ['drchrono', 'DrChrono', 'https://drchrono.com'],
  ['office-ally', 'Office Ally', 'https://officeally.com'],
  ['pointclickcare', 'PointClickCare', 'https://pointclickcare.com'],
  ['kipu', 'KIPU', 'https://kipuhealth.com'],
  ['alleva', 'Alleva', 'https://helloalleva.com'],
  ['sunwave', 'Sunwave Health', 'https://sunwavehealth.com'],
  ['lightning-step', 'Lightning Step', 'https://lightningstep.com'],
  ['ehr-your-way', 'EHR YOUR WAY', 'https://ehryourway.com'],
  ['benji', 'Benji', 'https://benji.health'],
  ['althea', 'Althea Smart EHR', 'https://mdsynergy.com'],
  ['tebra', 'Tebra', 'https://tebra.com'],
  ['advancedmd', 'AdvancedMD', 'https://advancedmd.com'],
  ['collaboratemd', 'CollaborateMD', 'https://collaboratemd.com'],
  ['pgm-billing', 'PGM Billing', 'https://pgmbilling.com'],
  ['ads', 'ADS', 'https://adsc.com'],
  ['ritten', 'Ritten', 'https://ritten.io'],
  ['navix', 'Navix Health', 'https://navixhealth.com'],
];

const headers = {'user-agent': 'Mozilla/5.0 (compatible; UtopiaTechAssetReview/1.0)'};
const timeout = 20000;
const sourceOverrides = {
  'office-ally': 'https://officeally.com/favicon.ico',
  pointclickcare: 'https://pointclickcare.com/favicon.ico',
  'ehr-your-way': 'https://ehryourway.com/favicon.ico',
  althea: 'https://www.mdsynergy.com/wp-content/uploads/2026/04/cropped-Favicon-Square-2.png',
};

function urlsFromHtml(html, base) {
  const found = [];
  for (const tag of html.match(/<(?:img|link|meta)\b[^>]*>/gi) ?? []) {
    if (!/(logo|icon|brand)/i.test(tag)) continue;
    const match = tag.match(/(?:src|href|content)=["']([^"']+)["']/i);
    if (!match || match[1].startsWith('data:')) continue;
    try {
      const url = new URL(match[1], base).href;
      let score = 0;
      if (/logo/i.test(tag)) score += 100;
      if (/header|navbar|site-logo|custom-logo/i.test(tag)) score += 45;
      if (/\.svg(?:\?|$)/i.test(url)) score += 35;
      if (/\.png|\.webp/i.test(url)) score += 20;
      if (/apple-touch-icon/i.test(tag)) score += 15;
      if (/favicon|rel=["'][^"']*icon/i.test(tag)) score += 10;
      found.push({url, score});
    } catch {}
  }
  return [...new Map(found.sort((a, b) => b.score - a.score).map(item => [item.url, item])).values()];
}

function extension(type, url) {
  if (type.includes('svg')) return '.svg';
  if (type.includes('png')) return '.png';
  if (type.includes('webp')) return '.webp';
  if (type.includes('jpeg')) return '.jpg';
  if (type.includes('icon')) return '.ico';
  const ext = extname(new URL(url).pathname).toLowerCase();
  return ['.svg', '.png', '.webp', '.jpg', '.jpeg', '.ico'].includes(ext) ? ext : '.png';
}

async function request(url) {
  return fetch(url, {headers, redirect: 'follow', signal: AbortSignal.timeout(timeout)});
}

await mkdir('public/media/vendors', {recursive: true});
const manifest = {};

for (const [slug, name, site] of vendors) {
  try {
    const page = await request(site);
    const html = await page.text();
    const candidates = urlsFromHtml(html, page.url);
    if (sourceOverrides[slug]) candidates.unshift({url: sourceOverrides[slug], score: 1000});
    candidates.push({url: new URL('/favicon.ico', page.url).href, score: 0});
    let saved = false;
    for (const candidate of candidates) {
      try {
        const response = await request(candidate.url);
        const type = response.headers.get('content-type')?.toLowerCase() ?? '';
        if (!response.ok || (!type.startsWith('image/') && !/\.svg(?:\?|$)/i.test(candidate.url))) continue;
        const body = Buffer.from(await response.arrayBuffer());
        if (body.length < 100 || body.length > 2_500_000) continue;
        const ext = extension(type, candidate.url);
        const path = `public/media/vendors/${slug}${ext}`;
        await writeFile(path, body);
        manifest[slug] = {name, site, source: candidate.url, asset: `/media/vendors/${slug}${ext}`};
        console.log(`saved ${name}: ${candidate.url}`);
        saved = true;
        break;
      } catch {}
    }
    if (!saved) console.warn(`no logo found for ${name}`);
  } catch (error) {
    console.warn(`site unavailable for ${name}: ${error.message}`);
  }
}

await writeFile('docs/vendor-logo-sources.json', `${JSON.stringify(manifest, null, 2)}\n`);
