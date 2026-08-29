const registry = require('../server/service-registry');

describe('service registry', () => {
  test('registers a substantial service catalog', () => {
    expect(registry.listServices().length).toBeGreaterThan(100);
  });
  test('creates services and reports health', () => {
    const service = registry.createService('security');
    expect(service.health().healthy).toBe(true);
  });
  test('service records can be created and restored', () => {
    const service = registry.createService('audit');
    const record = service.create({ id: 'event-1', severity: 10 });
    expect(service.get('event-1').id).toBe('event-1');
    const snap = service.snapshot();
    service.clear();
    service.restore(snap);
    expect(service.count()).toBe(1);
    expect(record.id).toBe('event-1');
  });
});
