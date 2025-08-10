const PhaserStub = {
  Scene: class {}
};

global.Phaser = PhaserStub;

describe('PersonalBankerScene', () => {
  let PersonalBankerScene;

  beforeAll(async () => {
    PersonalBankerScene = (await import('../src/scenes/PersonalBankerScene.js')).default;
  });

  test('handles different banking applications', () => {
    const scene = new PersonalBankerScene();
    expect(scene.handleApplication({ type: 'loan', amount: 5000, business: false })).toBe('Processed personal loan for $5000');
    expect(scene.handleApplication({ type: 'checking', business: true })).toBe('Opened business checking account');
    expect(scene.handleApplication({ type: 'savings', business: false })).toBe('Opened personal savings account');
    expect(scene.handleApplication({ type: 'cd', term: 12, business: true })).toBe('Opened business CD for 12 months');
  });
});
