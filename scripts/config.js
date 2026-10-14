/* Editable site details, behavior selectors, timings, and validation copy. */
export const BASE_SCHEMA = {
  "@context":"https://schema.org","@type":["LocalBusiness","ProfessionalService"],
  "@id":"https://www.taurusk9.com/#organization","name":"Taurus K9","alternateName":"Taurus K9 LLC",
  "slogan":"We make sit happen.",
  "description":"Professional dog training in Aransas Pass, Corpus Christi and the Texas Coastal Bend: Board and Train, private lessons, puppy foundations, behavior modification, detection, sport and police K9 training.",
  "url":"https://www.taurusk9.com/","telephone":"+1-361-230-1932","email":"taurusk9tx@gmail.com",
  "priceRange":"Contact for quote",
  "address":{"@type":"PostalAddress","addressLocality":"Aransas Pass","addressRegion":"TX","postalCode":"78336","addressCountry":"US"},
  "geo":{"@type":"GeoCoordinates","latitude":27.9095,"longitude":-97.1499},
  "areaServed":[{"@type":"City","name":"Aransas Pass"},{"@type":"City","name":"Corpus Christi"},{"@type":"City","name":"Portland"},{"@type":"City","name":"Rockport"},{"@type":"City","name":"Ingleside"},{"@type":"City","name":"Port Aransas"},{"@type":"City","name":"Sinton"},{"@type":"City","name":"Robstown"},{"@type":"AdministrativeArea","name":"Texas Coastal Bend"},{"@type":"Country","name":"United States"}],
  "openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"06:00","closes":"18:00"}],
  "sameAs":["https://www.facebook.com/TaurusK9LLC","https://www.instagram.com/taurusk9","https://www.tiktok.com/@taurusk9llc"],
  "hasOfferCatalog":{"@type":"OfferCatalog","name":"Dog Training Programs","itemListElement":[
    {"@type":"Offer","itemOffered":{"@type":"Service","name":"Board and Train"}},
    {"@type":"Offer","itemOffered":{"@type":"Service","name":"Private Dog Training Lessons"}},
    {"@type":"Offer","itemOffered":{"@type":"Service","name":"Puppy Foundations"}},
    {"@type":"Offer","itemOffered":{"@type":"Service","name":"Behavior Modification"}},
    {"@type":"Offer","itemOffered":{"@type":"Service","name":"Detection Dog and Police K9 Training"}},
    {"@type":"Offer","itemOffered":{"@type":"Service","name":"Sport Dog Training"}},
    {"@type":"Offer","itemOffered":{"@type":"Service","name":"Personal Protection Dog Training"}}]},
  "knowsAbout":["dog obedience training","behavior modification","police K9 training","narcotics detection dogs","e-collar conditioning","sport protection","decoy work"],
  "founder":[{"@type":"Person","name":"Greg","jobTitle":"Police K9 Master Trainer"},{"@type":"Person","name":"Rebecca","jobTitle":"Police K9 Master Trainer"}]
};
export const SITE = {
  phoneDisplay:'361-230-1932',
  phone:'+13612301932',
  email:'taurusk9tx@gmail.com',
  city:'Aransas Pass', state:'TX', zip:'78336',
  origin:'https://www.taurusk9.com',
  bookingUrl:'https://www.taurusk9.com/meetings/taurus',
  cities:['Aransas Pass','Corpus Christi','Portland','Ingleside','Rockport','Fulton','Port Aransas','Gregory','Sinton','Odem','Taft','Mathis','Robstown','Bishop','Kingsville','Alice','Beeville','Refugio','Woodsboro','Skidmore','Orange Grove','Freer','Premont'],
  counties:['San Patricio','Nueces','Aransas','Refugio','Kleberg','Jim Wells','Bee','Live Oak'],
  hours:[['Monday - Friday','6:00 AM - 6:00 PM'],['Saturday','By appointment'],['Sunday','By appointment']]
};
export const CONFIG = {
  cookieDelayMs: 700,
  backToTopThreshold: 600,
  phoneDisplay: SITE.phoneDisplay,
  phone: SITE.phone,
  email: SITE.email,
  origin: SITE.origin,
  bookingUrl: SITE.bookingUrl,
  facebookReviewsUrl: 'https://www.facebook.com/TaurusK9LLC',
  heroVideoUrl: 'https://242184033.fs1.hubspotusercontent-na2.net/hubfs/242184033/Videos/Facebook%20Test%20Video.mp4',
  schemaUrl: 'https://schema.org',
  schemaDataType: 'application/ld+json',
  schemaBaseId: 'ldBase',
  routes: { home: '#/', thankYou: '#/thank-you' },
  events: {
    formSubmit: 'form_submit', pageView: 'page_view', formError: 'form_error',
    generateLead: 'generate_lead', consentUpdate: 'consent_update',
    newsletterSignup: 'newsletter_signup'
  },
  selectors: {
    byId: {"app":"#app","canonical":"#canonical","city":"#city","cityErr":"#cityErr","ckAccept":"#ckAccept","ckPrefs":"#ckPrefs","ckReject":"#ckReject","ckSave":"#ckSave","ckSettings":"#ckSettings","consentEmail":"#consentEmail","consentErr":"#consentErr","consentSms":"#consentSms","cookie":"#cookie","crmPreview":"#crmPreview","ddAbout":"#ddAbout","ddPet":"#ddPet","ddWork":"#ddWork","decoy":"#decoy","dogInfo":"#dogInfo","dogName":"#dogName","email":"#email","emailErr":"#emailErr","errList":"#errList","errm":"#errm","hcH":"#hcH","heard":"#heard","ldBase":"#ldBase","ldPage":"#ldPage","leadForm":"#leadForm","message":"#message","napH":"#napH","nav":"#nav","ntog":"#ntog","ogDesc":"#ogDesc","ogTitle":"#ogTitle","ogUrl":"#ogUrl","owner":"#owner","ownerErr":"#ownerErr","phone":"#phone","phoneErr":"#phoneErr","phoneHint":"#phoneHint","prefAds":"#prefAds","prefAnalytics":"#prefAnalytics","prefs":"#prefs","routeStatus":"#routeStatus","scoreFill":"#scoreFill","scoreTier":"#scoreTier","scoreVal":"#scoreVal","service":"#service","serviceErr":"#serviceErr","state":"#state","toTop":"#toTop","year":"#year"},
    link: 'a', tracking: '[data-track]', pageDescription: 'meta[name="description"]',
    nav: '[data-js="primary-nav"]', menuToggle: '[data-js="menu-toggle"]',
    dropdown: '.nav__dropdown', dropdownToggle: '.nav__button',
    form: '[data-js="lead-form"]', newsletter: '#newsForm',
    cookie: '[data-js="cookie-banner"]', cookiePrefs: '[data-js="cookie-preferences"]',
    cookieSave: '[data-js="cookie-save"]', cookiePrefsToggle: '[data-js="cookie-preferences-toggle"]',
    cookieAccept: '[data-js="cookie-accept"]', cookieReject: '[data-js="cookie-reject"]',
    cookieSettings: '[data-js="cookie-settings"]', toTop: '[data-js="back-to-top"]',
    app: '[data-js="page-content"]', routeStatus: '[data-js="route-status"]',
    currentYear: '[data-js="current-year"]',
    timeline: 'input[name="timeline"]:checked', navLinks: '[data-nav]'
  },
  tokenPreview: {
    themeAttribute: 'data-theme',
    selectors: {
      themeToggle: '[data-js="preview-theme-toggle"]',
      tokenList: '[data-js="preview-token-list"]',
      componentList: '[data-js="preview-component-list"]',
      logo: '[data-js="preview-logo"]',
      videoSource: '[data-js="preview-video-source"]'
    },
    rootSelector: ':root',
    modifierSeparator: '--',
    elementSeparator: '__',
    utilityModifierPrefix: 'utility--',
    previewClassPrefix: 'token-preview',
    tokenDirectories: ['/styles/tokens/'],
    componentDirectories: ['/styles/base/', '/styles/components/', '/styles/sections/', '/styles/pages/'],
    tokenStylesheets: {
      colors: '/styles/tokens/colors.css',
      typography: '/styles/tokens/typography.css'
    },
    classes: {
      tokenGroup: 'token-preview__token-group',
      tokenGrid: 'token-preview__token-grid',
      token: 'token-preview__token',
      tokenName: 'token-preview__token-name',
      tokenValue: 'token-preview__token-value',
      tokenUses: 'token-preview__token-uses',
      component: 'token-preview__component',
      componentSample: 'token-preview__component-sample'
    },
    componentElements: { button: 'button', data: 'table', q: 'details' },
    themes: { light: 'light', dark: 'dark' },
    logoUrl: 'https://242184033.fs1.hubspotusercontent-na2.net/hubfs/242184033/Logo/Taurus%20K9%20NBG.png',
    logoAlt: 'Taurus K9 logo preview',
    labels: {
      light: 'Light theme',
      dark: 'Dark theme',
      switchToLight: 'Switch to light theme',
      switchToDark: 'Switch to dark theme',
      tokenValue: 'Value',
      tokenDefinedIn: 'Defined in',
      tokenAliases: 'Referenced by token aliases in',
      tokenUsedIn: 'Used in',
      componentSample: 'Sample styled with',
      emptyTokens: 'No tokens were found in the loaded stylesheets.',
      emptyComponents: 'No reusable component selectors were found.'
    },
    groups: {
      colors: 'Color tokens',
      typography: 'Typography tokens',
      spacing: 'Spacing, border, shadow, and transition tokens'
    }
  },
  messages: {
    invalidEmail: 'Please enter a valid email address.',
    newsletterSuccess: 'You are subscribed. Welcome to the pack. Look for training tips and program updates.',
    serviceRequired: 'Please choose a service.',
    nameRequired: 'Please enter your name.',
    phoneRequired: 'Please enter a 10-digit phone number.',
    cityRequired: 'Please enter your city.',
    consentRequired: 'Please choose at least one way to contact you.'
  }
};
