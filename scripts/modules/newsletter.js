/* Newsletter form behavior. */
import { CONFIG } from '../config.js';
import { track } from './tracking.js';
export function wireNews(){
  const f = document.querySelector(CONFIG.selectors.byId['newsForm']);
  if(!f) return;
  f.addEventListener('submit', function(e){
    e.preventDefault();
    const input = document.querySelector(CONFIG.selectors.byId['nlEmail']);
    const st = document.querySelector(CONFIG.selectors.byId['nlStatus']);
    const v = (input.value || '').trim();
    if(!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)){
      st.textContent = CONFIG.messages.invalidEmail;
      st.dataset.status = 'error';
      input.setAttribute('aria-invalid','true');
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');
    st.textContent = CONFIG.messages.newsletterSuccess;
    st.dataset.status = 'success';
    f.reset();
    track(CONFIG.events.newsletterSignup, {});
  });
}