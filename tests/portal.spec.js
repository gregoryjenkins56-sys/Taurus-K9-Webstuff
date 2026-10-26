import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

async function authenticatedPortal(page, { enabled = true, empty = false, unauthorized = false, forbiddenAgreement = false, agreements, completedDocuments = [] } = {}) {
  const assets = new Map([
    ['/portal/', ['../portal/index.html', 'text/html']],
    ['/portal/js/client.js', ['../portal/js/client.js', 'text/javascript']],
    ['/portal/css/portal.css', ['../portal/css/portal.css', 'text/css']],
    ['/portal/css/adobe.css', ['../portal/css/adobe.css', 'text/css']]
  ]);
  await page.route('**/portal/**', async route => {
    const asset = assets.get(new URL(route.request().url()).pathname);
    if (!asset) { await route.fulfill({ status: 404 }); return; }
    await route.fulfill({ body: await readFile(new URL(asset[0], import.meta.url)), contentType: asset[1] });
  });
  const template = JSON.parse(await readFile(new URL('../server/contracts/training-contract.draft.json', import.meta.url), 'utf8'));
  const assignedAgreements = agreements ?? [{ id: 'assigned-01', title: 'Assigned training agreement', version: 'DRAFT-1', status: 'assigned', dog: 'River', service: 'Private Lessons', progress: { completed: 0, required: 3 } }];
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (unauthorized) { await route.fulfill({ status: 401, json: { error: 'Your session has expired. Please sign in again.' } }); return; }
    if (path === '/api/me') {
      await route.fulfill({ json: { user: { name: 'Portal Test Owner', role: null }, households: [{ id: 'test-household', contact_name: 'Portal Test Owner', phone: '', city: '' }], csrfToken: 'test-only-csrf' } });
    } else if (path === '/api/households/test-household/dogs') {
      await route.fulfill({ json: { dogs: [{ id: 'test-dog', name: 'River', breed: 'Mix' }] } });
    } else if (path === '/api/agreements' || path === '/api/documents') {
      const completed = path === '/api/documents';
      const records = completed ? completedDocuments : empty ? [] : assignedAgreements;
      await route.fulfill(enabled ? { json: { agreements: records } } : { status: 503, json: { error: 'Contract signing is not enabled.' } });
    } else if (path.startsWith('/api/agreements/')) {
      const agreementId = decodeURIComponent(path.slice('/api/agreements/'.length));
      const agreement = assignedAgreements.find(item => item.id === agreementId);
      await route.fulfill(forbiddenAgreement || !agreement ? { status: 404, json: { error: 'Agreement not found.' } } : { json: {
        snapshot: { ...template, title: agreement.title, version: agreement.version, client: { name: 'Portal Test Owner' }, dog: { name: agreement.dog }, service: { name: agreement.service } }, status: agreement.status, progress: agreement.progress
      } });
    } else await route.fulfill({ status: 404, json: { error: 'Not found.' } });
  });
}

test('authenticated portal header exposes a named banner and a visible-name brand link', async ({ page }) => {
  await authenticatedPortal(page, { empty: true });
  await page.goto('/portal/');
  const header = page.getByRole('banner');
  await expect(header).toBeVisible();
  await expect(header.getByRole('link', { name: 'Taurus K9 LLC Client portal', exact: true })).toBeVisible();
  await expect(header.getByRole('link', { name: 'Back to website', exact: true })).toBeVisible();
  expect((await new AxeBuilder({ page }).include('.portal-header').analyze()).violations).toEqual([]);
});

test('authenticated client portal uses assigned records and keeps Adobe signing safely disabled', async ({ page }, testInfo) => {
  await authenticatedPortal(page);
  await page.goto('/portal/');
  await expect(page.getByText('Welcome, Portal Test Owner.')).toBeVisible();
  await expect(page.getByText('1 agreement records assigned to your account.')).toBeVisible();
  await page.getByRole('link', { name: 'Go to My Agreement', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Assigned training agreement', exact: true })).toBeVisible();
  await expect(page.getByText('River / Private Lessons')).toBeVisible();
  await page.getByRole('link', { name: 'Review agreement', exact: true }).click();
  await expect(page.locator('.portal-contract-sections > section')).toHaveCount(4);
  await expect(page.getByRole('button', { name: 'Continue with Adobe Sign' })).toBeDisabled();
  await expect(page.locator('#adobe-signing-status')).toContainText('read-only');
  await expect(page.locator('.portal-contract-sections input')).toHaveCount(0);
  await expect(page.locator('#portal-nav a[aria-current="page"]')).toHaveText('My Agreement');
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 950 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`authenticated-adobe-${width}.png`), fullPage: true });
  }
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('link', { name: 'Completed Documents', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'No completed agreements yet', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Download/ })).toHaveCount(0);
});

