'use strict';

const { RecommendationService } = require('../server/modules/recommendation');

describe('PulseRec Multi-Interest Recommendation Capsules', () => {
  let recService;

  beforeEach(() => {
    recService = new RecommendationService();
  });

  test('returns STRONG status when assessment is clean and robust', () => {
    const res = recService.generateCapsules({
      entropy: 75,
      findings: [],
      breachFound: false,
      policyFailures: []
    });

    expect(res.capsuleCount).toBe(0);
    expect(res.overallHealth).toBe('STRONG');
  });

  test('creates breach mitigation capsule with top priority when breach is found', () => {
    const res = recService.generateCapsules({
      entropy: 55,
      breachFound: true,
      findings: []
    });

    expect(res.capsuleCount).toBeGreaterThanOrEqual(1);
    expect(res.capsules[0].interest).toBe('breach_mitigation');
    expect(res.capsules[0].weight).toBe(100);
    expect(res.overallHealth).toBe('CRITICAL');
  });

  test('creates multi-interest capsules for composite weaknesses', () => {
    const res = recService.generateCapsules({
      entropy: 28,
      missingCharSets: ['symbols', 'uppercase'],
      breachFound: false,
      findings: [{ type: 'keyboard_walk', description: 'qwerty row detected' }],
      policyFailures: ['Minimum length 12 required']
    });

    expect(res.capsuleCount).toBe(3); // entropy, pattern, policy
    const interests = res.capsules.map(c => c.interest);
    expect(interests).toContain('entropy_enhancement');
    expect(interests).toContain('pattern_disruption');
    expect(interests).toContain('policy_compliance');
  });

  test('ranks prioritized actions by impact-to-effort ratio', () => {
    const actions = recService.getPrioritizedActions({
      entropy: 30,
      breachFound: true,
      findings: ['spatial ring walk']
    });

    expect(actions.length).toBeGreaterThan(0);
    // Highest priority score should be at index 0
    expect(actions[0].priorityScore).toBeGreaterThanOrEqual(actions[actions.length - 1].priorityScore);
    expect(actions[0].impact).toBe('CRITICAL');
  });
});
