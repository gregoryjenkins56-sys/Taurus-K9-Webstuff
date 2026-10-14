/* Primary navigation and dropdown behavior. */
import { CONFIG } from '../config.js';
export function wireNav(){
  const nav = document.querySelector(CONFIG.selectors.nav);
  const tog = document.querySelector(CONFIG.selectors.menuToggle);

  function closeDrops(){
    document.querySelectorAll(CONFIG.selectors.dropdown).forEach(d => d.setAttribute('data-open','false'));
    document.querySelectorAll(CONFIG.selectors.dropdownToggle).forEach(b => b.setAttribute('aria-expanded','false'));
  }
  function setOpen(o){
    nav.setAttribute('data-open', o ? 'true' : 'false');
    tog.setAttribute('aria-expanded', o ? 'true' : 'false');
  }
  setOpen(false);

  tog.addEventListener('click', function(){ setOpen(nav.getAttribute('data-open') !== 'true'); });
  nav.addEventListener('click', function(e){ if(e.target.closest(CONFIG.selectors.link)){ setOpen(false); closeDrops(); } });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      if(nav.getAttribute('data-open') === 'true'){ setOpen(false); tog.focus(); }
      closeDrops();
    }
  });

  document.addEventListener('click', function(e){
    if(nav.getAttribute('data-open') === 'true' && !nav.contains(e.target) && !tog.contains(e.target)) setOpen(false);
    const b = e.target.closest ? e.target.closest(CONFIG.selectors.dropdownToggle) : null;
    if(!b){
      if(!(e.target.closest && e.target.closest(CONFIG.selectors.dropdown))) closeDrops();
      return;
    }
    const panel = document.querySelector(CONFIG.selectors.byId[b.getAttribute('aria-controls')]);
    const open = b.getAttribute('aria-expanded') !== 'true';
    closeDrops();
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    if(panel) panel.setAttribute('data-open', open ? 'true' : 'false');
  });
}