test('authenticated client portal distinguishes disabled agreement storage from an empty list', async ({ page }) => {
  await authenticatedPortal(page, { enabled: false });
  await page.goto('/portal/#/agreement');
  await expect(page.getByText('Agreement records are not enabled for this portal yet. Contact Taurus K9 for your agreement.')).toBeVisible();
  await expect(page.getByText('No agreements assigned yet', { exact: true })).toHaveCount(0);
});

test('authenticated client portal shows genuine empty agreement state without fictional client data', async ({ page }) => {
  await authenticatedPortal(page, { empty: true });
  await page.goto('/portal/#/agreement');
  await expect(page.getByRole('heading', { name: 'No agreements assigned yet' })).toBeVisible();
  await expect(page.getByText(/Alex Morgan|Scout|simulation-agreement/)).toHaveCount(0);
});

test('agreement handling lists each assigned agreement and opens the matching read-only record', async ({ page }) => {
  await authenticatedPortal(page, { agreements: [
    { id: 'assigned-01', title: 'River training agreement', version: '2026-A', status: 'assigned', dog: 'River', service: 'Private Lessons', progress: { completed: 1, required: 3 } },
    { id: 'assigned-02', title: 'Moss training agreement', version: '2026-B', status: 'in_progress', dog: 'Moss', service: 'Board and Train', progress: { completed: 2, required: 4 } }
  ] });
  const requests = [];
  page.on('request', request => {
    if (request.url().includes('/api/')) requests.push({ url: new URL(request.url()).pathname, method: request.method() });
  });
  await page.goto('/portal/#/agreement');
  const records = page.locator('.portal-agreement-row');
  await expect(records).toHaveCount(2);
  await expect(records.nth(0)).toContainText('River training agreement');
  await expect(records.nth(0)).toContainText('1 of 3 acknowledgments recorded');
  await expect(records.nth(0).getByRole('link', { name: 'Review agreement' })).toHaveAttribute('href', '#/agreement/assigned-01');
  await expect(records.nth(1)).toContainText('Moss training agreement');
  await expect(records.nth(1)).toContainText('In progress');
  await records.nth(1).getByRole('link', { name: 'Review agreement' }).click();
  await expect(page.getByRole('heading', { name: 'Moss training agreement', exact: true })).toBeVisible();
  await expect(page.locator('.portal-agreement-summary')).toContainText('Moss');
  await expect(page.locator('.portal-contract-sections > section h2')).toHaveText([
    'Section 01 - Approved text pending', 'Section 02 - Approved text pending',
    'Section 03 - Approved text pending', 'Section 04 - Approved text pending'
  ]);
  await expect(page.getByRole('button', { name: 'Continue with Adobe Sign' })).toBeDisabled();
  await expect(page.locator('.portal-contract-sections input, .portal-contract-sections button')).toHaveCount(0);
  expect(requests.filter(request => request.method !== 'GET')).toEqual([]);
  expect(requests.filter(request => request.url === '/api/agreements/assigned-02')).toHaveLength(1);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('completed documents only render completed API records with no signing or download action', async ({ page }) => {
  await authenticatedPortal(page, { completedDocuments: [
    { id: 'completed-01', title: 'Completed River agreement', version: '2026-C', status: 'signed', dog: 'River', service: 'Private Lessons', progress: { completed: 3, required: 3 } }
  ] });
  await page.goto('/portal/#/documents');
  await expect(page.locator('.portal-agreement-row')).toHaveCount(1);
  await expect(page.locator('.portal-agreement-row')).toContainText('Completed River agreement');
  await expect(page.locator('.portal-agreement-row')).toContainText('Completed');
  await expect(page.getByRole('link', { name: 'View agreement', exact: true })).toHaveAttribute('href', '#/agreement/completed-01');
  await expect(page.getByRole('button', { name: 'Continue with Adobe Sign' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Download/ })).toHaveCount(0);
  await expect(page.locator('.portal-footnote')).toContainText('Signing and downloads require Adobe setup');
});

test('authenticated client portal handles inaccessible agreements and expired sessions', async ({ page }) => {
  await authenticatedPortal(page, { forbiddenAgreement: true });
  await page.goto('/portal/#/agreement/assigned-01');
  await expect(page.getByRole('alert')).toHaveText('Agreement not found.');
  await expect(page.locator('.portal-contract-sections')).toHaveCount(0);
  await page.unroute('**/api/**');
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: { error: 'Your session has expired. Please sign in again.' } }));
  await page.getByRole('link', { name: 'My Agreement', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
  await expect(page.locator('#portal-nav a')).toHaveCount(0);
});

for (const [provider, name, launchAction] of [
  ['adobe', 'Adobe Acrobat Sign', 'Review with Adobe Sign']
]) {
  test(`${provider} standalone portal completes its own client flow`, async ({ page }, testInfo) => {
    await page.goto(`/${provider}/`);
    await expect(page).toHaveTitle(`${name} client portal preview | Taurus K9`);
    await expect(page.getByRole('heading', { name: 'Welcome back, Alex.' })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 950 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`${provider}-overview-${width}.png`), fullPage: true, animations: 'disabled' });
    }
    await page.getByRole('link', { name: 'Review agreement', exact: true }).click();
    await expect(page.getByRole('link', { name: launchAction, exact: true })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`${provider}-handoff-320.png`), fullPage: true, animations: 'disabled' });
    await page.getByRole('link', { name: launchAction, exact: true }).click();
    await expect(page.locator('.provider-toolbar')).toContainText('Local simulation');
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 950 });
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page.locator('.agreement-section')).toHaveCount(4);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const selector of ['.provider-toolbar', '.provider-document', '.agreement-final-button']) {
        const bounds = await page.locator(selector).boundingBox();
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
      }
      await page.screenshot({ path: testInfo.outputPath(`${provider}-signing-${width}.png`), fullPage: true, animations: 'disabled' });
    }
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.locator('.document-outline [data-section="section-03"]').click();
    await expect(page.locator('#heading-section-03')).toBeFocused();
    await page.locator('.provider-toolbar button').click();
    await expect(page.locator('#ack-section-02')).toBeFocused();
    await page.locator('#ack-section-02').fill('AM');
    await page.getByRole('button', { name: 'Save draft', exact: true }).click();
    await expect(page.locator('[data-save-status]')).toContainText('Draft saved');
    await page.reload();
    await expect(page.locator('#ack-section-02')).toHaveValue('AM');
    await expect(page.locator('#electronic-consent')).not.toBeChecked();
    await page.getByRole('button', { name: 'Complete signing simulation' }).click();
    await expect(page.locator('#agreement-errors')).toBeVisible();
    await recordRequired(page);
    await expect(page.locator('.context-progress')).toHaveText('3 of 3 recorded');
    await expect(page.locator('.document-outline [data-recorded="true"]')).toHaveCount(3);
    await finish(page);
    await expect(page.locator('.provider-toolbar button')).toHaveText('View documents');
    await page.getByRole('link', { name: 'Return to portal', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Your demo is complete' })).toBeVisible();
    await page.getByRole('link', { name: 'Overview', exact: true }).click();
    await expect(page.locator('.training-details')).toContainText('Not scheduled');
    await page.getByRole('link', { name: 'Documents', exact: true }).click();
    await expect(page.locator('.recent-activity')).toContainText('Signing simulation completed');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download demo PDF', exact: true }).click();
    const download = await pending;
    expect(download.suggestedFilename()).toBe(`Taurus-K9-${provider}-SIMULATION.pdf`);
    expect(await download.failure()).toBeNull();
    await page.reload();
    await expect(page.getByText('Demo completed', { exact: true })).toBeVisible();
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Reset this demo', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'No completed demo documents yet' })).toBeVisible();
  });
}

