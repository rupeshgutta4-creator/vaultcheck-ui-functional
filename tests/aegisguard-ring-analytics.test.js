'use strict';

const { PatternService } = require('../server/modules/pattern');
const { RiskService } = require('../server/modules/risk');

describe('AegisGuard Graph Ring Analytics', () => {
  let patternService;
  let riskService;

  beforeEach(() => {
    patternService = new PatternService();
    riskService = new RiskService();
  });

  test('detects numpad perimeter clockwise rings', () => {
    const analysis = patternService.detectRingPatterns('test14789632pass');
    expect(analysis.detected).toBe(true);
    expect(analysis.rings.length).toBeGreaterThan(0);
    expect(analysis.rings[0].ringType).toBe('numpad-perimeter-cw');
    expect(analysis.riskPenalty).toBeGreaterThan(20);
  });

  test('detects qwerty box/ring walks', () => {
    const analysis = patternService.detectRingPatterns('qwerfdsa99');
    expect(analysis.detected).toBe(true);
    expect(analysis.rings.some(r => r.ringType.startsWith('qwerty-ring'))).toBe(true);
  });

  test('reports clean when no spatial rings exist', () => {
    const analysis = patternService.detectRingPatterns('xK8$mP2!vN9@');
    expect(analysis.detected).toBe(false);
    expect(analysis.rings.length).toBe(0);
    expect(analysis.riskPenalty).toBe(0);
  });

  test('analyzes graph topological connectivity and detects cycles', () => {
    // Repeated cyclical transitions: a->b->a->b
    const cyclical = patternService.analyzeTopology('abababab');
    expect(cyclical.hasCycles).toBe(true);
    expect(cyclical.nodes).toBe(2);

    // Linear progression without return cycles: a->b->c->d
    const linear = patternService.analyzeTopology('abcdef');
    expect(linear.hasCycles).toBe(false);
  });

  test('evaluates composite ring risk in RiskService', () => {
    const patternAnalysis = patternService.detectRingPatterns('14789632qwerfdsa');
    const risk = riskService.evaluateRingRisk(patternAnalysis);

    expect(risk.riskScore).toBeGreaterThanOrEqual(50);
    expect(risk.requiresRemediation).toBe(true);
    expect(risk.factors.length).toBeGreaterThanOrEqual(1);
    expect(risk.riskLevel).toBe('HIGH');
  });
});
