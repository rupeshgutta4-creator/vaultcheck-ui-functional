'use strict';

const { FeatureService } = require('../server/modules/feature');

describe('Vortex Feature Store As-Of Joins', () => {
  let featureService;

  beforeEach(() => {
    featureService = new FeatureService();
  });

  test('registers feature values with explicit timestamps', () => {
    const entry = featureService.registerFeature('min_entropy_threshold', 48, '2026-01-01T00:00:00.000Z', { author: 'sec-eng' });
    expect(entry).toBeDefined();
    expect(entry.name).toBe('min_entropy_threshold');
    expect(entry.value).toBe(48);
    expect(entry.timestamp).toBe('2026-01-01T00:00:00.000Z');
  });

  test('performs point-in-time as-of joins correctly', () => {
    // Feature 1 evolved across three dates
    featureService.registerFeature('password_min_len', 8, '2026-01-01T00:00:00.000Z');
    featureService.registerFeature('password_min_len', 12, '2026-03-01T00:00:00.000Z');
    featureService.registerFeature('password_min_len', 16, '2026-06-01T00:00:00.000Z');

    // Feature 2 registered in February
    featureService.registerFeature('require_symbols', true, '2026-02-01T00:00:00.000Z');

    // As of mid-January: only password_min_len = 8 should exist
    const janJoin = featureService.asOfJoin('2026-01-15T00:00:00.000Z', ['password_min_len', 'require_symbols']);
    expect(janJoin.features.password_min_len.value).toBe(8);
    expect(janJoin.missing).toContain('require_symbols');

    // As of mid-April: password_min_len = 12 and require_symbols = true
    const aprJoin = featureService.asOfJoin('2026-04-15T00:00:00.000Z', ['password_min_len', 'require_symbols']);
    expect(aprJoin.features.password_min_len.value).toBe(12);
    expect(aprJoin.features.require_symbols.value).toBe(true);

    // As of July: password_min_len = 16
    const julJoin = featureService.asOfJoin('2026-07-01T00:00:00.000Z', ['password_min_len']);
    expect(julJoin.features.password_min_len.value).toBe(16);
  });

  test('supports fallback default values for missing features', () => {
    const join = featureService.asOfJoin(
      '2026-01-01T00:00:00.000Z',
      ['non_existent_feature'],
      { defaultValues: { non_existent_feature: 'DEFAULT_POLICY' } }
    );
    expect(join.missing).toContain('non_existent_feature');
    expect(join.features.non_existent_feature.value).toBe('DEFAULT_POLICY');
    expect(join.features.non_existent_feature.fallback).toBe(true);
  });

  test('diffAsOf calculates state differences between two points in time', () => {
    featureService.registerFeature('block_sequential', false, '2026-01-01T00:00:00.000Z');
    featureService.registerFeature('block_sequential', true, '2026-05-01T00:00:00.000Z');

    const diff = featureService.diffAsOf('2026-02-01T00:00:00.000Z', '2026-06-01T00:00:00.000Z', ['block_sequential']);
    expect(diff.changedCount).toBe(1);
    expect(diff.changes.block_sequential).toEqual({ from: false, to: true });
  });
});
