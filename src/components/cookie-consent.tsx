'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {activeOptionalCategories, CONSENT_STORAGE_KEY, CONSENT_VALID_DAYS, CONSENT_VERSION, consentCategories, type ConsentCategory} from '@/lib/privacy/registry';

type ConsentRecord = {version:number; categories:Record<ConsentCategory, boolean>; decidedAt:string};
const eventName = 'utopia:open-cookie-settings';

function validRecord(raw:string|null):ConsentRecord|null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as ConsentRecord;
    const age = Date.now() - new Date(value.decidedAt).getTime();
    if (value.version !== CONSENT_VERSION || !value.categories?.essential || !Number.isFinite(age) || age < 0 || age > CONSENT_VALID_DAYS * 86400000) return null;
    return value;
  } catch { return null; }
}

function record(categories:Partial<Record<ConsentCategory, boolean>> = {}) {
  const selected = (Object.keys(consentCategories) as ConsentCategory[]).reduce((all, category) => {
    all[category] = consentCategories[category].required || (consentCategories[category].active && categories[category] === true);
    return all;
  }, {} as Record<ConsentCategory, boolean>);
  const value:ConsentRecord = {version:CONSENT_VERSION, categories:selected, decidedAt:new Date().toISOString()};
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('utopia:consent-changed', {detail:value}));
}

export function CookieSettingsButton() {
  return <button type="button" className="footer-utility-button" onClick={() => window.dispatchEvent(new Event(eventName))}>Cookie Settings</button>;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [panel, setPanel] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const priorFocus = useRef<HTMLElement|null>(null);

  useEffect(() => {
    try { setVisible(!validRecord(localStorage.getItem(CONSENT_STORAGE_KEY))); } catch { setVisible(true); }
    const open = () => { priorFocus.current = document.activeElement as HTMLElement; setVisible(true); setPanel(true); };
    window.addEventListener(eventName, open);
    return () => window.removeEventListener(eventName, open);
  }, []);

  useEffect(() => {
    if (!panel) return;
    dialog.current?.focus();
    const onKey = (event:KeyboardEvent) => {
      if (event.key === 'Escape') closePanel();
      if (event.key !== 'Tab' || !dialog.current) return;
      const items = [...dialog.current.querySelectorAll<HTMLElement>('button, a[href], input:not([disabled])')];
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [panel]);

  function closePanel() { setPanel(false); requestAnimationFrame(() => priorFocus.current?.focus()); }
  function decide(choice:'accept'|'reject') {
    try { record(Object.fromEntries(activeOptionalCategories.map(category => [category, choice === 'accept']))); } catch {}
    setPanel(false); setVisible(false);
  }
  if (!visible) return null;

  return <>
    {panel && <div className="consent-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) closePanel(); }}>
      <div className="consent-panel" role="dialog" aria-modal="true" aria-labelledby="consent-title" tabIndex={-1} ref={dialog}>
        <div className="consent-panel-head"><div><p className="eyebrow">Privacy controls</p><h2 id="consent-title">Cookie preferences</h2></div><button type="button" className="consent-close" onClick={closePanel} aria-label="Close cookie preferences">×</button></div>
        <p>Choose how this website may use browser storage. Utopia currently uses essential technologies only.</p>
        <div className="consent-category">
          <div><strong>{consentCategories.essential.label}</strong><p>{consentCategories.essential.description}</p></div><span>Always on</span>
        </div>
        {activeOptionalCategories.length === 0 && <p className="consent-empty">No optional analytics, functional, or marketing technologies are active on this website.</p>}
        <p className="small">See the <Link href="/legal/cookie-policy">Cookie Policy</Link> for the complete storage list.</p>
        <div className="consent-actions"><button type="button" className="plain-button" onClick={() => decide('reject')}>Reject non-essential</button><button type="button" className="button consent-save" onClick={() => decide('accept')}>Save preferences</button></div>
      </div>
    </div>}
    {!panel && <section className="consent-banner" aria-label="Cookie notice">
      <div><strong>Your privacy choices</strong><p>Utopia uses essential technologies to operate this website. With your permission, we may also use optional technologies described in our <Link href="/legal/cookie-policy">Cookie Policy</Link>. No optional technologies are currently active.</p></div>
      <div className="consent-actions"><button type="button" className="plain-button" onClick={() => decide('reject')}>Reject non-essential</button><button type="button" className="plain-button" onClick={() => { priorFocus.current = document.activeElement as HTMLElement; setPanel(true); }}>Manage preferences</button><button type="button" className="button" onClick={() => decide('accept')}>Accept all</button></div>
    </section>}
  </>;
}
