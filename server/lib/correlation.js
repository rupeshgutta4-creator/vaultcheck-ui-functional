'use strict';
/**
 * Correlation middleware for VaultCheck.
 * Injects and propagates X-Correlation-ID and X-Request-ID across the HTTP lifecycle.
 * Securely tracks latency and status codes into the telemetry service without recording any user credentials.
 */

const crypto = require('crypto');

function createCorrelationMiddleware(telemetryService) {
  return function correlationMiddleware(req, res, next) {
    const headerVal = req.headers['x-correlation-id'] || req.headers['x-request-id'];
    const correlationId = (headerVal && typeof headerVal === 'string') ? headerVal.trim() : crypto.randomUUID();
    const requestId = crypto.randomUUID();

    req.correlationId = correlationId;
    req.requestId = requestId;

    res.setHeader('X-Correlation-ID', correlationId);
    res.setHeader('X-Request-ID', requestId);

    const startTime = process.hrtime.bigint();

    res.on('finish', () => {
      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1e6;

      if (telemetryService && typeof telemetryService.recordTrace === 'function') {
        telemetryService.recordTrace({
          correlationId,
          requestId,
          method: req.method,
          path: req.route ? req.route.path : req.path,
          statusCode: res.statusCode,
          durationMs: Number(durationMs.toFixed(2))
        });
      }
    });

    next();
  };
}

module.exports = {
  createCorrelationMiddleware
};
