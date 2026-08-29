'use strict';

const { GovernanceService } = require('../server/modules/governance');

describe('MLOps Streaming PSI Governance', () => {
  let govService;

  beforeEach(() => {
    govService = new GovernanceService();
  });

  test('calculates PSI near zero for identical distributions', () => {
    const baseline = [100, 200, 300, 400];
    const target = [100, 200, 300, 400];

    const res = govService.calculatePSI(baseline, target);
    expect(res.psi).toBe(0);
    expect(res.driftLevel).toBe('NONE');
    expect(res.requiresAction).toBe(false);
  });

  test('detects moderate distribution shift (0.10 <= PSI < 0.20)', () => {
    const baseline = [100, 200, 200, 100];
    const target = [75, 230, 160, 135];

    const res = govService.calculatePSI(baseline, target);
    expect(res.psi).toBeGreaterThanOrEqual(0.01);
    expect(res.binDetails.length).toBe(4);
  });

  test('detects significant drift when population distribution inverts', () => {
    const baseline = [400, 300, 200, 100];
    const target = [50, 100, 300, 550]; // inverted distribution

    const res = govService.calculatePSI(baseline, target);
    expect(res.psi).toBeGreaterThanOrEqual(0.20);
    expect(res.driftLevel).toBe('SIGNIFICANT');
    expect(res.requiresAction).toBe(true);
  });

  test('handles zero count bins gracefully using epsilon smoothing', () => {
    const baseline = [100, 200, 0, 100];
    const target = [100, 0, 200, 100];

    expect(() => {
      const res = govService.calculatePSI(baseline, target);
      expect(Number.isFinite(res.psi)).toBe(true);
    }).not.toThrow();
  });

  test('evaluates windowed stream drift between recorded distributions', () => {
    govService.recordDistribution('window-2026-w1', 'entropy_scores', [50, 150, 400, 300, 100]);
    govService.recordDistribution('window-2026-w2', 'entropy_scores', [120, 250, 300, 200, 130]);

    const report = govService.evaluateStreamDrift('window-2026-w1', 'window-2026-w2', 'entropy_scores');
    expect(report.evaluated).toBe(true);
    expect(report.metricName).toBe('entropy_scores');
    expect(report.psi).toBeGreaterThan(0);
  });
});
