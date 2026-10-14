/* Hash routing, page metadata, and route rendering. */
import { SITE, CONFIG } from '../config.js';
import { PAGES } from './pages.js';
import { track } from './tracking.js';
import { wireForm } from './forms.js';
function setMeta(id, val){
  const el = document.querySelector(CONFIG.selectors.byId[id]);
  if(el) el.setAttribute('content', val);
}

export function renderRoute(){
  const raw = (location.hash || CONFIG.routes.home).replace(/^#/, '') || '/';
  let path = raw.split('?')[0];
  if(path === '' || path === '/index.html') path = '/';
  const key = PAGES[path] ? path : '/404';
  const page = PAGES[key];
  document.body.dataset.page = key === '/' ? 'home' : key.slice(1).replace(/-/g, '_');
  const app = document.querySelector(CONFIG.selectors.app);

  app.innerHTML = page.render();

  document.title = page.title;
  const md = document.querySelector(CONFIG.selectors.pageDescription);
  if(md) md.setAttribute('content', page.desc);

  const url = SITE.origin + (key === '/' ? '/' : key);
  const canon = document.querySelector(CONFIG.selectors.byId['canonical']);
  if(canon) canon.setAttribute('href', url);
  setMeta('ogTitle', page.title);
  setMeta('ogDesc', page.desc);
  setMeta('ogUrl', url);

  const old = document.querySelector(CONFIG.selectors.byId['ldPage']);
  if(old) old.remove();
  const bc = [{name:'Home', url:SITE.origin + '/'}];
  if(key !== '/'){
    const name = key.replace(/^\//,'').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    bc.push({name:name, url:SITE.origin + key});
  }
  const ld = document.createElement('script');
  ld.type = CONFIG.schemaDataType;
  ld.id = 'ldPage';
  ld.textContent = JSON.stringify({
    "@context":CONFIG.schemaUrl,
    "@type":"BreadcrumbList",
    "itemListElement": bc.map((c,i) => ({"@type":"ListItem","position":i+1,"name":c.name,"item":c.url}))
  });
  document.head.appendChild(ld);

  document.querySelectorAll(CONFIG.selectors.navLinks).forEach(function(a){
    if(a.getAttribute('data-nav') === key) a.setAttribute('aria-current','page');
    else a.removeAttribute('aria-current');
  });

  const st = document.querySelector(CONFIG.selectors.routeStatus);
  if(st) st.textContent = document.title + ' page loaded';

  window.scrollTo(0,0);
  app.focus({preventScroll:true});

  track(CONFIG.events.pageView, {page_path:'#' + key, page_title:document.title});

  wireForm();
}
