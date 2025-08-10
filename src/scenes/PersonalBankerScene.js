export default class PersonalBankerScene extends Phaser.Scene {
  constructor() {
    super('PersonalBankerScene');
  }

  create() {
    this.add.text(10, 10, 'Personal Banker Mode', { fontSize: '32px', color: '#ffffff' });
    this.applications = [
      { type: 'loan', amount: 10000, business: true },
      { type: 'checking', business: false },
      { type: 'savings', business: true },
      { type: 'cd', term: 12, business: false }
    ];

    this.applications.forEach((app, index) => {
      const message = this.handleApplication(app);
      this.add.text(10, 60 + index * 20, message, { fontSize: '20px', color: '#ffffff' });
    });
  }

  handleApplication(app) {
    const target = app.business ? 'business' : 'personal';
    switch (app.type) {
      case 'loan':
        return `Processed ${target} loan for $${app.amount}`;
      case 'checking':
        return `Opened ${target} checking account`;
      case 'savings':
        return `Opened ${target} savings account`;
      case 'cd':
        return `Opened ${target} CD for ${app.term} months`;
      default:
        return 'Unknown application';
    }
  }
}
