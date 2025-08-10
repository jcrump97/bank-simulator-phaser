export default class TellerScene extends Phaser.Scene {
  constructor() {
    super('TellerScene');
    this.balance = 0;
  }

  create() {
    this.add.text(10, 10, 'Teller Mode', { fontSize: '32px', color: '#ffffff' });
    this.customers = [
      { type: 'deposit', amount: 100 },
      { type: 'withdrawal', amount: 50 },
      { type: 'suspicious', amount: 1000 }
    ];

    this.customers.forEach((customer, index) => {
      const message = this.handleCustomer(customer);
      this.add.text(10, 60 + index * 20, message, { fontSize: '20px', color: '#ffffff' });
    });
  }

  handleCustomer(customer) {
    switch (customer.type) {
      case 'deposit':
        this.balance += customer.amount;
        return `Deposited $${customer.amount}`;
      case 'withdrawal':
        this.balance -= customer.amount;
        return `Withdrew $${customer.amount}`;
      case 'suspicious':
        return `Flagged suspicious customer with $${customer.amount}`;
      default:
        return 'Unknown transaction';
    }
  }
}
