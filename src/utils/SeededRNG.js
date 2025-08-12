export default class SeededRNG {
  constructor(seed = Date.now()) {
    this.seed = seed >>> 0;
  }

  next() {
    let t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  toJSON() {
    return { seed: this.seed >>> 0 };
  }

  static fromJSON(data) {
    return new SeededRNG(data.seed);
  }
}
