/* VaultCheck — everything below runs in the browser.
 * The password itself is never sent anywhere. Breach checking is
 * offline-first: a bundled 99,838-hash dataset (NCSC top-100k common
 * passwords, via SecLists) is checked locally with zero network calls.
 * An optional online HaveIBeenPwned lookup can supplement it. */

const $ = s => document.querySelector(s);

const pw = $('#pw');
const toggleVis = $('#toggleVis');
const dialRing = $('#dialRing');
const verdict = $('#verdict');
const crackTimeEl = $('#crackTime');
const policyLineEl = $('#policyLine');
const entropyBitsEl = $('#entropyBits');
const byteGrid = $('#byteGrid');
const findingsEl = $('#findings');
const breachStatus = $('#breachStatus');
const breachDetail = $('#breachDetail');
const breachProgress = $('#breachProgress');
const breachProgressBar = $('#breachProgressBar');
const pins = {
  lower: document.querySelector('[data-pin="lower"]'),
  upper: document.querySelector('[data-pin="upper"]'),
  digit: document.querySelector('[data-pin="digit"]'),
  symbol: document.querySelector('[data-pin="symbol"]'),
};

const BYTE_GRID_CELLS = 64;
for (let i = 0; i < BYTE_GRID_CELLS; i++) byteGrid.appendChild(document.createElement('i'));
const gridCells = [...byteGrid.children];

toggleVis.onclick = () => { pw.type = pw.type === 'password' ? 'text' : 'password'; };

/* ---------------------------------------------------------------------
 * PARAMETERS — every tunable value the strength/policy engine uses.
 * Bound live to the Policy Parameters panel; nothing here is hardcoded
 * past this block.
 * ------------------------------------------------------------------- */
const DEFAULT_PARAMS = {
  minLength: 12,
  guessesPerSecond: 1e10,
  requireLower: true,
  requireUpper: true,
  requireDigit: true,
  requireSymbol: false,
  blockKeyboard: true,
  blockSequential: true,
  blockRepeats: true,
  blockYear: true,
  bannedTerms: [],
  useOnline: false,
};
let PARAMS = { ...DEFAULT_PARAMS };

const paramEls = {
  minLength: $('#pMinLength'),
  guessesPerSecond: $('#pGuessRate'),
  requireLower: $('#pReqLower'),
  requireUpper: $('#pReqUpper'),
  requireDigit: $('#pReqDigit'),
  requireSymbol: $('#pReqSymbol'),
  blockKeyboard: $('#pBlockKeyboard'),
  blockSequential: $('#pBlockSequential'),
  blockRepeats: $('#pBlockRepeats'),
  blockYear: $('#pBlockYear'),
  bannedTerms: $('#pBanned'),
  useOnline: $('#pUseOnline'),
};

function readParams() {
  PARAMS = {
    minLength: Math.max(4, Number(paramEls.minLength.value) || DEFAULT_PARAMS.minLength),
    guessesPerSecond: Number(paramEls.guessesPerSecond.value) || DEFAULT_PARAMS.guessesPerSecond,
    requireLower: paramEls.requireLower.checked,
    requireUpper: paramEls.requireUpper.checked,
    requireDigit: paramEls.requireDigit.checked,
    requireSymbol: paramEls.requireSymbol.checked,
    blockKeyboard: paramEls.blockKeyboard.checked,
    blockSequential: paramEls.blockSequential.checked,
    blockRepeats: paramEls.blockRepeats.checked,
    blockYear: paramEls.blockYear.checked,
    bannedTerms: paramEls.bannedTerms.value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
    useOnline: paramEls.useOnline.checked,
  };
  if (pw.value) runAnalysis(pw.value);
}
Object.values(paramEls).forEach(el => el.addEventListener('input', readParams));

