'use strict';

const { TelemetryService } = require('../server/modules/telemetry');
const { createCorrelationMiddleware } = require('../server/lib/correlation');

describe('Core Telemetry Correlation', () => {
  let telemetry;

  beforeEach(() => {
    telemetry = new TelemetryService();
  });

  test('records traces with correlation and request identifiers', () => {
    const trace = telemetry.recordTrace({
      correlationId: 'corr-xyz-101',
      requestId: 'req-abc-202',
      method: 'GET',
      path: '/api/health',
      statusCode: 200,
      durationMs: 14.5
    });

    expect(trace).toBeDefined();
    expect(trace.id).toMatch(/^trace-/);
    expect(trace.correlationId).toBe('corr-xyz-101');
    expect(trace.statusCode).toBe(200);

    const matches = telemetry.correlate('corr-xyz-101');
    expect(matches.length).toBe(1);
    expect(matches[0].path).toBe('/api/health');
  });

  test('computes aggregate trace metrics including percentiles', () => {
    telemetry.recordTrace({ correlationId: 'c1', statusCode: 200, durationMs: 10 });
    telemetry.recordTrace({ correlationId: 'c2', statusCode: 200, durationMs: 20 });
    telemetry.recordTrace({ correlationId: 'c3', statusCode: 500, durationMs: 30 });
    telemetry.recordTrace({ correlationId: 'c4', statusCode: 200, durationMs: 40 });

    const metrics = telemetry.getTraceMetrics();
    expect(metrics.total).toBe(4);
    expect(metrics.errorCount).toBe(1);
    expect(metrics.errorRate).toBe(0.25);
    expect(metrics.avgDurationMs).toBe(25);
    expect(metrics.p95DurationMs).toBeGreaterThanOrEqual(30);
  });

  test('correlation middleware injects headers and triggers trace recording on finish', () => {
    const middleware = createCorrelationMiddleware(telemetry);

    const req = {
      headers: { 'x-correlation-id': 'incoming-corr-999' },
      method: 'GET',
      path: '/api/services'
    };

    const headersSent = {};
    const listeners = {};
    const res = {
      statusCode: 200,
      setHeader: (k, v) => { headersSent[k] = v; },
      on: (event, cb) => { listeners[event] = cb; }
    };

    let nextCalled = false;
    middleware(req, res, () => { nextCalled = true; });

    expect(nextCalled).toBe(true);
    expect(req.correlationId).toBe('incoming-corr-999');
    expect(headersSent['X-Correlation-ID']).toBe('incoming-corr-999');
    expect(headersSent['X-Request-ID']).toBeDefined();

    // Trigger finish event
    expect(typeof listeners.finish).toBe('function');
    listeners.finish();

    const traces = telemetry.correlate('incoming-corr-999');
    expect(traces.length).toBe(1);
    expect(traces[0].statusCode).toBe(200);
    expect(traces[0].durationMs).toBeGreaterThanOrEqual(0);
  });

  test('generates a new correlation ID when none is provided', () => {
    const middleware = createCorrelationMiddleware(telemetry);
    const req = { headers: {} };
    const headersSent = {};
    const res = {
      setHeader: (k, v) => { headersSent[k] = v; },
      on: () => {}
    };

    middleware(req, res, () => {});
    expect(req.correlationId).toBeDefined();
    expect(req.correlationId.length).toBeGreaterThan(10);
    expect(headersSent['X-Correlation-ID']).toBe(req.correlationId);
  });
});
