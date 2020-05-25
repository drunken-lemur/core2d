import {
  BaseBehavior,
  BaseGame,
  BaseInput,
  BaseScene,
  BaseView,
  Bounds,
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
  updateSec: 0.2,
  startSnakeSize: 3,
  worldSize: Size.valueOf(20, 15)
};

class Apple extends Entity {
  private static View = class View extends BaseView<Apple> {
    draw(d: IDrawer, dt: number) {
      const { x, y, w, h } = this.parent
        .cloneBounds()
        .multiplyPosition(Config.cellSize);

      d.translate(w / 2, h / 2)
        .beginPath()
        .ellipse(x, y, w / 2, h / 2, 0, 0, 2 * Math.PI)
        .closePath()
        .fill();

      return this;
    }
  };

  constructor() {
    super();

    this.setSize(Config.cellSize)
      .setView(new Apple.View(this))
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
  private static Behavior = class extends BaseBehavior<GameScene> {
    private readonly delay = new Delay(Config.updateSec);

    update(dt: number) {
      const { delay } = this;
      if (delay.update(dt).isDone) {
        delay.add(-delay.delay);

        this.parent.apple.plusPosition(1, 0);

        super.update(dt);
      }

      return this;
    }
  };

  private readonly apple: Apple;

  constructor(game: SnakeGame) {
    super(game);

    this.apple = new Apple().setPosition(
      Bounds.random(game.screen)
        .dividePosition(Config.cellSize)
        .floorPosition()
    );

    this.setStyle({ fillStyle: Color.Blue })
      .setBehavior(new GameScene.Behavior(this))
      .add(this.apple);
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

    setTimeout(this.stop, 10 * Second);
  }
}
