export async function createSimulationPdf(snapshot, state, library) {
  if (!state.completion?.simulation || !snapshot.isPlaceholder) throw new Error('Only completed draft simulations can use this PDF renderer.');
  const { PDFDocument, StandardFonts, rgb } = library;
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${snapshot.title} - SIMULATION - NOT FOR SIGNING`);
  pdf.setSubject('Fictional demonstration, not an executed agreement');
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const margin = 48;
  const pageWidth = 595;
  const pageHeight = 842;
  const textWidth = pageWidth - margin * 2;
  let page;
  let cursor;
  function addPage() {
    page = pdf.addPage([pageWidth, pageHeight]);
    cursor = pageHeight - 82;
    page.drawText('SIMULATION - DRAFT - NOT FOR SIGNING', { x: margin, y: pageHeight - 42, size: 11, font: bold, color: rgb(.5, .15, .05) });
  }
  function line(text, font, size, indent = 0) {
    if (cursor < 66) addPage();
    page.drawText(text, { x: margin + indent, y: cursor, size, font, color: rgb(.13, .15, .16) });
    cursor -= size * 1.5;
  }
  function text(value, { font = regular, size = 10, indent = 0 } = {}) {
    for (const paragraph of String(value).split('\n')) {
      if (!paragraph) { cursor -= size * 1.5; continue; }
      let remainder = paragraph;
      while (remainder) {
        let lower = 1;
        let upper = remainder.length;
        while (lower < upper) {
          const middle = Math.ceil((lower + upper) / 2);
          if (font.widthOfTextAtSize(remainder.slice(0, middle), size) <= textWidth - indent) lower = middle;
          else upper = middle - 1;
        }
        let length = lower;
        if (length < remainder.length) {
          const space = remainder.lastIndexOf(' ', length);
          if (space > 0) length = space;
        }
        line(remainder.slice(0, length), font, size, indent);
        remainder = remainder.slice(length).replace(/^ /, '');
      }
    }
    cursor -= 8;
  }
  function heading(value) {
    if (cursor < 160) addPage();
    text(value, { font: bold, size: 13 });
  }
  addPage();
  heading(snapshot.title);
  text(`Version: ${snapshot.version}\nAgreement: ${snapshot.agreementId}\nClient: ${snapshot.client.name}\nDog: ${snapshot.dog.name} / ${snapshot.dog.breed}\nService: ${snapshot.service.name}`);
  text('Fictional data and placeholder terms. No legal agreement was executed. All timestamps below are device-generated demonstration times.');
  for (const section of snapshot.sections) {
    heading(section.heading);
    text(section.content);
    const record = state.acknowledgments[section.sectionId];
    if (record) {
      if (cursor < 112) addPage();
      text(`${record.type === 'initials' ? 'Initials' : 'Section signature'}: ${record.value}\nDemo acknowledgment time: ${record.recordedAt}`, { font: bold, indent: 12 });
    }
  }
  heading('Optional consents');
  for (const item of snapshot.optionalConsents) {
    text(`${item.heading}\n${item.content}\nSelection: ${state.optionalConsents[item.consentId]?.accepted ? 'Selected in simulation' : 'Not selected'}`);
  }
  heading('Electronic-signing disclosure - Draft');
  text(snapshot.electronicDisclosure.content);
  text(`Disclosure version: ${snapshot.electronicDisclosure.version}\nSimulated electronic consent: confirmed\nSimulated intent to complete: confirmed`);
  heading('Final simulated signature');
  text(`Printed name: ${state.completion.printedName}\nTyped signature: ${state.completion.signature}\nDemo completion time: ${state.completion.completedAt}`);
  heading('Simulation completion record');
  text(`Completion ID: ${state.completion.id}\nSnapshot SHA-256: ${snapshot.contentHash}`);
  for (const event of state.events) text(`${event.recordedAt} / ${event.action}${event.sectionId ? ` / ${event.sectionId}` : ''}`, { size: 8 });
  pdf.getPages().forEach((sheet, index, pages) => {
    sheet.drawText(`SIMULATION ONLY | ${snapshot.version} | Page ${index + 1} of ${pages.length}`, { x: margin, y: 32, size: 8, font: regular });
  });
  return pdf.save();
}