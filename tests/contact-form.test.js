import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../js/script.js', import.meta.url), 'utf8');
const pageSource = source.slice(0, source.indexOf('/* ---------- tracking'));

class Element {
  constructor(value = ''){
    this.value = value;
    this.checked = false;
    this.dataset = {};
    this.attributes = {};
    this.children = [];
    this.listeners = {};
    this.textContent = '';
    this.disabled = false;
    this.isConnected = true;
  }
  setAttribute(name, value){ this.attributes[name] = value; }
  removeAttribute(name){ delete this.attributes[name]; }
  appendChild(child){ this.children.push(child); }
  replaceChildren(){ this.children = []; }
  focus(){ this.focused = true; }
  addEventListener(name, listener){ this.listeners[name] = listener; }
}

function setup(fetch = async () => ({ok:true})){
  const names = ['company','service','owner','email','phone','city','state','dogName',
    'dogBreed','dogAge','timeline','message','heard','consentEmail','consentSms'];
  const controls = Object.fromEntries(names.map(name => [name, new Element()]));
  const nodes = {};
  Object.entries(controls).forEach(([name, control]) => {
    nodes['#' + name] = control;
    nodes['#' + name + 'Err'] = new Element();
  });
  ['errm','errList','consentErr','formStatus'].forEach(id => { nodes['#' + id] = new Element(); });
  const heading = new Element();
  const button = new Element();
  nodes['#errm'].querySelector = () => heading;
  nodes['button[type="submit"]'] = button;
  const form = new Element();
  form.querySelector = selector => nodes[selector];
  form.elements = {namedItem:name => controls[name]};
  const requests = [];
  const events = [];
  const location = {hash:'#/contact', href:'https://www.taurusk9.com/#/contact'};
  class FormData {
    constructor(){
      this.values = new Map(Object.entries(controls)
        .filter(([name, control]) => !name.startsWith('consent') || control.checked)
        .map(([name, control]) => [name, control.value]));
    }
    get(name){ return this.values.get(name) ?? null; }
    has(name){ return this.values.has(name); }
  }
  const context = vm.createContext({
    document:{
      title:'Contact Taurus K9',
      getElementById:id => id === 'leadForm' ? form : null,
      createElement:() => new Element()
    },
    location, FormData, URLSearchParams, AbortSignal,
    track:(name, params) => events.push({name, params}),
    fetch:async (url, options) => {
      requests.push({url, options});
      return fetch(url, options);
    }
  });
  vm.runInContext(pageSource, context);
  vm.runInContext('wireForm()', context);
  const submit = () => form.listeners.submit({preventDefault(){}});
  function valid(){
    Object.entries({
      service:'board-train', owner:'Test Owner', email:'owner@example.com',
      phone:'(361) 555-0100', city:'Aransas Pass', state:'TX'
    }).forEach(([name, value]) => { controls[name].value = value; });
    controls.consentEmail.checked = true;
  }
  return {context, form, controls, nodes, heading, button, requests, events, location, submit, valid};
}

