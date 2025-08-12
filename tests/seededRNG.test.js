import SeededRNG from '../src/utils/SeededRNG.js';
import CustomerManager from '../src/services/CustomerManager.js';

test('seeded rng reproducible', () => {
  const rng1 = new SeededRNG(123);
  const rng2 = new SeededRNG(123);
  const seq1 = [rng1.next(), rng1.next(), rng1.next()];
  const seq2 = [rng2.next(), rng2.next(), rng2.next()];
  expect(seq1).toEqual(seq2);
});

test('customer generation reproducible with same seed', () => {
  const rngA = new SeededRNG(42);
  const rngB = new SeededRNG(42);
  const cm1 = new CustomerManager(rngA);
  const cm2 = new CustomerManager(rngB);
  const c1 = cm1.generateRandomCustomer();
  const c2 = cm2.generateRandomCustomer();
  expect(c1.firstName).toBe(c2.firstName);
  expect(c1.lastName).toBe(c2.lastName);
});
