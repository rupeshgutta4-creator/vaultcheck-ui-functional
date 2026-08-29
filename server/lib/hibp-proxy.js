/**
 * Have I Been Pwned k-anonymity range proxy helper.
 * Only ever receives a 5-character SHA-1 prefix.
 * Never logs or stores the prefix.
 */
'use strict';

const https = require('https');

const HIBP_RANGE_URL = 'https://api.pwnedpasswords.com/range/';
const USER_AGENT = 'VaultCheck-Local-Proxy/1.0';

/**
 * Fetch the range response for a given 5-char hex prefix.
 * @param {string} prefix - Exactly 5 hexadecimal characters
 * @returns {Promise<string>} Raw response body (hash suffixes + counts)
 */
function fetchRange(prefix) {
  return new Promise((resolve, reject) => {
    if (!/^[0-9A-Fa-f]{5}$/.test(prefix)) {
      return reject(new Error('Invalid prefix: must be exactly 5 hex characters'));
    }
    const url = HIBP_RANGE_URL + prefix.toUpperCase();
    const req = https.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Add-Padding': 'true'
      },
      timeout: 8000
    }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HIBP responded with ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('HIBP request timed out'));
    });
  });
}

/**
 * Parse HIBP range body into a Map of suffix -> count.
 * @param {string} body
 * @returns {Map<string, number>}
 */
function parseRangeBody(body) {
  const map = new Map();
  if (!body) return map;
  const lines = body.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [suffix, countStr] = trimmed.split(':');
    if (suffix && countStr) {
      const count = parseInt(countStr, 10);
      if (!Number.isNaN(count)) map.set(suffix.toUpperCase(), count);
    }
  }
  return map;
}

/**
 * Check whether a full SHA-1 hash appears in a range response.
 * @param {string} fullHash - 40-char hex SHA-1
 * @param {string} rangeBody - raw HIBP range body
 * @returns {{ found: boolean, count: number }}
 */
function checkHashInRange(fullHash, rangeBody) {
  const upper = fullHash.toUpperCase();
  const suffix = upper.slice(5);
  const map = parseRangeBody(rangeBody);
  const count = map.get(suffix) || 0;
  return { found: count > 0, count };
}

module.exports = {
  fetchRange,
  parseRangeBody,
  checkHashInRange
};
