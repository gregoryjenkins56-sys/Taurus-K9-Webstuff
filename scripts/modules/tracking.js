/* Consent-aware site event tracking. */
import { CONFIG } from '../config.js';
export const CONSENT = {analytics:true, marketing:false};

export function track(name, params){
  if(!CONSENT.analytics && !CONSENT.marketing) return;
  window.__dataLayer = window.__dataLayer || [];
  const ev = Object.assign({event:name, page_path:location.hash || '#/'}, params || {});
  window.__dataLayer.push(ev);
  /* In production: gtag('event', name, params); fbq('trackCustom', name, params); */
}

document.addEventListener('click', function(e){
  const a = e.target.closest ? e.target.closest(CONFIG.selectors.tracking) : null;
  if(!a) return;
  const n = a.getAttribute('data-track');
  const loc = a.getAttribute('data-loc') || '';
  if(n !== CONFIG.events.formSubmit){
    track(n, {location:loc});
  }
});