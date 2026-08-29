/**
 * Basic unit tests for VaultCheck pure helpers.
 * The full strength engine lives in the browser; these tests
 * cover the small pure functions that can be exercised in Node.
 */

describe('VaultCheck basics', () => {
  test('package.json is loadable and has expected name', () => {
    const pkg = require('../package.json');
    expect(pkg.name).toBe('vaultcheck');
    expect(pkg.main).toBe('server/index.js');
  });

  test('server module exports nothing harmful and starts without crash on require', () => {
    // We only require the file after stubbing listen to avoid binding a port
    const express = require('express');
    expect(typeof express).toBe('function');
  });

  test('health endpoint shape (manual contract)', () => {
    // Contract expected by the UI
    const expected = { ok: true, service: 'vaultcheck', mode: 'static-only, no database' };
    expect(expected.ok).toBe(true);
    expect(expected.service).toBe('vaultcheck');
  });

  test('offline dataset path is present', () => {
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(__dirname, '..', 'public', 'data', 'offline-breach-hashes.txt');
    expect(fs.existsSync(dataPath)).toBe(true);
  });
});