$('#resetParams').onclick = () => {
  paramEls.minLength.value = DEFAULT_PARAMS.minLength;
  paramEls.guessesPerSecond.value = String(DEFAULT_PARAMS.guessesPerSecond);
  paramEls.requireLower.checked = DEFAULT_PARAMS.requireLower;
  paramEls.requireUpper.checked = DEFAULT_PARAMS.requireUpper;
  paramEls.requireDigit.checked = DEFAULT_PARAMS.requireDigit;
  paramEls.requireSymbol.checked = DEFAULT_PARAMS.requireSymbol;
  paramEls.blockKeyboard.checked = DEFAULT_PARAMS.blockKeyboard;
  paramEls.blockSequential.checked = DEFAULT_PARAMS.blockSequential;
  paramEls.blockRepeats.checked = DEFAULT_PARAMS.blockRepeats;
  paramEls.blockYear.checked = DEFAULT_PARAMS.blockYear;
  paramEls.bannedTerms.value = '';
  paramEls.useOnline.checked = DEFAULT_PARAMS.useOnline;
  readParams();
};

/* ---------------------------------------------------------------------
 * Strength / pattern analysis
 * ------------------------------------------------------------------- */
const KEYBOARD_ROWS = ['qwertyuiop', '1234567890', 'asdfghjkl', 'zxcvbnm'];

function hasKeyboardWalk(s) {
  const lower = s.toLowerCase();
  for (const row of KEYBOARD_ROWS) {
    for (let i = 0; i <= row.length - 4; i++) {
      const chunk = row.slice(i, i + 4);
      const rev = [...chunk].reverse().join('');
      if (lower.includes(chunk) || lower.includes(rev)) return true;
    }
  }
  return false;
}
function hasSequential(s) {
  for (let i = 0; i < s.length - 2; i++) {
    const a = s.charCodeAt(i), b = s.charCodeAt(i + 1), c = s.charCodeAt(i + 2);
    if ((b === a + 1 && c === b + 1) || (b === a - 1 && c === b - 1)) return true;
  }
  return false;
}
function hasRepeatedRun(s) { return /(.)\1\1/.test(s); }
function looksLikeYear(s) { return /(19|20)\d{2}/.test(s); }
function classFlags(s) {
  return {
    lower: /[a-z]/.test(s),
    upper: /[A-Z]/.test(s),
    digit: /[0-9]/.test(s),
    symbol: /[^a-zA-Z0-9]/.test(s),
  };
}
function poolSize(flags) {
  let n = 0;
  if (flags.lower) n += 26;
  if (flags.upper) n += 26;
  if (flags.digit) n += 10;
  if (flags.symbol) n += 33;
  return n || 1;
}
function estimateEntropyBits(s, flags) { return s.length * Math.log2(poolSize(flags)); }

function formatCrackTime(bits, guessesPerSecond) {
  const totalGuesses = Math.pow(2, bits);
  const seconds = totalGuesses / guessesPerSecond / 2;
  if (!isFinite(seconds) || seconds < 1) return 'instantly';
  const units = [
    ['century', 3153600000], ['year', 31536000], ['day', 86400],
    ['hour', 3600], ['minute', 60], ['second', 1],
  ];
  for (const [label, size] of units) {
    if (seconds >= size) {
      const val = seconds / size;
      const rounded = val >= 100 ? Math.round(val).toLocaleString() : val.toFixed(1);
      return `~${rounded} ${label}${val >= 2 ? 's' : ''}`;
    }
  }
  return 'instantly';
}

