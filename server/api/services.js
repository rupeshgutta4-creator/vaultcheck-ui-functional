'use strict';
const express = require('express');
const { listServices, createService } = require('../service-registry');
const router = express.Router();

router.get('/services', (_req, res) => res.json({ services: listServices() }));
router.get('/services/:name/health', (req, res) => {
  try { res.json(createService(req.params.name).health()); }
  catch (err) { res.status(404).json({ error: err.message }); }
});
router.post('/services/:name/validate', express.json({ limit: '32kb' }), (req, res) => {
  try { res.json(createService(req.params.name).validate(req.body)); }
  catch (err) { res.status(400).json({ error: err.message }); }
});
module.exports = router;
