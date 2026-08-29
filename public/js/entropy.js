/**
 * Entropy estimation helpers for VaultCheck.
 * All calculations run client-side.
 */
'use strict';

/**
 * Shannon entropy of a string (bits).
 * @param {string} str
 * @returns {number}
 */
function shannonEntropy(str) {
  if (!str || str.length === 0) return 0;
  const freq = Object.create(null);
  for (const ch of str) freq[ch] = (freq[ch] || 0) + 1;
  const len = str.length;
  let entropy = 0;
  for (const c of Object.keys(freq)) {
    const p = freq[c] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy * len;
}

/**
 * Estimate character pool size from observed classes.
 * @param {object} classes
 * @returns {number}
 */
function poolSize(classes) {
  let size = 0;
  if (classes.lower) size += 26;
  if (classes.upper) size += 26;
  if (classes.digit) size += 10;
  if (classes.symbol) size += 32; // conservative printable symbols
  return size || 1;
}

/**
 * Naive brute-force bits estimate: length * log2(pool).
 * @param {string} password
 * @param {object} classes
 * @returns {number}
 */
function bruteForceBits(password, classes) {
  if (!password) return 0;
  const pool = poolSize(classes);
  return password.length * Math.log2(pool);
}

/**
 * Clamp and format bits for display.
 * @param {number} bits
 * @returns {string}
 */
function formatBits(bits) {
  if (!Number.isFinite(bits) || bits <= 0) return '— bits';
  return bits.toFixed(1) + ' bits';
}

/**
 * Map bits to a qualitative strength label.
 * @param {number} bits
 * @returns {'weak'|'fair'|'strong'}
 */
function strengthFromBits(bits) {
  if (bits < 40) return 'weak';
  if (bits < 60) return 'fair';
  return 'strong';
}

/**
 * Estimate crack time in human-readable form.
 * @param {number} bits
 * @param {number} guessesPerSecond
 * @returns {string}
 */
function estimateCrackTime(bits, guessesPerSecond) {
  if (!Number.isFinite(bits) || bits <= 0) return '';
  const seconds = Math.pow(2, bits) / (guessesPerSecond || 1e10);
  if (seconds < 1) return 'Instant';
  if (seconds < 60) return Math.ceil(seconds) + ' seconds';
  if (seconds < 3600) return Math.ceil(seconds / 60) + ' minutes';
  if (seconds < 86400) return Math.ceil(seconds / 3600) + ' hours';
  if (seconds < 31536000) return Math.ceil(seconds / 86400) + ' days';
  const years = seconds / 31536000;
  if (years < 1000) return Math.ceil(years) + ' years';
  if (years < 1e6) return Math.ceil(years / 1000) + ' thousand years';
  if (years < 1e9) return Math.ceil(years / 1e6) + ' million years';
  return Math.ceil(years / 1e9) + ' billion years';
}

module.exports = {
  shannonEntropy,
  poolSize,
  bruteForceBits,
  formatBits,
  strengthFromBits,
  estimateCrackTime
};
