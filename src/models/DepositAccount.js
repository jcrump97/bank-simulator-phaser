import Account from './Account.js';

export default class DepositAccount extends Account {
  constructor(id, name, type, balance = 0, interestRate = 0, accountNumber = null) {
    super(id, name, type, balance, accountNumber);
    this.interestRate = interestRate; // annual rate
  }

  accrueDailyInterest() {
    return this.balance * this.interestRate / 365;
  }
}
