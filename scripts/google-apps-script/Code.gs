// Copy the prepared private version into the spreadsheet's Apps Script editor.
// Run setup once, then deploy a Web app executing as the deploying account.
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const SHARED_SECRET = 'YOUR_SHARED_SECRET';
const PROTOCOL = 'utopia-leads-v1';
const FORMS = {
  assessment: {
    tab: 'Assessment Requests',
    columns: ['submission_id', 'received_at_utc', 'form_type', 'schema_version', 'organization_type', 'organization_type_other', 'challenge_1', 'challenge_2', 'locations', 'six_month_goal', 'systems', 'systems_other', 'operational_concern', 'operational_concern_other', 'timeline', 'name', 'organization', 'work_email', 'phone', 'contact_consent', 'consent_version', 'consent_received_at_utc', 'source_path', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'lead_status', 'assigned_to', 'internal_notes'],
    ignoredOnRetry: [1, 21, 28, 29, 30],
  },
  contact: {
    tab: 'Contact Requests',
    columns: ['submission_id', 'received_at_utc', 'form_type', 'schema_version', 'name', 'work_email', 'organization', 'intent', 'message', 'contact_consent', 'consent_version', 'consent_received_at_utc', 'source_path', 'lead_status', 'internal_notes'],
    ignoredOnRetry: [1, 11, 13, 14],
  },
};

function setup() {
  if (SHARED_SECRET.length < 32 || SHARED_SECRET === 'YOUR_SHARED_SECRET') {
    throw new Error('Use the prepared private script with its connection settings.');
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    Object.keys(FORMS).forEach(function(type) {
      const form = FORMS[type];
      const headers = form.columns.concat('payload_hash');
      const sheet = spreadsheet.getSheetByName(form.tab) || spreadsheet.insertSheet(form.tab);
      if (sheet.getMaxColumns() < headers.length) {
        sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
      }
      if (sheet.getLastRow() === 0) {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      } else {
        verifyHeaders_(sheet, form);
        const hashHeader = sheet.getRange(1, headers.length).getValue();
        if (hashHeader && hashHeader !== 'payload_hash') {
          throw new Error('The extra metadata column is already in use.');
        }
        sheet.getRange(1, headers.length).setValue('payload_hash');
      }
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.hideColumns(headers.length);
    });
    SpreadsheetApp.flush();
    console.log('Assessment Requests and Contact Requests are ready.');
  } finally {
    lock.releaseLock();
  }
}

