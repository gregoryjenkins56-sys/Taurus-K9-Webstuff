'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  prepareReview, issueSnapshot, moneyToMinorUnits, PROGRAM_TYPES, SEX_STATUSES
} = require('./agreement-mapping.cjs');

function fixture() {
  return {
    contact: {
      id: 'synthetic-contact',
      properties: {
        firstname: 'Example', lastname: 'Owner', email: 'owner@example.invalid',
        phone: '000-000-0000', address: 'Example street', city: 'Example city',
        state: 'Example state', zip: '00000', dogs_name: 'Example dog',
        dog_breed: 'Example breed', dog_age: '2 years', dog_sex: 'Female (Spayed)',
        training_program: 'Private Lessons', vet_info: 'Synthetic intake only'
      }
    },
    deal: {
      id: 'synthetic-deal',
      properties: {
        dog_breed_contract: 'Example breed', dog_age__cloned_: '2 years',
        dog_color: 'Example color', dog_weight: '20', microchip_number: '',
        program_type: 'Private Lessons', program_start_date: '2028-02-29',
        program_end_date: '2028-03-15T18:30:00Z', amount: '1234.56',
        deal_currency_code: 'USD', deposit_paid_amount: '100.00', balance_due: '1134.56',
        pipeline: 'synthetic-pipeline', dealstage: 'synthetic-stage'
      }
    },
    dog: {
      id: 'synthetic-dog', name: 'Example dog', breed: 'Example breed',
      ageAtIssue: '2 years', color: 'Example color', sexStatus: 'Female (Spayed)',
      weight: { value: 20, unit: 'kg' }, microchipNumber: ''
    },
    enrollment: { id: 'synthetic-enrollment', dogId: 'synthetic-dog', dealId: 'synthetic-deal' },
    confirmation: {
      contactId: 'synthetic-contact', dealId: 'synthetic-deal',
      dogId: 'synthetic-dog', enrollmentId: 'synthetic-enrollment',
      signer: true, dog: true, enrollment: true
    },
    requiredDeposit: { amount: '200.00', currency: 'USD' },
    endDateTimeZone: 'America/Chicago'
  };
}

const approval = { approved: true, templateId: 'example-template', templateVersion: 'v1' };
const hasError = (review, code, field) =>
  review.errors.some(error => error.code === code && (!field || error.field === field));

test('maps verified owner, confirmed dog and enrollment to proposed Adobe fields', () => {
  const review = prepareReview(fixture());
  assert.deepEqual(review.errors, []);
  const data = review.data;
  assert.equal(data.owner.address.postalCode, '00000');
  assert.equal(data.dog.name, 'Example dog');
  assert.equal(data.agreement.dogAgeAtIssue, '2 years');
  assert.equal(data.adobeFields.owner_first_name, data.owner.firstName);
  assert.equal(data.adobeFields.dog_weight, '20 kg');
  assert.equal(data.adobeFields.program_start_date, '2028-02-29');
  assert.equal(data.adobeFields.program_end_date, data.enrollment.endDateTimeDisplay);
  assert.equal(data.enrollment.priceMinor, 123456);
  assert.equal(data.enrollment.requiredDepositMinor, 20000);
  assert.equal(data.payment.crmSummaryMinor.deposit_paid_amount, 10000);
  assert.equal(data.payment.receivedDepositMinor, null);
  assert.equal(data.payment.status, 'unverified');
  assert.ok(review.warnings.length);
});

test('missing required owner, dog, program, price and selection data blocks issuance', () => {
  assert.ok(prepareReview().errors.length);
  for (const key of ['firstname', 'lastname', 'email', 'phone', 'address', 'city', 'state', 'zip']) {
    const input = fixture();
    delete input.contact.properties[key];
    const review = prepareReview(input);
    assert.ok(hasError(review, 'required'));
    assert.throws(() => issueSnapshot(review, approval));
  }
  for (const key of ['name', 'breed', 'ageAtIssue', 'sexStatus', 'weight']) {
    const input = fixture();
    delete input.dog[key];
    assert.ok(prepareReview(input).errors.length, key);
  }
  for (const key of ['program_type', 'amount', 'deal_currency_code', 'program_start_date', 'program_end_date']) {
    const input = fixture();
    delete input.deal.properties[key];
    assert.ok(prepareReview(input).errors.length, key);
  }
});

test('never selects the first associated contact or dog; requires exact confirmed identities', () => {
  for (const key of ['signer', 'dog', 'enrollment', 'contactId', 'dogId', 'dealId', 'enrollmentId']) {
    const input = fixture();
    delete input.confirmation[key];
    assert.ok(prepareReview(input).errors.length, key);
  }
  const input = fixture();
  input.contact = [input.contact, structuredClone(input.contact)];
  input.dog = [input.dog, structuredClone(input.dog)];
  assert.ok(prepareReview(input).errors.length);
  for (const field of ['dogId', 'dealId']) {
    const mismatched = fixture();
    mismatched.enrollment[field] = 'another-record';
    assert.ok(hasError(prepareReview(mismatched), 'selection_mismatch'));
  }
});

