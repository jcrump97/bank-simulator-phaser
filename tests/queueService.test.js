import QueueService from '../src/services/QueueService.js';

test('customers spawn and leave with patience decay', () => {
  const cm = {
    id: 1,
    generateRandomCustomer() {
      return { id: this.id++ };
    }
  };
  const rng = { next: () => 0 }; // deterministic
  const qs = new QueueService(cm, rng, 2, 2); // spawn every 2 ticks, patience 2
  qs.tick(); //1
  qs.tick(); //2 -> spawn customer1 with patience2 then decay ->1
  expect(qs.queue.length).toBe(1);
  qs.tick(); //3 -> decay ->0 remove
  expect(qs.queue.length).toBe(0);
  qs.tick(); //4 -> spawn customer2
  const next = qs.nextCustomer();
  expect(next.id).toBe(2);
});