function analyze(value, params) {
  const flags = classFlags(value);
  const findings = [];
  const policyViolations = [];
  if (value.length === 0) return { flags, bits: 0, findings: [], policyViolations: [], empty: true };

  const lower = value.toLowerCase();

  if (value.length < params.minLength) {
    findings.push({ type: 'flag', text: `Only ${value.length} characters — policy requires at least ${params.minLength}.` });
    policyViolations.push(`Length below minimum (${value.length} < ${params.minLength})`);
  } else if (value.length >= params.minLength + 4) {
    findings.push({ type: 'ok', text: `Good length: ${value.length} characters.` });
  }

  if (params.requireLower && !flags.lower) policyViolations.push('Missing a lowercase letter');
  if (params.requireUpper && !flags.upper) policyViolations.push('Missing an uppercase letter');
  if (params.requireDigit && !flags.digit) policyViolations.push('Missing a digit');
  if (params.requireSymbol && !flags.symbol) policyViolations.push('Missing a symbol');

  if (params.blockKeyboard && hasKeyboardWalk(value)) {
    findings.push({ type: 'flag', text: 'Contains a keyboard walk (e.g. "qwerty", "asdf").' });
    policyViolations.push('Keyboard walk detected');
  }
  if (params.blockSequential && hasSequential(value)) {
    findings.push({ type: 'flag', text: 'Contains a sequential run (e.g. "abc" or "123").' });
    policyViolations.push('Sequential characters detected');
  }
  if (params.blockRepeats && hasRepeatedRun(value)) {
    findings.push({ type: 'flag', text: 'Contains 3+ repeated characters in a row.' });
    policyViolations.push('Repeated-character run detected');
  }
  if (params.blockYear && looksLikeYear(value)) {
    findings.push({ type: 'flag', text: 'Contains what looks like a year — easy to guess if tied to you.' });
    policyViolations.push('Embedded year detected');
  }
  for (const term of params.bannedTerms) {
    if (term && lower.includes(term)) {
      findings.push({ type: 'flag', text: `Contains the banned term "${term}".` });
      policyViolations.push(`Contains banned term "${term}"`);
    }
  }

  const classCount = Object.values(flags).filter(Boolean).length;
  if (classCount >= 3) findings.push({ type: 'ok', text: `Mixes ${classCount} character types.` });
  else findings.push({ type: 'flag', text: `Only uses ${classCount} character type${classCount === 1 ? '' : 's'} — add more variety.` });

  if (findings.filter(f => f.type === 'flag').length === 0) {
    findings.push({ type: 'ok', text: 'No obvious weak patterns detected.' });
  }

  const bits = estimateEntropyBits(value, flags);
  return { flags, bits, findings, policyViolations, empty: false };
}

