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
    scene.createButton = jest.fn();
    scene.cameras = { resize: jest.fn() };
    return scene;
  }

  test('sets resize handler and grid size on create', () => {
    const scene = createScene();
    scene.create();

    expect(scene.scale.on).toHaveBeenCalledWith('resize', scene.resize, scene);
    expect(scene.gridSize).toBe(Math.min(scene.scale.width, scene.scale.height) / 20);
  });
});
