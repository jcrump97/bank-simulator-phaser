const PhaserStub = {
  Scene: class {}
};

global.Phaser = PhaserStub;

describe('TellerScene', () => {
  let TellerScene;

  beforeAll(async () => {
    TellerScene = (await import('../src/scenes/TellerScene.js')).default;
  });

  test('processes deposits, withdrawals and suspicious customers', () => {
    const scene = new TellerScene();
    expect(scene.handleCustomer({ type: 'deposit', amount: 100 })).toBe('Deposited $100');
    expect(scene.balance).toBe(100);

    expect(scene.handleCustomer({ type: 'withdrawal', amount: 40 })).toBe('Withdrew $40');
    expect(scene.balance).toBe(60);

    expect(scene.handleCustomer({ type: 'suspicious', amount: 5000 })).toBe('Flagged suspicious customer with $5000');
    expect(scene.balance).toBe(60);
  });
});
