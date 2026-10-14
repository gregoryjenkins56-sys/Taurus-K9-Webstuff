/* Cookie preference behavior. */
import { CONFIG } from '../config.js';
import { CONSENT, track } from './tracking.js';
export function wireCookies(){
  const bar = document.querySelector(CONFIG.selectors.cookie);
  const prefs = document.querySelector(CONFIG.selectors.cookiePrefs);
  const save = document.querySelector(CONFIG.selectors.cookieSave);
  const tog = document.querySelector(CONFIG.selectors.cookiePrefsToggle);
  const show = () => bar.setAttribute('data-show','true');
  const hide = () => bar.setAttribute('data-show','false');

  setTimeout(show, CONFIG.cookieDelayMs);

  document.querySelector(CONFIG.selectors.cookieAccept).addEventListener('click', function(){
    CONSENT.analytics = true; CONSENT.marketing = true;
    hide();
    track(CONFIG.events.consentUpdate, {analytics:true, marketing:true});
  });
  document.querySelector(CONFIG.selectors.cookieReject).addEventListener('click', function(){
    CONSENT.analytics = false; CONSENT.marketing = false;
    hide();
  });
  tog.addEventListener('click', function(){
    const open = prefs.getAttribute('data-show') !== 'true';
    prefs.setAttribute('data-show', open ? 'true' : 'false');
    tog.setAttribute('aria-expanded', open ? 'true' : 'false');
    save.hidden = !open;
  });
  save.addEventListener('click', function(){
    CONSENT.analytics = document.querySelector(CONFIG.selectors.byId['prefAnalytics']).checked;
    CONSENT.marketing = document.querySelector(CONFIG.selectors.byId['prefAds']).checked;
    hide();
    track(CONFIG.events.consentUpdate, {analytics:CONSENT.analytics, marketing:CONSENT.marketing});
  });
  document.querySelector(CONFIG.selectors.cookieSettings).addEventListener('click', function(){
    prefs.setAttribute('data-show','true');
    tog.setAttribute('aria-expanded','true');
    save.hidden = false;
    show();
    bar.scrollIntoView({block:'end'});
  });
}