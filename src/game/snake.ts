import {
  BaseBehavior,
  BaseGame,
  BaseScene,
  Color,
  defaultBehavior,
  Delay,
  Direction,
  Entity,
  IBehavior,
  IBounds,
  IBoundsData,
  IEntity,
  IGame,
  IPointData,
  IScene,
  IScreen,
  IView,
  IViewFunction,
  Key,
  netView,
  Point,
  reverseView,
  sceneView,
  Size
} from "core";
import { Score } from "lib";
import { ScoreLabel } from "lib/entity";

const dump = (label: string, ...entities: Entity[]) => {
  console.log(label);

  entities.forEach(entity => {
    console.log(entity.getPosition());
  });
};

const Config = {
  fps: 60,
  cellSize: 32,
  updateSec: 0.2,
  startSnakeSize: 4
};

class Apple extends Entity {
  price: number;

  views: IView[] = [
    (apple, brush) => {
      const { x, y, w, h } = apple
        .cloneBounds()
        .multiplyBounds(Config.cellSize);

      brush
        .translate(w / 2, h / 2)
        .beginPath()
        .ellipse(x, y, w / 2, h / 2, 0, 0, 2 * Math.PI)
        .closePath()
        .fill();
    }
  ];
  style = { fillStyle: Color.random() };

  constructor(bounds?: IBoundsData, price = 10) {
    super(bounds);

    this.price = price;

    this.setSize(1);
  }
}

const interpolateBounds = (bounds: IBounds, ratio: number) => {
  return bounds.cloneBounds().multiplyBounds(ratio);
};

class SnakeBody extends Entity {
  style = { fillStyle: "#7cff00" };

  views: IView<SnakeBody>[] = [
    (snakeBody, brush) => {
      const { x, y, w, h } = interpolateBounds(snakeBody, Config.cellSize);
      brush.fillRect(x, y, w, h);
    }
  ];
}

class SnakeHead extends SnakeBody {
  style = { fillStyle: "#3e7f00" };

  private static HeadViews: Partial<
    Record<Direction, IViewFunction<SnakeHead>>
  > = {
    [Direction.North]: (head, brush) => {
      const { x, y, w, h } = interpolateBounds(head, Config.cellSize);

      brush
        .translate(w / 2, h / 2)
        .beginPath()
        .ellipse(x, y, w / 2, h / 2, 0, 0, 2 * Math.PI);

      if (brush.fillStyle !== Color.None) brush.fill();
      if (brush.strokeStyle !== Color.None) brush.stroke();

      brush.fillRect(x - w / 2, y, w, h / 2);
    },
    [Direction.East]: (head, brush) => {
      const { x, y, w, h } = interpolateBounds(head, Config.cellSize);

      brush
        .translate(w / 2, h / 2)
        .beginPath()
        .ellipse(x, y, w / 2, h / 2, 0, 0, 2 * Math.PI);

      if (brush.fillStyle !== Color.None) brush.fill();
      if (brush.strokeStyle !== Color.None) brush.stroke();

      brush.fillRect(x - w / 2, y - h / 2, w / 2, h);
    },
    [Direction.South]: (head, brush) => {
      const { x, y, w, h } = interpolateBounds(head, Config.cellSize);

      brush
        .translate(w / 2, h / 2)
        .beginPath()
        .ellipse(x, y, w / 2, h / 2, 0, 0, 2 * Math.PI);

      if (brush.fillStyle !== Color.None) brush.fill();
      if (brush.strokeStyle !== Color.None) brush.stroke();

      brush.fillRect(x - w / 2, y - h / 2, w, h / 2);
    },
    [Direction.West]: (head, brush) => {
      const { x, y, w, h } = interpolateBounds(head, Config.cellSize);

      brush
        .translate(w / 2, h / 2)
        .beginPath()
        .ellipse(x, y, w / 2, h / 2, 0, 0, 2 * Math.PI);

      if (brush.fillStyle !== Color.None) brush.fill();
      if (brush.strokeStyle !== Color.None) brush.stroke();

      brush.fillRect(x, y - h / 2, w / 2, h);
    }
  };

