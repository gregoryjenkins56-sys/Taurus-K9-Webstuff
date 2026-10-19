'use strict';

const PROGRAM_TYPES = Object.freeze([
  'Board & Train – 2 Week', 'Board & Train – 4 Week', 'Board & Train – 6 Week',
  'Private Lessons', 'Group Class', 'Detection Dog Training',
  'Personal Protection', 'Police K9 Program'
]);
const SEX_STATUSES = Object.freeze([
  'Male (Intact)', 'Male (Neutered)', 'Female (Intact)', 'Female (Spayed)'
]);
const reviews = new WeakSet();

function freeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function moneyToMinorUnits(value, currency) {
  if (!Intl.supportedValuesOf('currency').includes(currency)) {
    throw new Error('An explicit supported uppercase ISO currency code is required');
  }
  const digits = new Intl.NumberFormat('en', { style: 'currency', currency })
    .resolvedOptions().maximumFractionDigits;
  const decimal = typeof value === 'number' && Number.isFinite(value)
    ? String(value) : value;
  if (typeof decimal !== 'string' || !/^(0|[1-9]\d*)(\.\d+)?$/.test(decimal)) {
    throw new Error('Use a nonnegative decimal amount without separators or exponents');
  }
  const [whole, fraction = ''] = decimal.split('.');
  if (fraction.length > digits) throw new Error('Amount exceeds currency precision');
  const minor = BigInt(whole) * (10n ** BigInt(digits))
    + BigInt(fraction.padEnd(digits, '0') || '0');
  if (minor > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('Amount exceeds safe integer range');
  return Number(minor);
}

function dateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function dateTime(value) {
  if (typeof value !== 'string') return false;
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-](\d{2}):(\d{2}))$/.exec(value);
  return Boolean(match && dateOnly(match[1]) && +match[2] < 24
    && +match[3] < 60 && +match[4] < 60
    && (match[5] === 'Z' || (+match[6] <= 14 && +match[7] < 60
      && (+match[6] !== 14 || +match[7] === 0)))
    && Number.isFinite(Date.parse(value)));
}

