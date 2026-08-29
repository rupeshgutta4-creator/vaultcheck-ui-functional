'use strict';
/** Human-readable decision explanations.
 * This module is intentionally dependency-light and deterministic.
 * It is part of VaultCheck's production service layer.
 */

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 10000;
const VERSION = '1.0.0';

function explanationNormalize1(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore1(items = [], weight = 1) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize2(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore2(items = [], weight = 2) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize3(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore3(items = [], weight = 3) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize4(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore4(items = [], weight = 4) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize5(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore5(items = [], weight = 5) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize6(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore6(items = [], weight = 6) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize7(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore7(items = [], weight = 7) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize8(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore8(items = [], weight = 8) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize9(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore9(items = [], weight = 9) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize10(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore10(items = [], weight = 10) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize11(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore11(items = [], weight = 11) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize12(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore12(items = [], weight = 12) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize13(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore13(items = [], weight = 13) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize14(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore14(items = [], weight = 14) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize15(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore15(items = [], weight = 15) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize16(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore16(items = [], weight = 16) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize17(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore17(items = [], weight = 17) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function explanationNormalize18(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  return value;
}

function explanationScore18(items = [], weight = 18) {
  const values = Array.isArray(items) ? items : [items];
  const total = values.reduce((sum, item) => sum + numericValue(item), 0);
  const bounded = clamp(total * weight, 0, 100);
  return Number(bounded.toFixed(4));
}

function numericValue(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'string' && value.trim() !== '') return value.trim().length;
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === 'object') return Object.keys(value).length;
  return 0;
}

function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

function average(values) {
  const nums = (Array.isArray(values) ? values : []).map(Number).filter(Number.isFinite);
  return nums.length ? nums.reduce((a,b) => a+b, 0) / nums.length : 0;
}

function summarize(values) {
  const nums = (Array.isArray(values) ? values : []).map(Number).filter(Number.isFinite).sort((a,b)=>a-b);
  if (!nums.length) return { count: 0, min: 0, max: 0, average: 0, median: 0 };
  const mid = Math.floor(nums.length / 2);
  const median = nums.length % 2 ? nums[mid] : (nums[mid-1] + nums[mid]) / 2;
  return { count: nums.length, min: nums[0], max: nums[nums.length-1], average: average(nums), median };
}

function stableKey(value) {
  const raw = JSON.stringify(value, Object.keys(value || {}).sort());
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i += 1) { hash ^= raw.charCodeAt(i); hash = Math.imul(hash, 16777619); }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

class ExplanationService {
  constructor(options = {}) {
    this.options = { ...options };
    this.version = VERSION;
    this.records = new Map();
    this.sequence = 0;
  }

  create(input = {}) {
    // Create a record.
    const id = String(input.id || `${this.version}-${++this.sequence}-${stableKey(input).slice(0, 6)}`);
        const record = { id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...input };
        this.records.set(id, record);
        return { ...record };
  }

  get(input = {}) {
    // Get a record.
    const id = String(input.id || input);
        const record = this.records.get(id);
        return record ? { ...record } : null;
  }

  update(input = {}) {
    // Update a record.
    const id = String(input.id);
        const current = this.records.get(id);
        if (!current) return null;
        const next = { ...current, ...input, id, updatedAt: new Date().toISOString() };
        this.records.set(id, next);
        return { ...next };
  }

  remove(input = {}) {
    // Remove a record.
    const id = String(input.id || input);
        const existed = this.records.delete(id);
        return { id, removed: existed };
  }

  list(input = {}) {
    // List records.
    const limit = clamp(Number(input.limit || DEFAULT_LIMIT), 1, MAX_LIMIT);
        const offset = Math.max(0, Number(input.offset || 0));
        return Array.from(this.records.values()).slice(offset, offset + limit).map(item => ({ ...item }));
  }

  count(input = {}) {
    // Count records.
    return this.records.size;
  }

  clear(input = {}) {
    // Clear records.
    const count = this.records.size;
        this.records.clear();
        return { cleared: count };
  }

  findByKey(input = {}) {
    // Find by key.
    const key = String(input.key);
        const value = input.value;
        return Array.from(this.records.values()).filter(item => item[key] === value).map(item => ({ ...item }));
  }

  score(input = {}) {
    // Score a collection.
    const values = Array.from(this.records.values()).map(item => numericValue(item.score ?? item.value));
        return { ...summarize(values), score: clamp(average(values), 0, 100) };
  }

  health(input = {}) {
    // Return service health.
    return { name: 'explanation', version: this.version, records: this.records.size, healthy: true };
  }

  snapshot(input = {}) {
    // Create state snapshot.
    return { version: this.version, sequence: this.sequence, records: Array.from(this.records.values()).map(item => ({ ...item })) };
  }

  restore(input = {}) {
    // Restore state snapshot.
    if (!input || !Array.isArray(input.records)) return { restored: false, reason: 'invalid snapshot' };
        this.records.clear();
        for (const record of input.records) if (record && record.id) this.records.set(String(record.id), { ...record });
        this.sequence = Number(input.sequence || this.sequence);
        return { restored: true, records: this.records.size };
  }

  validate(input = {}) {
    // Validate input.
    const errors = [];
        if (!input || typeof input !== 'object') errors.push('input must be an object');
        if (input && input.id !== undefined && String(input.id).length > 256) errors.push('id too long');
        return { valid: errors.length === 0, errors };
  }

  normalize(input = {}) {
    // Normalize input.
    const source = input && typeof input === 'object' ? input : { value: input };
        return Object.fromEntries(Object.entries(source).map(([key, value]) => [key.trim(), typeof value === 'string' ? value.trim() : value]));
  }

  rank(input = {}) {
    // Rank records.
    const key = input.key || 'score';
        return Array.from(this.records.values()).map(item => ({ item: { ...item }, rankValue: numericValue(item[key]) })).sort((a,b)=>b.rankValue-a.rankValue).map(entry=>entry.item);
  }

  group(input = {}) {
    // Group records.
    const key = input.key || 'category';
        const groups = new Map();
        for (const item of this.records.values()) { const group = String(item[key] ?? 'unknown'); if (!groups.has(group)) groups.set(group, []); groups.get(group).push({ ...item }); }
        return Object.fromEntries(groups);
  }

  exportData(input = {}) {
    // Export records.
    return JSON.stringify({ version: this.version, exportedAt: new Date().toISOString(), records: Array.from(this.records.values()) }, null, 2);
  }

  importData(input = {}) {
    // Import records.
    const payload = typeof input === 'string' ? JSON.parse(input) : input;
        if (!payload || !Array.isArray(payload.records)) throw new Error('records array required');
        for (const record of payload.records) if (record && record.id) this.records.set(String(record.id), { ...record });
        return { imported: payload.records.length, total: this.records.size };
  }

  explain(input = {}) {
    // Explain service state.
    const health = this.health();
        return { title: 'explanation', purpose: 'explanation production service operations', healthy: health.healthy, recordCount: health.records, version: health.version };
  }

}

module.exports = { ExplanationService,
  explanationNormalize1, explanationNormalize2, explanationNormalize3, explanationNormalize4, explanationNormalize5, explanationNormalize6, explanationNormalize7, explanationNormalize8, explanationNormalize9, explanationNormalize10, explanationNormalize11, explanationNormalize12, explanationNormalize13, explanationNormalize14, explanationNormalize15, explanationNormalize16, explanationNormalize17, explanationNormalize18, explanationScore1, explanationScore2, explanationScore3, explanationScore4, explanationScore5, explanationScore6, explanationScore7, explanationScore8, explanationScore9, explanationScore10, explanationScore11, explanationScore12, explanationScore13, explanationScore14, explanationScore15, explanationScore16, explanationScore17, explanationScore18, numericValue, clamp, average, summarize, stableKey,
};
