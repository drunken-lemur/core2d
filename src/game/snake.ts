import {
  BaseBehavior,
  BaseGame,
  BaseInput,
  BaseScene,
  BaseView,
  Color,
  Delay,
  Direction,
  Entity,
  IDelay,
  IDrawer,
  IInput,
  IPointData,
  IScene,
  IScreen,
  Second,
  Size
} from "core";

const Config = {
  cellSize: 32,
  updateSec: 0.5,
  startSnakeSize: 3,
  worldSize: Size.valueOf(20, 15)
};

class Apple extends Entity {
  private static View = class View extends BaseView<Apple> {
    draw(d: IDrawer, dt: number) {
      const { x, y, w, h } = this.parent
        .cloneBounds()
        .multiplyPosition(Config.cellSize);

      const r = Math.floor((w + h) / 4);

      d.translate(r, r)
        .beginPath()
        .arc(x, y, r, 0, 2 * Math.PI)
        .closePath()
        .fill();

      return this;
    }
  };

  private static Behavior = class extends BaseBehavior<Apple> {
    update(deltaTime: number) {
      this.parent.plusPosition(0.1, 0);

      return this;
    }
  };

  constructor() {
    super();

    this.setSize(Config.cellSize)
      .setView(new Apple.View(this))
      .setBehavior(new Apple.Behavior(this))
      .setStyle({ fillStyle: Color.random() });
  }
}

class SnakeBodyPart extends Entity {}

class Snake extends Entity {
  private body: SnakeBodyPart[] = [];

  constructor(point: IPointData, length: number, direction: Direction) {
    super();

    console.log({ Snake: 1 });
  }
}

class GameScene extends BaseScene {
  // private apple: Apple;
  private readonly delay: IDelay;

  constructor(game: SnakeGame) {
    super(game);

    this.delay = new Delay(Config.updateSec);

    // this.apple = new Apple().setPosition(
    //   Bounds.random(game.screen)
    //     .dividePosition(Config.cellSize)
    //     .floorPosition()
    // );

    this.setStyle({ fillStyle: Color.Blue });

    this.add(new Apple());
  }
}

export class SnakeGame extends BaseGame {
  private static FPS = 60;
  input: IInput;
  scene: IScene;

  constructor(screen: IScreen) {
    super(screen, SnakeGame.FPS);

    this.input = new BaseInput();
    this.scene = new GameScene(this);

    setTimeout(this.stop, 1 * Second);
  }
}
