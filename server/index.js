// VaultCheck server — static file server only.
// No database, no sessions, no password ever touches this process.
// Password strength scoring and the HaveIBeenPwned breach lookup both
// happen entirely in the browser (see public/app.js).
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');

// The offline breach dataset (99,838 SHA-1 hashes, ~4MB) never changes at
// runtime, so let browsers cache it hard after the first load.
app.use('/data/offline-breach-hashes.txt', express.static(
  path.join(__dirname, '..', 'public', 'data', 'offline-breach-hashes.txt'),
  { maxAge: '30d', immutable: true }
));

app.use(express.static(path.join(__dirname, '..', 'public'), { extensions: ['html'] }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'vaultcheck', mode: 'static-only, no database' });
});

// Thin proxy for the HaveIBeenPwned k-anonymity range lookup.
// Only ever receives a 5-char hash PREFIX from the browser — never a
// password or a full hash — and just relays HIBP's response back.
// This exists purely to avoid any browser CORS/file:// edge cases;
// no data is stored or logged here.
app.get('/api/breach/:prefix', async (req, res) => {
  const prefix = String(req.params.prefix || '').toUpperCase();
  if (!/^[0-9A-F]{5}$/.test(prefix)) {
    return res.status(400).json({ error: 'Invalid prefix' });
  }
  try {
    const upstream = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'User-Agent': 'VaultCheck-DemoApp' },
    });
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Upstream returned ${upstream.status}` });
    }
    const text = await upstream.text();
    res.type('text/plain').send(text);
  } catch (err) {
    res.status(502).json({ error: 'Could not reach breach API' });
  }
});

app.listen(PORT, () => {
  console.log(`VaultCheck running at http://localhost:${PORT}`);
});
