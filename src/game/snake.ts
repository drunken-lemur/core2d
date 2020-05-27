import {
  BaseBehavior,
  BaseGame,
  BaseScene,
  BaseView,
  Color,
  Delay,
  Direction,
  Entity,
  IBoundsData,
  IDrawer,
  IGame,
  IPointData,
  IScene,
  IScreen,
  Key,
  NetView,
  Point,
  Score,
  Size
} from "core";
import { Label } from "entity";

const Config = {
  fps: 60,
  cellSize: 32,
  updateSec: 0.2,
  startSnakeSize: 4,
  worldSize: Size.valueOf(20, 15)
};

class ScoreLabel extends Label {
  style = {
    font: "20px Verdana",
    fillStyle: Color.Black
  };

  update(deltaTime: number): this {
    this.text = `Score: ${Score.get()}`;

    return super.update(deltaTime);
  }
}

class Apple extends Entity {
  private static View = class View extends BaseView<Apple> {
    draw(d: IDrawer, dt: number) {
      const { x, y, w, h } = this.parent
        .cloneBounds()
        .multiplyBounds(Config.cellSize);

      d.translate(w / 2, h / 2)
        .beginPath()
        .ellipse(x, y, w / 2, h / 2, 0, 0, 2 * Math.PI)
        .closePath()
        .fill();

      return this;
    }
  };

  style = { fillStyle: Color.random() };

  price: number;

  constructor(bounds?: IBoundsData, price = 10) {
    super(bounds);

    this.price = price;

    this.setSize(1).setView(new Apple.View(this));
  }
}

class SnakeBody extends Entity {
  private static View = class extends BaseView<SnakeBody> {
    draw(d: IDrawer, dt: number) {
      const { x, y, w, h } = this.parent
        .cloneBounds()
        .multiplyBounds(Config.cellSize);

      d.fillRect(x, y, w, h);

      return this;
    }
  };

  style = { fillStyle: "#7cff00" };

  constructor(bounds?: IBoundsData) {
    super(bounds);

    this.setView(new SnakeBody.View(this));
  }
}

class SnakeHead extends SnakeBody {
  style = { fillStyle: "#3e7f00" };
}

class Snake extends Entity {
  private static Behavior = class extends BaseBehavior<Snake> {
    update(dt: number) {
      this.parent.move();

      return this;
    }
  };

  direction: Direction;
  style = { noTranslate: true };
  private body: SnakeBody[] = [];

  constructor(length: number, direction: Direction = Direction.random(true)) {
    super();

    this.direction = direction;

    this.setSize(1)
      .createBody(length)
      .setBehavior(new Snake.Behavior(this));
  }

  private createBody = (length: number) => {
    const head = new SnakeHead(this);

    this.add(head).body.push(head);
    [...Array(Math.max(0, length - 1))].forEach(this.grow);

    return this;
  };

  grow = () => {
    const bodyPart = new SnakeBody(this);

    this.add(bodyPart).body.push(bodyPart);

    return this;
  };

  private move = () => {
    const parent = this.parent!;

    // todo: move here align logic

    let prevPosition: IPointData = this.body[0]
      .clonePosition()
      .plus(Direction.getDeltaPoint(this.direction));

    this.body.forEach(bodyPart => {
      const tmp = bodyPart.getPosition();

      bodyPart.x = (prevPosition.x + parent.w) % parent.w;
      bodyPart.y = (prevPosition.y + parent.h) % parent.h;

      prevPosition = tmp;
    });

    return this;
  };

  setPosition = (x: number | IPointData, y?: number) => {
    return this.forEach(body => body.setPosition(x, y));
  };
}

class GameOverScene extends BaseScene {
  style = { fillStyle: Color.Red };
}

class GameScene extends BaseScene {
  private static Behavior = class extends BaseBehavior<GameScene> {
    private readonly delay = new Delay(Config.updateSec);

    constructor(scene: GameScene) {
      super(scene);

      const { gameGroup, apple, snake } = scene;

      gameGroup
        .setSize(scene)
        .divideSize(Config.cellSize)
        .floorSize();

      apple.setPosition(this.randomPosition());

      snake.setPosition(this.randomPosition()).direction = Direction.random(
        true
      );

      Score.reset();
    }

    update(dt: number) {
      const { delay } = this;

      if (delay.update(dt).isDone) {
        delay.add(-delay.delay);

        this.processInput();

        // if (this.isGameOver()) this.onGameOver();
        if (this.isEatApple()) this.onEatApple();

        this.parent.children.forEach(c => c.update(dt));
      }

      return this;
    }

    private processInput = () => {
      const { game, snake } = this.parent;
      const { isKeyHold } = game.input;

      if (isKeyHold(Key.ArrowUp)) snake.direction = Direction.North;
      if (isKeyHold(Key.ArrowRight)) snake.direction = Direction.East;
      if (isKeyHold(Key.ArrowDown)) snake.direction = Direction.South;
      if (isKeyHold(Key.ArrowLeft)) snake.direction = Direction.West;
      if (isKeyHold(Key.Escape)) game.scene = new GameScene(game);
      if (isKeyHold(Key.Enter)) game.stop();

      return this;
    };

    private isEmptyPosition = (position: IPointData, ignoreHead = false) => {
      // noinspection JSUnusedLocalSymbols
      let [head, ...body] = this.parent.snake.values;

      if (!ignoreHead) {
        body = this.parent.snake.values;
      }

      return !body.filter(snakeBody => snakeBody.eqPosition(position)).length;
    };

    private randomPosition = () => {
      return Point.random(this.parent.gameGroup.w, this.parent.gameGroup.h)
        .floor()
        .get();
    };

    private placeApple = () => {
      let position = this.randomPosition();

      while (!this.isEmptyPosition(position)) {
        position = this.randomPosition();
      }

      this.parent.apple
        .setPosition(position)
        .setStyle({ fillStyle: Color.random() });

      return this;
    };

    private isEatApple = () => {
      const { snake, apple } = this.parent;

      return apple.eqPosition(snake.values[0]);
    };

    private isGameOver = () => {
      const [head] = this.parent.snake.values;

      return !this.isEmptyPosition(head, true);
    };

    private onEatApple = () => {
      const { apple, snake } = this.parent;

      Score.add(apple.price);
      snake.grow();

      this.placeApple();
    };

    private onGameOver = () => {
      const { game } = this.parent;

      game.scene = new GameOverScene(game);
    };
  };

  private readonly apple: Apple;
  private readonly snake: Snake;
  private readonly gameGroup: Entity;

  style = { fillStyle: Color.White, strokeStyle: Color.Gray };

  constructor(game: IGame) {
    super(game);

    this.gameGroup = new Entity();
    this.gameGroup.setStyle({ fillStyle: "#cccccc99" });

    this.apple = new Apple();

    this.snake = new Snake(Config.startSnakeSize);

    const view = new NetView(this, Size.valueOf(Config.cellSize)); // todo: remove after debug

    this.setView(view)
      .setBehavior(new GameScene.Behavior(this))
      .add(this.gameGroup.add(this.apple, this.snake), new ScoreLabel());
  }

  update(dt: number) {
    this.behavior.update(dt);

    return this;
  }
}

export class SnakeGame extends BaseGame {
  scene: IScene;

  constructor(screen: IScreen) {
    super(screen, Config.fps);

    this.scene = new GameScene(this);

    // setTimeout(this.stop, 1 * Second); // todo: remove auto stop
  }
}
