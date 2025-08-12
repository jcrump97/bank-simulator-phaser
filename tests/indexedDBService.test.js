import 'fake-indexeddb/auto';
import IndexedDBService from '../src/services/IndexedDBService.js';

// polyfill structuredClone for older environments
if (typeof global.structuredClone !== 'function') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

test('saves and loads snapshot', async () => {
  const svc = new IndexedDBService('test-db');
  const data = { foo: 'bar' };
  await svc.saveSnapshot(data);
  const result = await svc.loadSnapshot();
  expect(result.version).toBe('1.0.0');
  expect(result.data).toEqual(data);
});