  views: IView<SnakeHead>[] = [
    (head, brush, deltaTime) => {
      const snake = head.parent as Snake;
      const headView = SnakeHead.HeadViews[snake.direction];
      // const { x, y, w, h } = interpolateBounds(head, Config.cellSize);

      // brush.fillRect(x, y, w, h);

      if (headView) {
        headView(head, brush, deltaTime);
      }
    }
  ];
}

class Snake extends Entity {
  direction: Direction;
  views: IView<Snake>[] = [reverseView];
  behaviors: IBehavior<Snake>[] = [snake => snake.move()];

  private body: SnakeBody[] = [];
  private speed: IPointData = Point.valueOf(1);

  constructor(length: number, direction: Direction = Direction.random(true)) {
    super();

    this.direction = direction;

    this.setSize(1).createBody(length);
  }

  grow = () => {
    const bodyPart = new SnakeBody(this);

    this.add(bodyPart).body.push(bodyPart);

    return this;
  };

  setPosition = (x: number | IPointData, y?: number) => {
    return this.forEach(body => body.setPosition(x, y));
  };

  private createBody = (length: number) => {
    const head = new SnakeHead(this);

    this.add(head).body.push(head);
    [...Array(Math.max(0, length - 1))].forEach(this.grow);

    return this;
  };

  private move = () => {
    const { parent } = this;

    if (parent) {
      let prevPosition: IPointData = this.body[0]
        .clonePosition()
        .plus(
          new Point(Direction.getDeltaPoint(this.direction)).multiply(
            this.speed
          )
        );

      this.body.forEach(bodyPart => {
        const prev = bodyPart.getPosition();

        // move and keep in game field bounds
        bodyPart
          .setPosition(prevPosition)
          .plusPosition(parent.w, parent.h)
          .dividePosition(parent.w, parent.h, true);

        prevPosition = prev;
      });
    }
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

      this.processInput();

      delay.update(dt);
      if (delay.isDone) {
        delay.add(-delay.delay);

        // if (this.isGameOver()) this.onGameOver();
        if (this.isEatApple()) this.onEatApple();

        defaultBehavior(this.parent, dt);
      }
    }

    private processInput = () => {
      const { game, snake } = this.parent;
      const { isKeyHold, isKeyPressed } = game.input;

      if (isKeyPressed(Key.ArrowUp)) snake.direction = Direction.North;
      if (isKeyPressed(Key.ArrowRight)) snake.direction = Direction.East;
      if (isKeyPressed(Key.ArrowDown)) snake.direction = Direction.South;
      if (isKeyPressed(Key.ArrowLeft)) snake.direction = Direction.West;
      if (isKeyPressed(Key.Escape)) game.scene = new GameScene(game);
      if (isKeyPressed(Key.Enter)) game.stop();

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
  views = [sceneView, netView(Size.valueOf(Config.cellSize))];
  style = { fillStyle: Color.White, strokeStyle: Color.Black };
  private readonly apple: Apple;
  private readonly snake: Snake;
  private readonly gameGroup: Entity;

  constructor(game: IGame) {
    super(game);

    this.apple = new Apple();
    this.snake = new Snake(Config.startSnakeSize);
    this.gameGroup = new Entity().add(this.apple, this.snake);

    const scoreLabel = new ScoreLabel().setStyle({ font: "16px Verdana" });

    this.setBehaviors(new GameScene.Behavior(this)).add(
      this.gameGroup,
      scoreLabel
    );
  }
}

export class SnakeGame extends BaseGame {
  scene: IScene;

  constructor(screen: IScreen) {
    super(screen, Config.fps);

    this.scene = new GameScene(this);

    // setTimeout(this.stop, 100); // todo: remove auto stop
  }
}