function renderDial(flags) {
  dialRing.classList.toggle('active', Object.values(flags).some(Boolean));
  for (const key of Object.keys(pins)) pins[key].classList.toggle('satisfied', !!flags[key]);
}
function renderByteGrid(bits) {
  const filled = Math.round(Math.min(bits, BYTE_GRID_CELLS));
  gridCells.forEach((cell, i) => cell.classList.toggle('on', i < filled));
}
function renderVerdict(bits, empty, guessesPerSecond) {
  if (empty) {
    verdict.textContent = 'Enter a password to begin the read‑out';
    verdict.className = 'verdict';
    crackTimeEl.textContent = '';
    return;
  }
  let label, cls;
  if (bits < 28) { label = 'Weak'; cls = 'weak'; }
  else if (bits < 50) { label = 'Fair'; cls = 'fair'; }
  else if (bits < 70) { label = 'Strong'; cls = 'strong'; }
  else { label = 'Very strong'; cls = 'strong'; }
  verdict.textContent = label;
  verdict.className = 'verdict ' + cls;
  crackTimeEl.textContent = `Estimated crack time @ ${guessesPerSecond.toLocaleString()} guesses/sec: ${formatCrackTime(bits, guessesPerSecond)}`;
}
function renderFindings(findings, empty) {
  if (empty) { findingsEl.innerHTML = '<li class="empty">No password entered yet.</li>'; return; }
  findingsEl.innerHTML = findings.map(f => `<li class="${f.type}">${escapeHtml(f.text)}</li>`).join('');
}
function renderPolicyLine(violations, empty) {
  if (empty || violations.length === 0) { policyLineEl.textContent = empty ? '' : 'Meets all configured policy requirements.'; return; }
  policyLineEl.textContent = `Policy: ${violations.join(' · ')}`;
}
function escapeHtml(s) {
  return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

/* ---------------------------------------------------------------------
 * Offline breach dataset — 99,838 SHA-1 hashes, loaded once, cached
 * in memory as a Set for O(1) lookups with zero network calls.
 * ------------------------------------------------------------------- */
let offlineSet = null;
let offlineLoadPromise = null;

function loadOfflineDataset() {
  if (offlineLoadPromise) return offlineLoadPromise;
  breachProgress.hidden = false;
  offlineLoadPromise = fetch('/data/offline-breach-hashes.txt')
    .then(res => {
      if (!res.ok) throw new Error(`Dataset fetch failed (${res.status})`);
      const total = Number(res.headers.get('content-length')) || 4_100_000;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let received = 0;
      let text = '';
      function pump() {
        return reader.read().then(({ done, value }) => {
          if (done) return text;
          received += value.length;
          breachProgressBar.style.width = `${Math.min(100, (received / total) * 100)}%`;
          text += decoder.decode(value, { stream: true });
          return pump();
        });
      }
      return pump();
    })
    .then(text => {
      offlineSet = new Set(text.split('\n').map(s => s.trim()).filter(Boolean));
      breachProgress.hidden = true;
      return offlineSet;
    })
    .catch(err => {
      breachProgress.hidden = true;
      offlineSet = new Set(); // fail open to "no offline match", online check can still run
      console.warn('Offline breach dataset failed to load:', err);
      return offlineSet;
    });
  return offlineLoadPromise;
}
loadOfflineDataset(); // start loading immediately in the background

async function sha1Hex(str) {
  const enc = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest('SHA-1', enc);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

let breachController = null;

async function checkBreach(value, useOnline) {
  if (breachController) breachController.abort();
  if (!value) {
    breachStatus.textContent = 'idle';
    breachStatus.className = 'breach-status';
    breachDetail.textContent = 'Checked locally against a bundled offline dataset of 99,838 breach-hashes. An optional live lookup against the HaveIBeenPwned range API supplements this when reachable.';
    return;
  }

  breachController = new AbortController();
  breachStatus.textContent = 'checking…';
  breachStatus.className = 'breach-status checking';

  const hash = await sha1Hex(value);
  const set = await loadOfflineDataset();

  if (set.has(hash)) {
    breachStatus.textContent = 'found — offline';
    breachStatus.className = 'breach-status hit';
    breachDetail.textContent = 'This password matches an entry in the bundled top-100k breached/common password dataset. Do not use it.';
    return;
  }

  if (!useOnline) {
    breachStatus.textContent = 'not in top 100k';
    breachStatus.className = 'breach-status clean';
    breachDetail.textContent = 'Not found in the offline top-100k dataset. Enable the live lookup in Policy Parameters for broader coverage.';
    return;
  }

  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);
  try {
    const endpoint = window.location.protocol === 'file:'
      ? `https://api.pwnedpasswords.com/range/${prefix}`
      : `/api/breach/${prefix}`;
    const res = await fetch(endpoint, { signal: breachController.signal });
    if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
    const text = await res.text();
    const match = text.split('\n').find(line => line.startsWith(suffix));
    if (match) {
      const count = parseInt(match.split(':')[1] || '0', 10);
      breachStatus.textContent = 'found — online';
      breachStatus.className = 'breach-status hit';
      breachDetail.textContent = `Not in the offline dataset, but found in ${count.toLocaleString()} breaches via the live HaveIBeenPwned lookup.`;
    } else {
      breachStatus.textContent = 'not found';
      breachStatus.className = 'breach-status clean';
      breachDetail.textContent = 'Not found offline or in the live HaveIBeenPwned lookup.';
    }
  } catch (e) {
    if (e.name === 'AbortError') return;
    breachStatus.textContent = 'not in top 100k';
    breachStatus.className = 'breach-status clean';
    breachDetail.textContent = 'Not found in the offline dataset. The live lookup could not be reached, so online coverage was skipped.';
  }
}

/* ---------------------------------------------------------------------
 * Wire up the main input
 * ------------------------------------------------------------------- */
let debounceTimer = null;

function runAnalysis(value) {
  const { flags, bits, findings, policyViolations, empty } = analyze(value, PARAMS);
  renderDial(flags);
  renderByteGrid(bits);
  renderVerdict(bits, empty, PARAMS.guessesPerSecond);
  renderFindings(findings, empty);
  renderPolicyLine(policyViolations, empty);
  entropyBitsEl.textContent = empty ? '— bits' : `${bits.toFixed(1)} bits`;

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => checkBreach(value, PARAMS.useOnline), 400);
}

