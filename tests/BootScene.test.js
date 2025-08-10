// Minimal Phaser stub for BootScene
const PhaserStub = {
  Scene: class {},
  Geom: {
    Rectangle: class {
      constructor() {}
      static Contains() {}
    }
  }
};

global.Phaser = PhaserStub;

describe('BootScene', () => {
  let BootScene;

  beforeAll(async () => {
    BootScene = (await import('../src/scenes/BootScene.js')).default;
  });

  function createScene() {
    const scene = new BootScene();
    const graphicsMock = () => ({
      fillStyle: jest.fn().mockReturnThis(),
      fillRect: jest.fn().mockReturnThis(),
      clear: jest.fn().mockReturnThis(),
      fillRoundedRect: jest.fn().mockReturnThis(),
      setInteractive: jest.fn().mockReturnThis(),
      on: jest.fn()
    });
    const textMock = () => ({
      setOrigin: jest.fn().mockReturnThis(),
      setShadow: jest.fn()
    });

    scene.scale = { width: 800, height: 600, on: jest.fn() };
    scene.add = {
      graphics: jest.fn(() => graphicsMock()),
      text: jest.fn(() => textMock()),
      container: jest.fn(() => ({ add: jest.fn() })),
      circle: jest.fn(() => ({}))
    };
    scene.tweens = { add: jest.fn() };
    scene.cameras = { resize: jest.fn() };
    jest.spyOn(scene, 'createButton');
    return scene;
  }

  test('sets resize handler and grid size on create', () => {
    const scene = createScene();
    scene.create();

    expect(scene.scale.on).toHaveBeenCalledWith('resize', scene.resize, scene);
    expect(scene.gridSize).toBe(Math.min(scene.scale.width, scene.scale.height) / 20);
  });

  test('creates three menu buttons', () => {
    const scene = createScene();
    scene.create();

    expect(scene.createButton).toHaveBeenCalledTimes(3);
    expect(scene.createButton).toHaveBeenNthCalledWith(
      1,
      expect.any(Number),
      expect.any(Number),
      'Start Game',
      expect.any(Function)
    );
    expect(scene.createButton).toHaveBeenNthCalledWith(
      2,
      expect.any(Number),
      expect.any(Number),
      'Load Game',
      expect.any(Function)
    );
    expect(scene.createButton).toHaveBeenNthCalledWith(
      3,
      expect.any(Number),
      expect.any(Number),
      'Options',
      expect.any(Function)
    );
  });
});