test('conflicting intake or deal values block issuance rather than mixing dogs', () => {
  for (const [source, key] of [
    ['contact', 'dogs_name'], ['contact', 'dog_breed'], ['contact', 'dog_age'],
    ['contact', 'dog_sex'], ['contact', 'training_program'],
    ['deal', 'dog_breed_contract'], ['deal', 'dog_age__cloned_'],
    ['deal', 'dog_color'], ['deal', 'microchip_number'], ['deal', 'dog_weight']
  ]) {
    const input = fixture();
    input[source].properties[key] = 'Conflicting synthetic value';
    const review = prepareReview(input);
    assert.ok(hasError(review, 'conflict'), key);
    assert.equal(review.conflicts.length, 1, key);
    assert.throws(() => issueSnapshot(review, approval));
  }
});

test('intake is not used as a fallback and missing proposed properties are not read', () => {
  const input = fixture();
  delete input.dog.name;
  input.deal.properties.tk9_dog_name = 'Untrusted fallback';
  assert.ok(hasError(prepareReview(input), 'required', 'dog.name'));
  const confirmed = fixture();
  confirmed.contact.properties = {
    ...confirmed.contact.properties, dogs_name: '', dog_breed: '', dog_age: '', dog_sex: ''
  };
  assert.deepEqual(prepareReview(confirmed).errors, []);
});

test('exact verified enumerations are accepted; approximate labels are rejected', () => {
  for (const value of PROGRAM_TYPES) {
    const input = fixture();
    input.deal.properties.program_type = input.contact.properties.training_program = value;
    assert.deepEqual(prepareReview(input).errors, []);
  }
  for (const value of SEX_STATUSES) {
    const input = fixture();
    input.dog.sexStatus = input.contact.properties.dog_sex = value;
    assert.deepEqual(prepareReview(input).errors, []);
  }
  const input = fixture();
  input.dog.sexStatus = 'female';
  input.deal.properties.program_type = 'Board & Train - 2 Week';
  assert.ok(hasError(prepareReview(input), 'invalid_enum', 'dog.sexStatus'));
  assert.ok(hasError(prepareReview(input), 'invalid_enum', 'enrollment.programType'));
});

test('date-only remains unchanged and datetime requires an explicit valid display zone', () => {
  const input = fixture();
  const original = prepareReview(input);
  input.endDateTimeZone = 'Pacific/Honolulu';
  const shifted = prepareReview(input);
  assert.equal(original.data.enrollment.startDate, shifted.data.enrollment.startDate);
  assert.equal(shifted.data.enrollment.startDate, '2028-02-29');
  assert.equal(shifted.data.enrollment.endDateTime, input.deal.properties.program_end_date);
  assert.notEqual(original.data.adobeFields.program_end_date, shifted.data.adobeFields.program_end_date);
  for (const zone of ['', undefined, 'Not/AZone']) {
    input.endDateTimeZone = zone;
    assert.ok(hasError(prepareReview(input), 'explicit_timezone_required'));
  }
});

test('invalid dates, ambiguous timestamps, impossible offsets and reversed dates are rejected', () => {
  for (const value of ['2027-02-29', '2028-02-30', '2028-02-29T00:00:00Z', 1835395200000]) {
    const input = fixture();
    input.deal.properties.program_start_date = value;
    assert.ok(hasError(prepareReview(input), 'invalid_date_only'), String(value));
  }
  for (const value of [
    '2028-03-15', '2028-03-15T18:30:00', '2028-02-30T18:30:00Z',
    '2028-03-15T24:00:00Z', '2028-03-15T18:30:00+14:30'
  ]) {
    const input = fixture();
    input.deal.properties.program_end_date = value;
    assert.ok(hasError(prepareReview(input), 'invalid_datetime'), value);
  }
  const input = fixture();
  input.deal.properties.program_end_date = '2028-02-29T01:00:00Z';
  assert.ok(hasError(prepareReview(input), 'date_order'));
  input.deal.properties.program_end_date = '2028-03-15T13:30:00-05:00';
  assert.deepEqual(prepareReview(input).errors, []);
});

test('weight units are never inferred, even when the deal has a numeric weight', () => {
  for (const unit of [undefined, '', 'lbs', 'unknown']) {
    const input = fixture();
    input.dog.weight.unit = unit;
    assert.ok(hasError(prepareReview(input), 'unknown_unit'));
  }
  for (const value of [0, -1, Infinity, 'not a weight', '']) {
    const input = fixture();
    input.dog.weight.value = value;
    assert.ok(hasError(prepareReview(input), 'invalid_weight'));
  }
  const input = fixture();
  input.dog.weight.unit = 'lb';
  assert.deepEqual(prepareReview(input).errors, []);
});

