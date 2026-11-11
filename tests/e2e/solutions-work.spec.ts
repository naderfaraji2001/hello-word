import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { featuredWork, archiveEntries } from '../../src/app/solutions-work/solutions-work-data';
import { caseHref } from '../../src/app/case-studies/case-studies';

const cards = '[data-feature-card]';
const stage = '[data-work-stage]';

async function open(page: Page) {
  await page.goto('/solutions-work');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(cards)).toHaveCount(6);
  await expect(page.locator(`${cards}[data-shaped]`)).toHaveCount(6);
}

async function assertContent(page: Page) {
  for (const [index, entry] of featuredWork.entries()) {
    const card = page.locator(cards).nth(index);
    for (const text of [entry.pain, entry.title, entry.description, entry.outcomeLabel, ...entry.outcomes, entry.study.title]) {
      await expect(card).toContainText(text);
    }
    await expect(card.getByRole('link')).toHaveAttribute('href', caseHref(entry.study));
    await expect(card.getByRole('link')).toHaveText('Read the full case study');
    const outline = await card.locator('[data-card-outline]').first().getAttribute('d');
    if (outline) await expect(card.locator('a svg path')).not.toHaveAttribute('d', outline);
  }
  await expect(page.locator('#work-archive-list > li')).toHaveCount(archiveEntries.length);
}

test('desktop depth stack reverses, finishes, and preserves every story and link', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page);
  await assertContent(page);
  await expect(page.locator('[data-stack="true"]')).toHaveCount(1);
  const sizes = await page.locator('[data-card-surface]').first().evaluate(el => {
    const panels = [...el.children].map(c => c.getBoundingClientRect());
    return panels.map(p => ({ width: p.width, height: p.height }));
  });
  expect(Math.abs(sizes[0].width - sizes[1].width)).toBeLessThan(1);
  expect(sizes[0].height).toBe(sizes[1].height);
  expect(sizes[2].width / sizes[0].width).toBeCloseTo(4 / 3, 1);

  const geometry = await page.locator(stage).evaluate(el => {
    const height = el.getBoundingClientRect().height;
    const top = Math.max(112, (innerHeight - height - 96) / 2);
    return { start: el.getBoundingClientRect().top + scrollY - top, top, distance: 4.75 * innerHeight };
  });
  const duration = 7.1;
  async function at(time: number) {
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), geometry.start + geometry.distance * time / duration);
    await expect.poll(() => page.locator(stage).evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(Math.round(geometry.top));
  }
  await at(0);
  const firstLayer = page.locator(stage).locator(':scope > li').first();
  await expect(firstLayer).toHaveCSS('opacity', '1');
  await at(.85);
  await expect.poll(() => firstLayer.evaluate(el => Number(getComputedStyle(el).opacity))).toBeLessThan(.9);
  expect(await firstLayer.evaluate(el => getComputedStyle(el).filter)).not.toBe('blur(0px)');
  expect(await firstLayer.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m43)).toBeLessThan(0);
  for (let index = 1; index < 6; index++) {
    await at(.35 + (index - 1) * 1.35 + 1.1);
    const layer = page.locator(stage).locator(':scope > li').nth(index);
    await expect(layer).toHaveAttribute('data-active', 'true');
    await expect(layer).toHaveCSS('opacity', '1');
    const link = layer.getByRole('link');
    const box = (await link.boundingBox())!;
    expect(await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('a')?.getAttribute('href'), { x: box.x + 15, y: box.y + box.height / 2 })).toBe(caseHref(featuredWork[index].study));
  }
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), geometry.start + geometry.distance + 250);
  await expect.poll(() => page.locator(stage).evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(geometry.top - 150);
  for (const index of [4, 2, 0]) {
    await at(index === 0 ? 0 : .35 + (index - 1) * 1.35 + 1.1);
    await expect(page.locator(stage).locator(':scope > li').nth(index)).toHaveAttribute('data-active', 'true');
  }
  await expect(firstLayer).toHaveCSS('opacity', '1');
  await expect(firstLayer).toHaveCSS('filter', 'blur(0px)');
  expect(errors).toEqual([]);
});

test('keyboard reaches every case link in both directions without a trap', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page);
  const links = page.locator(`${cards} a`);
  await links.first().focus();
  for (let i = 1; i < 6; i++) {
    await page.keyboard.press('Tab');
    await expect(links.nth(i)).toBeFocused();
    await expect(links.nth(i).locator('xpath=../..')).toHaveAttribute('data-active', 'true');
  }
  for (let i = 4; i >= 0; i--) {
    await page.keyboard.press('Shift+Tab');
    await expect(links.nth(i)).toBeFocused();
  }
});

test('tablet, mobile, short desktop and reduced motion retain natural scrolling', async ({ page }) => {
  for (const [width, height] of [[390, 844], [768, 900], [1024, 900], [1440, 600]]) {
    await page.setViewportSize({ width, height });
    await open(page);
    await assertContent(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width < 1024 || height === 600) await expect(page.locator('.pin-spacer')).toHaveCount(0);
    for (let i = 0; i < 6; i++) {
      const link = page.locator(`${cards} a`).nth(i);
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeVisible();
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await assertContent(page);
  const results = await new AxeBuilder({ page }).include('#featured-work').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('server-rendered stories and destinations remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/solutions-work');
  await assertContent(page);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await context.close();
});

test('more-solutions carousel shows complete cards with aligned dividers and no status badges', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page);
  const section = page.locator('#more-solutions');
  const cards = section.locator('article');
  await expect(cards).toHaveCount(8);
  await expect(section.getByText(/case study available|related work|product in development/i)).toHaveCount(0);
  const dividers = await section.locator('article header').evaluateAll(headers =>
    headers.slice(0, 3).map(header => Math.round(header.getBoundingClientRect().bottom)),
  );
  expect(new Set(dividers).size).toBe(1);
});
