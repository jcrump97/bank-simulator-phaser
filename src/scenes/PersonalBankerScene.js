export default class PersonalBankerScene extends Phaser.Scene {
  constructor() {
    super('PersonalBankerScene');
    this.title = null;
    this.messages = [];
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.title = this.add.text(0, 0, 'Personal Banker Mode', { fontSize: '32px', color: '#ffffff' });
    this.applications = [
      { type: 'loan', amount: 10000, business: true },
      { type: 'checking', business: false },
      { type: 'savings', business: true },
      { type: 'cd', term: 12, business: false }
    ];

    this.messages = [];
    this.applications.forEach((app) => {
      const message = this.handleApplication(app);
      const text = this.add.text(0, 0, message, { fontSize: '20px', color: '#ffffff' });
      this.messages.push(text);
    });

    this.reposition(width, height);
    this.scale.on('resize', this.resize, this);
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
