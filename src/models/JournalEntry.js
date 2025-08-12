import Posting from './Posting.js';

export default class JournalEntry {
  constructor(id, description, postings = [], timestamp = new Date()) {
    this.id = id || crypto.randomUUID();
    this.description = description;
    this.timestamp = timestamp;
    this.postings = postings.map(p => p instanceof Posting ? p : new Posting(p.accountId, p.amount, p.type));
    Object.freeze(this.postings);
    this.validate();
    Object.freeze(this);
  }

  validate() {
    if (this.postings.length < 2) {
      throw new Error('JournalEntry must have at least two postings');
    }
    let debits = 0;
    let credits = 0;
    this.postings.forEach(p => {
      if (p.type === 'debit') {
        debits += p.amount;
      } else {
        credits += p.amount;
      }
    });
    if (Math.abs(debits - credits) > 0.0001) {
      throw new Error(`JournalEntry is not balanced. Debits: ${debits}, Credits: ${credits}`);
    }
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      description: this.description,
      postings: this.postings,
      timestamp: this.timestamp.toISOString()
    };
  }

  static fromJSON(data) {
    const postings = data.postings.map(p => new Posting(p.accountId, p.amount, p.type));
    return new JournalEntry(data.id, data.description, postings, new Date(data.timestamp));
  }
}