test('Adobe preserves acknowledgments when reset is canceled', async ({ page }) => {
  await page.goto('/adobe/#/sign');
  await page.locator('#ack-section-02').fill('AM');
  await page.locator('#ack-section-02').locator('xpath=ancestor::form').getByRole('button', { name: 'Record initials', exact: true }).click();
  await page.getByRole('button', { name: 'Save draft', exact: true }).click();
  await expect(page.locator('[data-save-status]')).toContainText('Draft saved');
  await page.goto('/adobe/#/sign');
  await expect(page.getByText('Initials recorded: AM', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Return to portal', exact: true }).click();
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Reset this demo', exact: true }).click();
  await page.goto('/adobe/#/sign');
  await expect(page.getByText('Initials recorded: AM', { exact: true })).toBeVisible();
});

async function recordRequired(page) {
  for (const sectionId of ['section-02', 'section-03', 'section-04']) {
    const field = page.locator(`#ack-${sectionId}`);
    await field.fill(sectionId === 'section-04' ? 'Alex Morgan' : 'AM');
    await field.locator('xpath=ancestor::form').getByRole('button', { name: /Record/ }).click();
    await expect(page.locator(`#heading-${sectionId}`).locator('xpath=ancestor::section').getByText(/recorded:/)).toBeVisible();
  }
}
async function finish(page) {
  await page.getByLabel('Final printed name', { exact: true }).fill('Alex Morgan');
  await page.getByLabel('Final typed signature', { exact: true }).fill('Alex Morgan');
  await page.locator('#electronic-consent').check();
  await page.locator('#signing-intent').check();
  await page.getByRole('button', { name: 'Complete signing simulation' }).click();
  await expect(page.getByRole('heading', { name: 'Simulation completed', exact: true })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Training Agreement', exact: true })).toBeVisible();
});

test('full document is visible, acknowledgments start empty, and accessibility scan passes', async ({ page }) => {
  await expect(page.locator('.agreement-section')).toHaveCount(4);
  for (const sectionId of ['section-02', 'section-03', 'section-04']) await expect(page.locator(`#ack-${sectionId}`)).toHaveValue('');
  for (const id of ['electronic-consent', 'signing-intent', 'optional-optional-example']) await expect(page.locator(`#${id}`)).not.toBeChecked();
  await expect(page.getByText('0 of 3 required acknowledgments recorded', { exact: true })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('save and resume keeps drafts distinct from acknowledgments, with correction and removal', async ({ page }) => {
  await page.locator('#ack-section-02').fill('AM');
  await page.locator('#ack-section-02').locator('xpath=ancestor::form').getByRole('button', { name: 'Record initials', exact: true }).click();
  await page.locator('#ack-section-03').fill('XX');
  await page.getByLabel('Final printed name', { exact: true }).fill('Alex Morgan');
  await page.locator('#electronic-consent').check();
  await page.getByRole('button', { name: 'Save draft', exact: true }).click();
  await expect(page.locator('[data-save-status]')).toContainText('Draft saved');
  await page.reload();
  await expect(page.getByText('1 of 3 required acknowledgments recorded', { exact: true })).toBeVisible();
  await expect(page.locator('#ack-section-03')).toHaveValue('XX');
  await expect(page.locator('#electronic-consent')).not.toBeChecked();
  await page.locator('#ack-section-02').fill('AX');
  await page.getByRole('button', { name: 'Update acknowledgment', exact: true }).click();
  await expect(page.getByText('Initials recorded: AX', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Remove acknowledgment', exact: true }).click();
  await expect(page.getByText('0 of 3 required acknowledgments recorded', { exact: true })).toBeVisible();
});

test('missing required fields show linked errors and optional consent stays optional', async ({ page }) => {
  await page.getByRole('button', { name: 'Complete signing simulation' }).click();
  await expect(page.locator('#agreement-errors')).toBeFocused();
  await expect(page.locator('#agreement-errors li')).toHaveCount(7);
  await recordRequired(page);
  await expect(page.locator('#optional-optional-example')).not.toBeChecked();
  await finish(page);
  await expect(page.getByText('Not selected', { exact: true })).toBeVisible();
  await expect(page.locator('.agreement-acknowledgment input')).toHaveCount(0);
  const scan = await new AxeBuilder({ page }).analyze();
  expect(scan.violations).toEqual([]);
});

test('completion survives reload and produces an actual marked PDF in Completed Documents', async ({ page }) => {
  await recordRequired(page);
  await finish(page);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Simulation completed', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Completed Documents', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Completed Documents', exact: true })).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download simulated agreement PDF' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('Taurus-K9-SIMULATION-NOT-FOR-SIGNING.pdf');
  expect(await download.failure()).toBeNull();
});

test('keyboard-only acknowledgment works and unsaved acknowledgment edits block completion', async ({ page }) => {
  await page.locator('#ack-section-02').focus();
  await page.keyboard.type('AM');
  await page.keyboard.press('Tab');
  await expect(page.locator('#ack-section-02').locator('xpath=ancestor::form').getByRole('button', { name: 'Record initials', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Initials recorded: AM', { exact: true })).toBeVisible();
  for (const sectionId of ['section-03', 'section-04']) {
    await page.locator(`#ack-${sectionId}`).fill(sectionId === 'section-04' ? 'Alex Morgan' : 'AM');
    await page.locator(`#ack-${sectionId}`).locator('xpath=ancestor::form').getByRole('button', { name: /Record/ }).click();
  }
  await page.locator('#ack-section-02').fill('AX');
  await page.getByLabel('Final printed name', { exact: true }).fill('Alex Morgan');
  await page.getByLabel('Final typed signature', { exact: true }).fill('Alex Morgan');
  await page.locator('#electronic-consent').check();
  await page.locator('#signing-intent').check();
  await page.getByRole('button', { name: 'Complete signing simulation' }).click();
  await expect(page.locator('#agreement-errors')).toContainText('Record or discard your changed acknowledgment');
});

test('desktop and narrow mobile layouts have no overflow and preserve the full document', async ({ page }, testInfo) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    await expect(page.locator('.agreement-section')).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const selector of ['.agreement-draft-banner', '.agreement-final-button', '.agreement-section']) {
      for (const element of await page.locator(selector).all()) {
        const bounds = await element.boundingBox();
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
      }
    }
    await page.screenshot({ path: testInfo.outputPath(`agreement-${width}.png`), fullPage: true });
  }
  const scan = await new AxeBuilder({ page }).analyze();
  expect(scan.violations).toEqual([]);
});