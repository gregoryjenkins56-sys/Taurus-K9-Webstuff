export const signingProviders = Object.freeze({
  adobe: 'Adobe Acrobat Sign'
});

export async function createProviderTemplate(template, provider, library) {
  const providerName = signingProviders[provider];
  if (!providerName) throw new Error('Unknown signing provider.');
  if (!template.isPlaceholder) throw new Error('Only draft templates can be exported from the simulation.');
  const { PDFDocument, StandardFonts, rgb } = library;
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${template.title} - ${providerName} - DRAFT`);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const form = pdf.getForm();
  const fields = [];
  let page;
  let cursor;
  function addPage() {
    page = pdf.addPage([612, 792]);
    page.drawText('DRAFT - NOT FOR SIGNING', { x: 48, y: 758, size: 11, font: bold });
    page.drawText(`${providerName} / ${template.version}`, { x: 48, y: 30, size: 9, font });
    cursor = 724;
  }
  function reserve(height) {
    if (cursor - height < 54) addPage();
  }
  function text(value, heading = false) {
    const selectedFont = heading ? bold : font;
    const size = heading ? 12 : 10;
    for (const paragraph of String(value).split('\n')) {
      let remainder = paragraph;
      if (!remainder) { reserve(15); cursor -= 15; }
      while (remainder) {
        let lower = 1;
        let upper = remainder.length;
        while (lower < upper) {
          const middle = Math.ceil((lower + upper) / 2);
          if (selectedFont.widthOfTextAtSize(remainder.slice(0, middle), size) <= 516) lower = middle;
          else upper = middle - 1;
        }
        let length = lower;
        if (length < remainder.length) {
          const space = remainder.lastIndexOf(' ', length);
          if (space > 0) length = space;
        }
        reserve(16);
        page.drawText(remainder.slice(0, length), { x: 48, y: cursor, size, font: selectedFont });
        cursor -= 16;
        remainder = remainder.slice(length).replace(/^ /, '');
      }
    }
    cursor -= 8;
  }
  function field(name, label, type, required, extra = {}) {
    reserve(62);
    text(`${label}${required ? ' (required)' : ' (optional)'}`);
    const bounds = { x: 48, y: cursor - 24, width: type === 'checkbox' ? 18 : 300, height: 24 };
    const control = type === 'checkbox' ? form.createCheckBox(name) : form.createTextField(name);
    control.addToPage(page, { ...bounds, borderWidth: 1, borderColor: rgb(.4, .4, .4) });
    fields.push({ name, label, type, required, recipientRole: 'Client', page: pdf.getPageCount(), bounds, ...extra });
    cursor -= 38;
  }
  addPage();
  text(template.title, true);
  text('Placeholder terms only. Configure native provider fields before sandbox testing.');
  field('client_name', 'Client printed name', 'text', true);
  field('dog_name', 'Dog name', 'text', true);
  field('service_name', 'Training service', 'text', true);
  for (const section of [...template.sections].sort((first, second) => first.order - second.order)) {
    reserve(80);
    text(section.heading, true);
    text(section.content);
    if (section.acknowledgmentType !== 'none') {
      field(`section_${section.sectionId}`, section.acknowledgmentType === 'initials' ? 'Client initials' : 'Client section signature', section.acknowledgmentType, section.required, { sectionId: section.sectionId });
    }
  }
  for (const consent of template.optionalConsents) {
    reserve(80);
    text(consent.heading, true);
    text(consent.content);
    field(`consent_${consent.consentId}`, 'Optional consent', 'checkbox', false, { consentId: consent.consentId });
  }
  text('Electronic-signing disclosure - Draft', true);
  text(template.electronicDisclosure.content);
  text(`Disclosure version: ${template.electronicDisclosure.version}`);
  field('electronic_consent', 'Electronic-signing consent', 'checkbox', true);
  field('signing_intent', 'Intent to sign', 'checkbox', true);
  field('final_printed_name', 'Final printed name', 'text', true);
  field('final_signature', 'Final signature', 'signature', true);
  field('signed_at', 'Provider signing date', 'date', true, { source: 'provider' });
  return {
    bytes: await pdf.save(),
    mapping: {
      schemaVersion: 1, provider, providerName, templateVersion: template.version,
      draft: true, readyToSend: false, coordinateSystem: 'PDF points, bottom-left origin; pages are 1-based',
      instructions: 'Upload the PDF in the provider template editor. Replace placeholder controls with native fields using this map. Assign Client to the actual signer. Set required flags in the provider editor, keep optional checkboxes unchecked, and use provider-generated signing dates. PDF controls are placement guides, not native signature fields or an API request. Automatic field conversion is not guaranteed. Review approved terms and provider-managed electronic consent before sending.',
      fields
    }
  };
}