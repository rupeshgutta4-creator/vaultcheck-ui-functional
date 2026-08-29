// VaultCheck server — static file server + thin HIBP k-anonymity proxy.
// No database, no sessions, no password ever touches this process.
// Password strength scoring and the HaveIBeenPwned breach lookup both
// happen primarily in the browser (see public/app.js).
'use strict';

const express = require('express');
const path = require('path');
const { fetchRange } = require('./lib/hibp-proxy');
const log = require('./lib/logger');
const serviceApi = require('./api/services');
const { createService } = require('./service-registry');
const { createCorrelationMiddleware } = require('./lib/correlation');

const app = express();
const PORT = process.env.PORT || 3000;
const telemetry = createService('telemetry');

app.disable('x-powered-by');
app.use(createCorrelationMiddleware(telemetry));

// The offline breach dataset never changes at runtime.
app.use('/data/offline-breach-hashes.txt', express.static(
  path.join(__dirname, '..', 'public', 'data', 'offline-breach-hashes.txt'),
  { maxAge: '30d', immutable: true }
));

app.use(express.static(path.join(__dirname, '..', 'public'), { extensions: ['html'] }));
app.use('/api', serviceApi);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'vaultcheck', mode: 'static-only, no database' });
});

// Thin proxy for the HaveIBeenPwned k-anonymity range lookup.
// Only ever receives a 5-char hash PREFIX from the browser — never a
// password or a full hash — and just relays HIBP's response back.
app.get('/api/hibp/range/:prefix', async (req, res) => {
  const prefix = (req.params.prefix || '').trim();
  if (!/^[0-9A-Fa-f]{5}$/.test(prefix)) {
    return res.status(400).json({ error: 'prefix must be exactly 5 hex characters' });
  }
  try {
    const body = await fetchRange(prefix);
    res.type('text/plain').send(body);
  } catch (err) {
    log.warn('HIBP proxy failure', { message: err.message });
    res.status(502).json({ error: 'upstream unavailable' });
  }
});

app.use((err, _req, res, _next) => {
  log.error('Unhandled error', { message: err.message });
  res.status(500).json({ error: 'internal' });
});

app.listen(PORT, () => {
  log.info('VaultCheck listening', { port: PORT });
});
