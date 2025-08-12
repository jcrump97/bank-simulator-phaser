export default class QueueService {
  constructor(customerManager, rng, spawnInterval = 5, basePatience = 5) {
    this.customerManager = customerManager;
    this.rng = rng;
    this.spawnInterval = spawnInterval; // number of ticks between spawns
    this.basePatience = basePatience;
    this.tickCount = 0;
    this.queue = [];
  }

  tick() {
    this.tickCount++;
    // spawn new customer at interval
    if (this.tickCount % this.spawnInterval === 0) {
      const customer = this.customerManager.generateRandomCustomer();
      const extra = Math.floor(this.rng.next() * 3); // 0-2 extra patience
      customer.patience = this.basePatience + extra;
      this.queue.push(customer);
    }

    // decay patience
    this.queue.forEach(c => {
      c.patience -= 1;
    });
    this.queue = this.queue.filter(c => c.patience > 0);
  }

  nextCustomer() {
    return this.queue.shift() || null;
  }
}