test('all routes render meaningful content and the contact layout uses the original form', () => {
  new vm.Script(source);
  const {context} = setup();
  const routes = vm.runInContext('Object.entries(PAGES).map(([path, page]) => [path, page.render()])', context);
  for(const [path, html] of routes){
    assert.ok(html.includes('<section'), path);
    assert.ok(html.includes('<h1>'), path);
  }
  const html = routes.find(([path]) => path === '/contact')[1];
  assert.match(html, /class="cgrid"/);
  assert.match(html, /class="form" id="leadForm"/);
  assert.equal((html.match(/class="frow frow2"/g) || []).length, 4);
  assert.equal((html.match(/class="frow frow3"/g) || []).length, 0);
  assert.match(html, /class="frow frow2">[\s\S]*?for="city"[\s\S]*?for="state"[\s\S]*?<\/div>\s*<div class="frow frow2">[\s\S]*?for="dogBreed"[\s\S]*?for="dogAge"/);
  assert.match(html, /<label for="dogBreed">Dog’s breed<\/label>\s*<input id="dogBreed" name="dogBreed" type="text" placeholder="e\.g\. German Shepherd or mixed breed" \/>/);
  assert.match(html, /<label for="dogAge">Dog’s age<\/label>\s*<input id="dogAge" name="dogAge" type="text" placeholder="e\.g\. 14 months or 3 years" \/>/);
  assert.match(html, /class="radios radios-row"/);
  assert.match(readFileSync(new URL('../css/style.css', import.meta.url), 'utf8'), /@media\(min-width:640px\)\{\.frow2\{grid-template-columns:1fr 1fr\}/);
  assert.doesNotMatch(source, /hs-form-frame|forms\/embed|wireHubSpotContactForm/);
});

test('required fields have inline errors, a focused summary and no API request', async () => {
  const s = setup();
  await s.submit();
  assert.equal(s.requests.length, 0);
  assert.equal(s.nodes['#errList'].children.length, 6);
  assert.equal(s.nodes['#errm'].focused, true);
  for(const name of ['service','owner','email','phone','city','consentEmail','consentSms']){
    assert.equal(s.controls[name].attributes['aria-invalid'], 'true');
  }
  const link = s.nodes['#errList'].children[0].children[0];
  let prevented = false;
  s.nodes['#errList'].listeners.click({
    target:{closest:() => link}, preventDefault(){ prevented = true; }
  });
  assert.equal(prevented, true);
  assert.equal(s.controls.service.focused, true);
  assert.equal(s.location.hash, '#/contact');
  assert.equal(s.events.at(-1).name, 'form_error');
});

test('invalid email, whitespace, and non-US/incorrect-length phones cannot submit', async () => {
  for(const phone of ['123', '123456789012', '+44 1234567890']){
    const s = setup();
    s.valid();
    s.controls.phone.value = phone;
    await s.submit();
    assert.equal(s.requests.length, 0, phone);
  }
  const s = setup();
  s.valid();
  s.controls.owner.value = '   ';
  s.controls.email.value = 'invalid@';
  await s.submit();
  assert.equal(s.requests.length, 0);
  assert.equal(s.nodes['#errList'].children.length, 2);
});

test('payload uses the Forms API schema, trims input and preserves consent choices', async () => {
  const s = setup();
  s.valid();
  Object.entries({
    dogName:' Rex ', dogBreed:' German Shepherd ', dogAge:' 14 months ', timeline:'asap',
    message:'Recall and leash manners', heard:'referral', phone:'+1 (361) 555-0100'
  }).forEach(([name, value]) => { s.controls[name].value = value; });
  await s.submit();
  assert.equal(s.requests.length, 1);
  const {url, options} = s.requests[0];
  assert.equal(url, 'https://api.hsforms.com/submissions/v3/integration/submit/242184033/9b37a135-9b1f-47bd-889c-3bbec3ed780f');
  assert.equal(options.method, 'POST');
  assert.equal(options.headers['Content-Type'], 'application/json');
  const payload = JSON.parse(options.body);
  assert.deepEqual(Object.fromEntries(payload.fields.map(field => [field.name, field.value])), {
    firstname:'Test Owner', email:'owner@example.com', phone:'+1 (361) 555-0100',
    city:'Aransas Pass', state:'TX', service:'board-train', dogs_name:'Rex',
    dogInfo:'Breed: German Shepherd; Age: 14 months', preferred_start_timeline:'asap',
    training_goals:'Recall and leash manners', heard:'referral',
    consentEmail:'true', consentSms:'false'
  });
  assert.deepEqual(payload.context, {
    pageUri:'https://www.taurusk9.com/#/contact', pageName:'Contact Taurus K9'
  });
  assert.equal(s.location.hash, '#/thank-you');
  assert.equal(s.events.at(-1).name, 'form_success');
  await s.submit();
  assert.equal(s.requests.length, 1);
});

test('rapid submits make one request and keep the button disabled until confirmation', async () => {
  let finish;
  const s = setup(() => new Promise(resolve => { finish = resolve; }));
  s.valid();
  const pending = s.submit();
  await s.submit();
  assert.equal(s.requests.length, 1);
  assert.equal(s.button.disabled, true);
  assert.equal(s.form.attributes['aria-busy'], 'true');
  assert.equal(s.location.hash, '#/contact');
  finish({ok:true});
  await pending;
  assert.equal(s.location.hash, '#/thank-you');
});

test('breed and age compose into the existing HubSpot field for every optional combination', async () => {
  for(const [breed, age, expected] of [
    ['German Shepherd', '3 years', 'Breed: German Shepherd; Age: 3 years'],
    ['German Shepherd', '', 'Breed: German Shepherd'],
    ['', '3 years', 'Age: 3 years'],
    ['', '', undefined]
  ]){
    const s = setup();
    s.valid();
    s.controls.dogBreed.value = breed;
    s.controls.dogAge.value = age;
    await s.submit();
    const fields = Object.fromEntries(JSON.parse(s.requests[0].options.body).fields
      .map(field => [field.name, field.value]));
    assert.equal(fields.dogInfo, expected);
  }
});

test('SMS-only consent is valid, blank optional fields and unavailable context are omitted', async () => {
  const s = setup();
  s.valid();
  s.controls.consentEmail.checked = false;
  s.controls.consentSms.checked = true;
  s.location.href = '';
  s.context.document.title = '';
  await s.submit();
  const payload = JSON.parse(s.requests[0].options.body);
  const fields = Object.fromEntries(payload.fields.map(field => [field.name, field.value]));
  assert.equal(fields.consentEmail, 'false');
  assert.equal(fields.consentSms, 'true');
  assert.equal(Object.hasOwn(fields, 'dogs_name'), false);
  assert.equal(Object.hasOwn(fields, 'preferred_start_timeline'), false);
  assert.deepEqual(payload.context, {});
});

test('HTTP, network and timeout errors preserve entries, expose retry and never auto-retry', async () => {
  for(const result of [() => ({ok:false, status:400}), () => ({ok:false, status:429}),
    () => ({ok:false, status:500}), () => { throw new TypeError('Network error'); },
    () => { const error = new Error('Timeout'); error.name = 'TimeoutError'; throw error; }]){
    let fail = true;
    const s = setup(() => fail ? result() : {ok:true});
    s.valid();
    await s.submit();
    assert.equal(s.location.hash, '#/contact');
    assert.equal(s.controls.owner.value, 'Test Owner');
    assert.equal(s.controls.consentEmail.checked, true);
    assert.equal(s.button.disabled, false);
    assert.equal(s.nodes['#errm'].attributes['data-show'], 'true');
    assert.match(s.nodes['#errList'].children[0].textContent, /try again/);
    assert.equal(s.events.at(-1).name, 'form_error');
    assert.equal(s.requests.length, 1);
    fail = false;
    await s.submit();
    assert.equal(s.requests.length, 2);
    assert.equal(s.location.hash, '#/thank-you');
  }
});

test('honeypot is read by name and never posts or emits a conversion', async () => {
  const s = setup();
  s.controls.company.value = 'bot';
  await s.submit();
  assert.equal(s.requests.length, 0);
  assert.equal(s.events.length, 0);
  assert.equal(s.location.hash, '#/thank-you');
});

test('a completed request cannot redirect away from a newly selected route', async () => {
  let finish;
  const s = setup(() => new Promise(resolve => { finish = resolve; }));
  s.valid();
  const pending = s.submit();
  s.form.isConnected = false;
  s.location.hash = '#/pet-training';
  finish({ok:true});
  await pending;
  assert.equal(s.location.hash, '#/pet-training');
});