function doPost(event) {
  let request;
  try {
    request = authenticate_(event);
  } catch {
    return reply_({status: 'invalid'});
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return reply_({status: 'unavailable'});
  try {
    if (request.operation === 'rate') return reply_(rate_(request.key));
    if (!Object.prototype.hasOwnProperty.call(FORMS, request.type) ||
        !/^[0-9a-f-]{36}$/i.test(request.submissionId)) {
      return reply_({status: 'invalid'});
    }
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (request.operation === 'lookup') {
      const sheet = spreadsheet.getSheetByName(FORMS[request.type].tab);
      verifyHeaders_(sheet, FORMS[request.type]);
      const found = findRow_(sheet, request.submissionId);
      if (found) PropertiesService.getScriptProperties().deleteProperty('pending:' + request.submissionId);
      return reply_({
        status: found ? 'received' : 'checking',
        submissionId: request.submissionId,
        type: request.type,
      });
    }
    if (request.operation !== 'save') return reply_({status: 'invalid'});
    return reply_(save_(spreadsheet, request));
  } catch {
    // An interrupted write must be reconciled by ID before any further append.
    return reply_({status: 'unavailable'});
  } finally {
    lock.releaseLock();
  }
}

function authenticate_(event) {
  if (!event || !event.postData || event.postData.contents.length > 40000) throw new Error();
  const envelope = JSON.parse(event.postData.contents);
  if (typeof envelope.payload !== 'string' || !/^[0-9a-f]{64}$/.test(envelope.signature)) {
    throw new Error();
  }
  const expected = Utilities.computeHmacSha256Signature(envelope.payload, SHARED_SECRET, Utilities.Charset.UTF_8)
    .map(function(byte) { return ('0' + ((byte + 256) % 256).toString(16)).slice(-2); }).join('');
  let difference = 0;
  for (let i = 0; i < expected.length; i++) {
    difference |= expected.charCodeAt(i) ^ envelope.signature.charCodeAt(i);
  }
  if (difference !== 0) throw new Error();
  const request = JSON.parse(envelope.payload);
  if (!Number.isFinite(request.timestamp) || Math.abs(Date.now() - request.timestamp) > 300000) {
    throw new Error();
  }
  return request;
}

function save_(spreadsheet, request) {
  const form = FORMS[request.type];
  const row = request.row;
  if (!Array.isArray(row) || row.length !== form.columns.length ||
      !row.every(function(value) { return typeof value === 'string' || typeof value === 'boolean'; }) ||
      row[0] !== request.submissionId || row[2] !== request.type || !/^[0-9a-f]{64}$/.test(request.hash)) {
    return {status: 'invalid'};
  }

  const properties = PropertiesService.getScriptProperties();
  const pendingKey = 'pending:' + request.submissionId;
  // IDs are unique across both forms, including rows written by the older adapter.
  const types = Object.keys(FORMS);
  for (let i = 0; i < types.length; i++) {
    const priorType = types[i];
    const priorForm = FORMS[priorType];
    const priorSheet = spreadsheet.getSheetByName(priorForm.tab);
    verifyHeaders_(priorSheet, priorForm);
    const priorRow = findRow_(priorSheet, request.submissionId);
    if (!priorRow) continue;
    if (priorType !== request.type) return {status: 'conflict'};
    const stored = priorSheet.getRange(priorRow, 1, 1, row.length + 1).getValues()[0];
    const storedHash = stored[row.length];
    const matches = storedHash ? storedHash === request.hash : row.every(function(value, index) {
      return form.ignoredOnRetry.indexOf(index) !== -1 || String(stored[index]) === String(value);
    });
    if (!matches) return {status: 'conflict'};
    properties.deleteProperty(pendingKey);
    return {status: 'duplicate', submissionId: request.submissionId, type: request.type};
  }

  const pending = properties.getProperty(pendingKey);
  if (pending) {
    const state = JSON.parse(pending);
    if (state.hash !== request.hash || state.type !== request.type) return {status: 'conflict'};
    return {status: 'checking', submissionId: request.submissionId, type: request.type};
  }

  const sheet = spreadsheet.getSheetByName(form.tab);
  let lastReservedRow = sheet.getLastRow();
  const allProperties = properties.getProperties();
  Object.keys(allProperties).forEach(function(key) {
    if (key.indexOf('pending:') !== 0) return;
    const state = JSON.parse(allProperties[key]);
    if (state.type === request.type) lastReservedRow = Math.max(lastReservedRow, state.rowNumber);
  });
  const rowNumber = lastReservedRow + 1;
  if (rowNumber > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), rowNumber - sheet.getMaxRows());
  const range = sheet.getRange(rowNumber, 1, 1, row.length + 1);
  range.setNumberFormat('@');
  properties.setProperty(pendingKey, JSON.stringify({type: request.type, hash: request.hash, rowNumber: rowNumber}));
  // Prefix text with the Sheets literal marker so formulas and phone numbers stay text.
  const values = row.concat(request.hash).map(function(value) {
    return typeof value === 'string' && value !== '' ? "'" + value : value;
  });
  range.setValues([values]);
  SpreadsheetApp.flush();
  const persisted = range.getValues()[0];
  if (persisted[0] !== request.submissionId || persisted[row.length] !== request.hash) {
    return {status: 'checking', submissionId: request.submissionId, type: request.type};
  }
  properties.deleteProperty(pendingKey);
  return {status: 'saved', submissionId: request.submissionId, type: request.type};
}

function verifyHeaders_(sheet, form) {
  if (!sheet || sheet.getMaxColumns() < form.columns.length + 1) throw new Error();
  const actual = sheet.getRange(1, 1, 1, form.columns.length).getValues()[0];
  if (!form.columns.every(function(name, index) { return actual[index] === name; })) {
    throw new Error('Worksheet headers differ from the form schema.');
  }
}

function findRow_(sheet, id) {
  if (sheet.getLastRow() < 2) return 0;
  const match = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1)
    .createTextFinder(id).matchEntireCell(true).useRegularExpression(false).findNext();
  return match ? match.getRow() : 0;
}

function rate_(key) {
  if (!/^[0-9a-f]{64}$/.test(key)) return {status: 'invalid'};
  const properties = PropertiesService.getScriptProperties();
  const now = Date.now();
  const existing = properties.getProperties();
  let active = 0;
  Object.keys(existing).forEach(function(name) {
    if (name.indexOf('rate:') !== 0) return;
    if (JSON.parse(existing[name]).until <= now) properties.deleteProperty(name);
    else active++;
  });
  const rateKey = 'rate:' + key;
  const raw = properties.getProperty(rateKey);
  const state = raw ? JSON.parse(raw) : {count: 0, until: now + 600000};
  if (state.count >= 8 || (!raw && active >= 1000)) return {status: 'limited'};
  state.count++;
  properties.setProperty(rateKey, JSON.stringify(state));
  return {status: 'allowed'};
}

function reply_(result) {
  return ContentService.createTextOutput(JSON.stringify(Object.assign({protocol: PROTOCOL}, result)))
    .setMimeType(ContentService.MimeType.JSON);
}
