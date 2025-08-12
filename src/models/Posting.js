export default class Posting {
  constructor(accountId, amount, type) {
    if (!accountId) {
      throw new Error('accountId is required');
    }
    if (amount <= 0) {
      throw new Error('amount must be positive');
    }
    if (type !== 'debit' && type !== 'credit') {
      throw new Error("type must be 'debit' or 'credit'");
    }
    this.accountId = accountId;
    this.amount = amount;
    this.type = type;
    Object.freeze(this);
  }
}
