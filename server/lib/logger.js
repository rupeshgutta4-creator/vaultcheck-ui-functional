/**
 * Minimal structured logger for VaultCheck server.
 * Never logs password material or hash prefixes.
 */
'use strict';

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
let currentLevel = LEVELS.info;

function setLevel(name) {
  if (LEVELS[name] !== undefined) currentLevel = LEVELS[name];
}

function log(level, msg, meta) {
  if (LEVELS[level] > currentLevel) return;
  const entry = {
    ts: new Date().toISOString(),
    level,
    msg,
    ...(meta && typeof meta === 'object' ? meta : {})
  };
  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else console.log(line);
}

module.exports = {
  setLevel,
  error: (msg, meta) => log('error', msg, meta),
  warn:  (msg, meta) => log('warn', msg, meta),
  info:  (msg, meta) => log('info', msg, meta),
  debug: (msg, meta) => log('debug', msg, meta)
};
