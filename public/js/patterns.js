/**
 * Pattern detection for password policy scanning.
 * Runs entirely in the browser.
 */
(function (global) {
  'use strict';

  const KEYBOARD_ROWS = [
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm',
    '1234567890',
    '!@#$%^&*()'
  ];

  function hasKeyboardWalk(pw, minLen) {
    const lower = pw.toLowerCase();
    const len = minLen || 4;
    for (const row of KEYBOARD_ROWS) {
      for (let i = 0; i <= row.length - len; i++) {
        const seq = row.slice(i, i + len);
        const rev = seq.split('').reverse().join('');
        if (lower.includes(seq) || lower.includes(rev)) return true;
      }
    }
    return false;
  }

  function hasSequential(pw, minLen) {
    const len = minLen || 3;
    const s = pw.toLowerCase();
    for (let i = 0; i <= s.length - len; i++) {
      let asc = true, desc = true;
      for (let j = 1; j < len; j++) {
        if (s.charCodeAt(i + j) !== s.charCodeAt(i) + j) asc = false;
        if (s.charCodeAt(i + j) !== s.charCodeAt(i) - j) desc = false;
      }
      if (asc || desc) return true;
    }
    return false;
  }

  function hasRepeats(pw, minRun) {
    const run = minRun || 3;
    return new RegExp('(.)\\1{' + (run - 1) + ',}').test(pw);
  }

  function hasYear(pw) {
    return /(?:19|20)\d{2}/.test(pw);
  }

  function hasDictionaryWord(pw, banned) {
    const lower = pw.toLowerCase();
    if (banned && banned.length) {
      for (const term of banned) {
        if (term && lower.includes(term.toLowerCase())) return true;
      }
    }
    // very small built-in common list for offline use
    const common = ['password', 'admin', 'welcome', 'letmein', 'qwerty', 'abc123', 'iloveyou', 'monkey', 'dragon', 'master'];
    for (const w of common) {
      if (lower.includes(w)) return true;
    }
    return false;
  }

  function detectClasses(pw) {
    return {
      lower: /[a-z]/.test(pw),
      upper: /[A-Z]/.test(pw),
      digit: /[0-9]/.test(pw),
      symbol: /[^A-Za-z0-9]/.test(pw)
    };
  }

  function scanPatterns(pw, params) {
    const findings = [];
    if (!pw) return findings;
    const classes = detectClasses(pw);

    if (params.requireLower && !classes.lower) findings.push({ type: 'flag', msg: 'Missing lowercase letter' });
    if (params.requireUpper && !classes.upper) findings.push({ type: 'flag', msg: 'Missing uppercase letter' });
    if (params.requireDigit && !classes.digit) findings.push({ type: 'flag', msg: 'Missing digit' });
    if (params.requireSymbol && !classes.symbol) findings.push({ type: 'flag', msg: 'Missing symbol' });
    if (pw.length < (params.minLength || 12)) findings.push({ type: 'flag', msg: 'Shorter than minimum length (' + (params.minLength || 12) + ')' });

    if (params.blockKeyboard && hasKeyboardWalk(pw)) findings.push({ type: 'flag', msg: 'Contains keyboard walk pattern' });
    else if (params.blockKeyboard) findings.push({ type: 'ok', msg: 'Keyboard walk — none detected' });

    if (params.blockSequential && hasSequential(pw)) findings.push({ type: 'flag', msg: 'Contains sequential characters' });
    else if (params.blockSequential) findings.push({ type: 'ok', msg: 'Sequential characters — none detected' });

    if (params.blockRepeats && hasRepeats(pw)) findings.push({ type: 'flag', msg: 'Contains repeated characters' });
    else if (params.blockRepeats) findings.push({ type: 'ok', msg: 'Repeating characters — none detected' });

    if (params.blockYear && hasYear(pw)) findings.push({ type: 'flag', msg: 'Contains embedded year' });
    else if (params.blockYear) findings.push({ type: 'ok', msg: 'Embedded year — none detected' });

    if (hasDictionaryWord(pw, params.bannedTerms)) findings.push({ type: 'flag', msg: 'Contains common or banned term' });
    else findings.push({ type: 'ok', msg: 'Common / banned term — none detected' });

    return findings;
  }

  global.VaultPatterns = {
    hasKeyboardWalk,
    hasSequential,
    hasRepeats,
    hasYear,
    hasDictionaryWord,
    detectClasses,
    scanPatterns
  };
})(typeof window !== 'undefined' ? window : globalThis);