test('monetary normalization is currency-aware and never rounds imprecise values', () => {
  assert.equal(moneyToMinorUnits('0.29', 'USD'), 29);
  assert.equal(moneyToMinorUnits(12.34, 'USD'), 1234);
  assert.equal(moneyToMinorUnits('42', 'JPY'), 42);
  assert.equal(moneyToMinorUnits('1.234', 'KWD'), 1234);
  assert.equal(moneyToMinorUnits('90071992547409.91', 'USD'), Number.MAX_SAFE_INTEGER);
  for (const [value, currency] of [
    ['1.001', 'USD'], [0.1 + 0.2, 'USD'], ['1.1', 'JPY'],
    ['1', ''], ['1', 'usd'], ['1', 'ZZZ'], ['-1', 'USD'],
    ['1e3', 'USD'], ['1,000', 'USD'], [NaN, 'USD'], [Infinity, 'USD'],
    ['90071992547409.92', 'USD'], ['', 'USD'], [null, 'USD']
  ]) assert.throws(() => moneyToMinorUnits(value, currency), `${value} ${currency}`);
});

test('required deposit is independent of received summaries and must match price currency', () => {
  const input = fixture();
  delete input.requiredDeposit;
  assert.ok(prepareReview(input).errors.length);
  input.requiredDeposit = { amount: '200.00', currency: 'EUR' };
  assert.ok(hasError(prepareReview(input), 'currency_mismatch'));
  input.requiredDeposit = { amount: '2000.00', currency: 'USD' };
  assert.ok(hasError(prepareReview(input), 'deposit_exceeds_price'));
  input.requiredDeposit = { amount: '0', currency: 'USD' };
  input.deal.properties.deposit_paid_amount = '1234.56';
  input.deal.properties.balance_due = '0';
  const snapshot = issueSnapshot(prepareReview(input), approval);
  assert.equal(snapshot.approvedData.payment.receivedDepositMinor, null);
  assert.equal(snapshot.statuses.payment, 'unverified');
  assert.equal(snapshot.statuses.providerSigning, 'not_sent');
  assert.equal(snapshot.statuses.googleDriveArchive, 'not_started');
});

test('issuance requires a genuine valid review, approval and pinned template', () => {
  const review = prepareReview(fixture());
  assert.throws(() => issueSnapshot({ errors: [], data: review.data }, approval));
  assert.throws(() => issueSnapshot(review));
  assert.throws(() => issueSnapshot(review, { ...approval, approved: false }));
  assert.throws(() => issueSnapshot(review, { ...approval, templateVersion: '' }));
  assert.throws(() => issueSnapshot(review, { ...approval, templateId: '' }));
});

test('approved snapshot and template are detached and deeply immutable', () => {
  const input = fixture();
  const template = { ...approval };
  const review = prepareReview(input);
  const snapshot = issueSnapshot(review, template);
  const before = JSON.stringify(snapshot);
  input.contact.properties.firstname = 'Changed later';
  input.dog.weight.value = 99;
  input.deal.properties.amount = '9999.00';
  input.requiredDeposit.amount = '999.00';
  template.templateVersion = 'v2';
  assert.equal(JSON.stringify(snapshot), before);
  assert.notEqual(snapshot.approvedData, review.data);
  assert.throws(() => { snapshot.approvedData.owner.firstName = 'Mutation'; }, TypeError);
  assert.throws(() => { snapshot.approvedData.dog.weight.unit = 'lb'; }, TypeError);
  assert.throws(() => { snapshot.template.version = 'v3'; }, TypeError);
  assert.throws(() => { snapshot.archiveReferences.push('https://example.invalid'); }, TypeError);
});

test('only allowlisted proposed fields are emitted; signing and optional consent stay blank', () => {
  const input = fixture();
  Object.assign(input.contact.properties, {
    signature: 'DO NOT COPY', initials: 'DO NOT COPY',
    signed_at: 'DO NOT COPY', optional_consent: true
  });
  const snapshot = issueSnapshot(prepareReview(input), approval);
  assert.deepEqual(Object.keys(snapshot.approvedData.adobeFields).sort(), [
    'owner_first_name', 'owner_last_name', 'owner_email', 'owner_phone', 'owner_address',
    'owner_city', 'owner_state', 'owner_zip', 'dog_name', 'dog_breed', 'dog_color',
    'dog_weight', 'dog_sex', 'dog_microchip_number', 'dog_age', 'training_program',
    'program_start_date', 'program_end_date'
  ].sort());
  assert.ok(!JSON.stringify(snapshot).includes('DO NOT COPY'));
  assert.deepEqual(snapshot.archiveReferences, []);
});