function prepareReview(input = {}) {
  const errors = [];
  const warnings = [
    'Contact dog fields are intake only; confirmation is not authentication.',
    'CRM deposit_paid_amount and balance_due are unverified summaries, not payment evidence.'
  ];
  const error = (code, field) => errors.push({ code, field });
  const required = (value, field) => {
    const result = text(value);
    if (!result) error('required', field);
    return result;
  };
  const contact = input.contact || {};
  const deal = input.deal || {};
  const c = contact.properties || {};
  const d = deal.properties || {};
  const dog = input.dog || {};
  const enrollment = input.enrollment || {};
  const confirmation = input.confirmation || {};
  const ids = {
    contactId: required(contact.id, 'contact.id'),
    dealId: required(deal.id, 'deal.id'),
    dogId: required(dog.id, 'dog.id'),
    enrollmentId: required(enrollment.id, 'enrollment.id')
  };
  for (const [key, value] of Object.entries(ids)) {
    if (!value || confirmation[key] !== value) error('selection_mismatch', `confirmation.${key}`);
  }
  for (const flag of ['signer', 'dog', 'enrollment']) {
    if (confirmation[flag] !== true) error('confirmation_required', `confirmation.${flag}`);
  }
  if (enrollment.dogId !== ids.dogId) error('selection_mismatch', 'enrollment.dogId');
  if (enrollment.dealId !== ids.dealId) error('selection_mismatch', 'enrollment.dealId');

  const owner = {
    firstName: required(c.firstname, 'owner.firstName'),
    lastName: required(c.lastname, 'owner.lastName'),
    email: required(c.email, 'owner.email'),
    phone: required(c.phone, 'owner.phone'),
    address: {
      street: required(c.address, 'owner.address.street'),
      city: required(c.city, 'owner.address.city'),
      state: required(c.state, 'owner.address.state'),
      postalCode: required(c.zip, 'owner.address.postalCode')
    }
  };
  const selectedDog = {
    name: required(dog.name, 'dog.name'),
    breed: required(dog.breed, 'dog.breed'),
    color: text(dog.color),
    sexStatus: required(dog.sexStatus, 'dog.sexStatus'),
    microchipNumber: text(dog.microchipNumber)
  };
  if (!SEX_STATUSES.includes(selectedDog.sexStatus)) error('invalid_enum', 'dog.sexStatus');
  const dogAgeAtIssue = required(dog.ageAtIssue, 'agreement.dogAgeAtIssue');
  const weight = dog.weight || {};
  const weightValue = typeof weight.value === 'number' ? weight.value : Number(weight.value);
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(String(weight.value))
      || !Number.isFinite(weightValue) || weightValue <= 0) error('invalid_weight', 'dog.weight.value');
  if (!['kg', 'lb'].includes(weight.unit)) error('unknown_unit', 'dog.weight.unit');
  selectedDog.weight = { value: Number.isFinite(weightValue) ? weightValue : null, unit: text(weight.unit) };

  const conflicts = [];
  function compare(field, selected, source, value) {
    if (value !== undefined && value !== null && value !== '' && String(value).trim() !== String(selected)) {
      conflicts.push({ field, source, sourceValue: String(value), selectedValue: String(selected) });
      error('conflict', `${source}.${field}`);
    }
  }
  compare('name', selectedDog.name, 'contact', c.dogs_name);
  compare('breed', selectedDog.breed, 'contact', c.dog_breed);
  compare('ageAtIssue', dogAgeAtIssue, 'contact', c.dog_age);
  compare('sexStatus', selectedDog.sexStatus, 'contact', c.dog_sex);
  compare('breed', selectedDog.breed, 'deal', d.dog_breed_contract);
  compare('ageAtIssue', dogAgeAtIssue, 'deal', d.dog_age__cloned_);
  compare('color', selectedDog.color, 'deal', d.dog_color);
  compare('microchipNumber', selectedDog.microchipNumber, 'deal', d.microchip_number);
  if (d.dog_weight !== undefined && d.dog_weight !== null && d.dog_weight !== '') {
    const dealWeight = Number(d.dog_weight);
    if (!Number.isFinite(dealWeight) || dealWeight !== weightValue) {
      compare('weight', weightValue, 'deal', d.dog_weight);
    }
  }

  const programType = required(d.program_type, 'enrollment.programType');
  if (!PROGRAM_TYPES.includes(programType)) error('invalid_enum', 'enrollment.programType');
  compare('programType', programType, 'contact', c.training_program);
  const startDate = d.program_start_date;
  const endDateTime = d.program_end_date;
  if (!dateOnly(startDate)) error('invalid_date_only', 'enrollment.startDate');
  if (!dateTime(endDateTime)) error('invalid_datetime', 'enrollment.endDateTime');
  let endDateTimeDisplay = '';
  const timeZone = text(input.endDateTimeZone);
  try {
    if (!timeZone) throw new Error('Explicit display zone required');
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone, dateStyle: 'medium', timeStyle: 'long'
    });
    if (dateTime(endDateTime)) {
      endDateTimeDisplay = formatter.format(new Date(endDateTime));
      const localEndDate = new Intl.DateTimeFormat('en-CA', {
        timeZone, year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(new Date(endDateTime));
      if (dateOnly(startDate) && localEndDate < startDate) error('date_order', 'enrollment.endDateTime');
    }
  } catch {
    error('explicit_timezone_required', 'endDateTimeZone');
  }
  const currency = required(d.deal_currency_code, 'enrollment.currency');
  const normalize = (value, field) => {
    try {
      return moneyToMinorUnits(value, currency);
    } catch {
      error('invalid_money_or_currency', field);
      return null;
    }
  };
  const priceMinor = normalize(d.amount, 'enrollment.price');
  const deposit = input.requiredDeposit || {};
  if (deposit.currency !== currency) error('currency_mismatch', 'enrollment.requiredDeposit');
  const requiredDepositMinor = normalize(deposit.amount, 'enrollment.requiredDeposit');
  if (priceMinor !== null && requiredDepositMinor !== null && requiredDepositMinor > priceMinor) {
    error('deposit_exceeds_price', 'enrollment.requiredDeposit');
  }
  const summaries = {};
  for (const key of ['deposit_paid_amount', 'balance_due']) {
    if (d[key] !== undefined && d[key] !== null && d[key] !== '') summaries[key] = normalize(d[key], key);
  }
  const mappedEnrollment = {
    programType, startDate: typeof startDate === 'string' ? startDate : '',
    endDateTime: typeof endDateTime === 'string' ? endDateTime : '',
    endDateTimeZone: timeZone, endDateTimeDisplay,
    priceMinor, currency, requiredDepositMinor
  };
  const adobeFields = {
    owner_first_name: owner.firstName, owner_last_name: owner.lastName,
    owner_email: owner.email, owner_phone: owner.phone,
    owner_address: owner.address.street, owner_city: owner.address.city,
    owner_state: owner.address.state, owner_zip: owner.address.postalCode,
    dog_name: selectedDog.name, dog_breed: selectedDog.breed,
    dog_color: selectedDog.color,
    dog_weight: `${selectedDog.weight.value} ${selectedDog.weight.unit}`,
    dog_sex: selectedDog.sexStatus, dog_microchip_number: selectedDog.microchipNumber,
    dog_age: dogAgeAtIssue, training_program: programType,
    program_start_date: mappedEnrollment.startDate, program_end_date: endDateTimeDisplay
  };
  const review = freeze({
    errors, warnings, conflicts,
    data: {
      selection: ids, owner, dog: selectedDog, agreement: { dogAgeAtIssue },
      enrollment: mappedEnrollment, adobeFields,
      payment: { status: 'unverified', receivedDepositMinor: null, crmSummaryMinor: summaries },
      crmContext: { pipeline: text(d.pipeline), dealstage: text(d.dealstage) }
    }
  });
  reviews.add(review);
  return review;
}

function issueSnapshot(review, approval = {}) {
  if (!reviews.has(review) || review.errors.length) {
    throw new Error('A valid prepared review without blocking errors is required');
  }
  if (approval.approved !== true || !text(approval.templateId) || !text(approval.templateVersion)) {
    throw new Error('Explicit approval and template identity/version are required');
  }
  return freeze({
    schemaVersion: 1,
    template: { id: text(approval.templateId), version: text(approval.templateVersion) },
    approvedData: structuredClone(review.data),
    statuses: {
      review: 'approved', providerSigning: 'not_sent',
      payment: 'unverified', googleDriveArchive: 'not_started'
    },
    archiveReferences: []
  });
}

module.exports = { prepareReview, issueSnapshot, moneyToMinorUnits, PROGRAM_TYPES, SEX_STATUSES };
