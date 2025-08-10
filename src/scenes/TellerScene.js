export default class TellerScene extends Phaser.Scene {
  constructor() {
    super('TellerScene');
    this.balance = 0;
    this.title = null;
    this.messages = [];
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.title = this.add.text(0, 0, 'Teller Mode', { fontSize: '32px', color: '#ffffff' });
    this.customers = [
      { type: 'deposit', amount: 100 },
      { type: 'withdrawal', amount: 50 },
      { type: 'suspicious', amount: 1000 }
    ];

    this.messages = [];
    this.customers.forEach((customer) => {
      const message = this.handleCustomer(customer);
      const text = this.add.text(0, 0, message, { fontSize: '20px', color: '#ffffff' });
      this.messages.push(text);
    });

    this.reposition(width, height);
    this.scale.on('resize', this.resize, this);
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

  reposition(width, height) {
    const marginX = width * 0.02;
    const marginY = height * 0.02;
    const lineHeight = Math.min(height * 0.05, 30);

    if (this.title) {
      this.title.setFontSize(Math.min(width / 25, 32));
      this.title.setPosition(marginX, marginY);
    }

    this.messages.forEach((text, index) => {
      text.setFontSize(Math.min(width / 40, 20));
      text.setPosition(marginX, marginY + (index + 1) * lineHeight);
    });
  }

  resize(gameSize) {
    this.reposition(gameSize.width, gameSize.height);
  }
}