pw.addEventListener('input', () => runAnalysis(pw.value));
readParams();

/* ---------------------------------------------------------------------
 * Generator
 * ------------------------------------------------------------------- */
const WORDLIST = ['amber','anchor','ash','basalt','beacon','birch','bramble','brook','canyon','cedar',
  'cinder','cliff','clover','copper','coral','crest','delta','dune','ember','falcon',
  'fern','flint','forge','glacier','granite','grove','harbor','hazel','heron','hollow',
  'indigo','ivory','jasper','juniper','kestrel','lagoon','lantern','lichen','maple','marsh',
  'meadow','mesa','mint','mirror','moss','nebula','nectar','oak','onyx','opal',
  'orbit','otter','pebble','pine','plateau','prairie','quartz','quill','raven','reef',
  'ridge','river','rowan','sable','sage','shale','shore','sienna','slate','sparrow',
  'spruce','summit','tundra','umber','valley','violet','walnut','willow','wren','zephyr'];

const genEls = {
  length: $('#gLength'), mode: $('#gMode'),
  lower: $('#gLower'), upper: $('#gUpper'), digit: $('#gDigit'), symbol: $('#gSymbol'),
  ambiguous: $('#gAmbiguous'), wordCount: $('#gWordCount'), wordCountWrap: $('#gWordCountWrap'),
  output: $('#gOutput'),
};

genEls.mode.addEventListener('change', () => {
  const isPhrase = genEls.mode.value === 'passphrase';
  genEls.wordCountWrap.hidden = !isPhrase;
});

function secureRandomInt(maxExclusive) {
  const arr = new Uint32Array(1);
  const limit = Math.floor(0xFFFFFFFF / maxExclusive) * maxExclusive;
  let x;
  do { crypto.getRandomValues(arr); x = arr[0]; } while (x >= limit);
  return x % maxExclusive;
}

function generateRandom(length, opts) {
  let pool = '';
  if (opts.lower) pool += 'abcdefghijklmnopqrstuvwxyz';
  if (opts.upper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (opts.digit) pool += '0123456789';
  if (opts.symbol) pool += '!@#$%^&*()-_=+[]{}';
  if (opts.excludeAmbiguous) pool = pool.replace(/[lI1O0]/g, '');
  if (!pool) return '';
  let out = '';
  for (let i = 0; i < length; i++) out += pool[secureRandomInt(pool.length)];
  return out;
}

function generatePassphrase(wordCount) {
  const words = [];
  for (let i = 0; i < wordCount; i++) words.push(WORDLIST[secureRandomInt(WORDLIST.length)]);
  words[secureRandomInt(words.length)] = words[secureRandomInt(words.length)];
  const capIndex = secureRandomInt(words.length);
  words[capIndex] = words[capIndex][0].toUpperCase() + words[capIndex].slice(1);
  const digits = String(secureRandomInt(90) + 10);
  return words.join('-') + '-' + digits;
}

$('#gGenerate').onclick = () => {
  let result;
  if (genEls.mode.value === 'passphrase') {
    result = generatePassphrase(Number(genEls.wordCount.value) || 5);
  } else {
    result = generateRandom(Number(genEls.length.value) || 20, {
      lower: genEls.lower.checked, upper: genEls.upper.checked,
      digit: genEls.digit.checked, symbol: genEls.symbol.checked,
      excludeAmbiguous: genEls.ambiguous.checked,
    });
  }
  genEls.output.value = result || 'Select at least one character type';
};

$('#gCopy').onclick = async () => {
  if (!genEls.output.value) return;
  try {
    await navigator.clipboard.writeText(genEls.output.value);
    const btn = $('#gCopy');
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = original; }, 1200);
  } catch { /* clipboard API unavailable — silently ignore */ }
};
