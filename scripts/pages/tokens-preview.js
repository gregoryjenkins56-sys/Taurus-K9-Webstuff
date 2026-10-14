/* Live token, element, and reusable component gallery for tokens-preview.html. */
import { CONFIG } from '../config.js';

const preview = CONFIG.tokenPreview;
const root = document.documentElement;
const themeToggle = document.querySelector(preview.selectors.themeToggle);
const tokenList = document.querySelector(preview.selectors.tokenList);
const componentList = document.querySelector(preview.selectors.componentList);

function walkRules(rules, stylesheetUrl, visit) {
  for (const rule of rules) {
    if (rule instanceof CSSImportRule && rule.styleSheet) {
      walkRules(rule.styleSheet.cssRules, rule.styleSheet.href, visit);
      continue;
    }
    if (rule instanceof CSSStyleRule) visit(rule, stylesheetUrl);
    if (rule.cssRules) walkRules(rule.cssRules, stylesheetUrl, visit);
  }
}

function loadedStylesheets() {
  const sheets = [];
  for (const sheet of document.styleSheets) {
    if (sheet.href) sheets.push(sheet);
  }
  return sheets;
}

function collectTokens() {
  const tokens = new Map();
  const usages = new Map();
  for (const sheet of loadedStylesheets()) {
    walkRules(sheet.cssRules, sheet.href, (rule, stylesheetUrl) => {
      for (const name of rule.style) {
        if (name.startsWith('--')) {
          const isDark = rule.selectorText.includes(preview.themeAttribute);
          if (!rule.selectorText.includes(preview.rootSelector) && !isDark) continue;
          const token = tokens.get(name) ?? { values: new Map(), stylesheetUrl };
          token.values.set(isDark ? preview.themes.dark : preview.themes.light, rule.style.getPropertyValue(name).trim());
          tokens.set(name, token);
        }
      }
      const references = rule.cssText.matchAll(/var\(\s*(--[\w-]+)/g);
      for (const [, name] of references) {
        const files = usages.get(name) ?? new Set();
        files.add(new URL(stylesheetUrl).pathname.replace(/^.*\/styles\//, 'styles/'));
        usages.set(name, files);
      }
    });
  }
  return { tokens, usages };
}

function tokenGroup(stylesheetUrl) {
  if (stylesheetUrl.includes(preview.tokenStylesheets.colors)) return preview.groups.colors;
  if (stylesheetUrl.includes(preview.tokenStylesheets.typography)) return preview.groups.typography;
  return preview.groups.spacing;
}

function renderTokens() {
  const { tokens, usages } = collectTokens();
  if (!tokens.size) {
    tokenList.textContent = preview.labels.emptyTokens;
    return;
  }
  const groups = new Map();
  for (const [name, token] of [...tokens].sort(([first], [second]) => first.localeCompare(second))) {
    const groupName = tokenGroup(token.stylesheetUrl);
    const group = groups.get(groupName) ?? document.createElement('section');
    if (!group.id) {
      group.classList.add(preview.classes.tokenGroup);
      const heading = document.createElement('h3');
      heading.textContent = groupName;
      const grid = document.createElement('div');
      grid.classList.add(preview.classes.tokenGrid);
      group.append(heading, grid);
      groups.set(groupName, group);
    }
    const item = document.createElement('article');
    item.classList.add(preview.classes.token);
    const title = document.createElement('h4');
    title.classList.add(preview.classes.tokenName);
    title.textContent = name;
    const value = document.createElement('p');
    value.classList.add(preview.classes.tokenValue);
    const darkValue = token.values.get(preview.themes.dark);
    value.textContent = `${preview.labels.tokenValue}: ${token.values.get(preview.themes.light) ?? darkValue}${darkValue && darkValue !== token.values.get(preview.themes.light) ? `; ${preview.labels.dark}: ${darkValue}` : ''}`;
    const useList = document.createElement('p');
    useList.classList.add(preview.classes.tokenUses);
    const locations = [...(usages.get(name) ?? [])].sort();
    const directUses = locations.filter(location => !preview.tokenDirectories.some(directory => location.includes(directory)));
    const tokenAliases = locations.filter(location => preview.tokenDirectories.some(directory => location.includes(directory)));
    if (directUses.length) {
      useList.textContent = `${preview.labels.tokenUsedIn}: ${directUses.join(', ')}`;
    } else if (tokenAliases.length) {
      useList.textContent = `${preview.labels.tokenAliases}: ${tokenAliases.join(', ')}`;
    } else {
      useList.textContent = `${preview.labels.tokenDefinedIn}: ${new URL(token.stylesheetUrl).pathname.replace(/^.*\/styles\//, 'styles/')}`;
    }
    item.append(title, value, useList);
    group.querySelector(`.${preview.classes.tokenGrid}`).append(item);
  }
  tokenList.replaceChildren(...groups.values());
}

function collectComponentNames() {
  const names = new Set();
  const modifiers = new Map();
  for (const sheet of loadedStylesheets()) {
    walkRules(sheet.cssRules, sheet.href, (rule, stylesheetUrl) => {
      if (!preview.componentDirectories.some(directory => stylesheetUrl.includes(directory))) return;
      for (const [, name] of rule.selectorText.matchAll(/\.([A-Za-z][\w-]*)/g)) {
        if (name.includes(preview.elementSeparator) || name.startsWith(preview.previewClassPrefix)) continue;
        const modifierAt = name.indexOf(preview.modifierSeparator);
        if (modifierAt > 0) {
          if (!name.startsWith(preview.utilityModifierPrefix)) {
            const base = name.slice(0, modifierAt);
            modifiers.set(name, base);
          }
          continue;
        }
        names.add(name);
      }
    });
  }
  for (const [name, base] of modifiers) {
    if (!names.has(base)) modifiers.delete(name);
  }
  return [
    ...[...names].map(name => ({ name, base: name, modifier: '' })),
    ...[...modifiers].map(([name, base]) => ({ name, base, modifier: name }))
  ].sort((first, second) => first.name.localeCompare(second.name));
}

function renderComponents() {
  const components = collectComponentNames();
  if (!components.length) {
    componentList.textContent = preview.labels.emptyComponents;
    return;
  }
  const cards = components.map(({ name, base, modifier }) => {
    const card = document.createElement('article');
    card.classList.add(preview.classes.component);
    const heading = document.createElement('h3');
    heading.textContent = `.${name}`;
    const frame = document.createElement('div');
    frame.classList.add(preview.classes.componentSample);
    const sample = document.createElement(preview.componentElements[base] ?? 'div');
    sample.classList.add(base);
    if (modifier) sample.classList.add(modifier.slice(base.length + preview.modifierSeparator.length));
    if (sample instanceof HTMLButtonElement) sample.type = 'button';
    if (sample instanceof HTMLTableElement) {
      const row = sample.insertRow();
      row.insertCell().textContent = `${preview.labels.componentSample} .${name}`;
    } else {
      sample.textContent = `${preview.labels.componentSample} .${name}`;
    }
    frame.append(sample);
    card.append(heading, frame);
    return card;
  });
  componentList.replaceChildren(...cards);
}

function setTheme(theme) {
  root.setAttribute(preview.themeAttribute, theme);
  const isDark = theme === preview.themes.dark;
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.textContent = isDark ? preview.labels.switchToLight : preview.labels.switchToDark;
}

themeToggle.addEventListener('click', () => {
  const nextTheme = root.getAttribute(preview.themeAttribute) === preview.themes.dark
    ? preview.themes.light
    : preview.themes.dark;
  setTheme(nextTheme);
});

const logo = document.querySelector(preview.selectors.logo);
logo.src = CONFIG.tokenPreview.logoUrl;
logo.alt = CONFIG.tokenPreview.logoAlt;
document.querySelector(preview.selectors.videoSource).src = CONFIG.heroVideoUrl;
renderComponents();
renderTokens();
setTheme(root.getAttribute(preview.themeAttribute) || preview.themes.light);
