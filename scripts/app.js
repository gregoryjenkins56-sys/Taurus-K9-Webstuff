/* SPA entry point: initialize shared behaviors and route rendering. */
import { BASE_SCHEMA, CONFIG } from './config.js';
import { wireNews } from './modules/newsletter.js';
import { wireCookies } from './modules/cookies.js';
import { wireNav } from './modules/navigation.js';
import { renderRoute } from './modules/router.js';

function init(){
  if(!document.querySelector(CONFIG.selectors.byId.ldBase)){
    const schema = document.createElement('script');
    schema.type = CONFIG.schemaDataType;
    schema.id = CONFIG.schemaBaseId;
    schema.textContent = JSON.stringify(BASE_SCHEMA);
    document.head.appendChild(schema);
  }
  const year = document.querySelector(CONFIG.selectors.currentYear);
  if(year) year.textContent = String(new Date().getFullYear());
  wireNav();
  wireNews();
  wireCookies();
  const toTop = document.querySelector(CONFIG.selectors.toTop);
  window.addEventListener('scroll', function(){
    toTop.setAttribute('data-show', window.scrollY > CONFIG.backToTopThreshold ? 'true' : 'false');
  }, {passive:true});
  toTop.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });
  window.addEventListener('hashchange', renderRoute);
  if(!location.hash) location.hash = CONFIG.routes.home;
  renderRoute();
}

init();
