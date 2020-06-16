import {
  BaseBehavior,
  BaseGame,
  BaseScene,
  Bounds,
  childrenView,
  Color,
  defaultBehavior,
  Deg,
  ellipseView,
  Entity,
  IBehavior,
  IBrush,
  IBrushStyle,
  IGame,
  IPoint,
  IPointData,
  IScene,
  IScreen,
  ISizeData,
  IView,
  Key,
  moveByKeyboard,
  parentSphereBehavior,
  Point,
  Position,
  removeAfterDelayBehavior,
  Size,
  styledView,
  Unit
} from "core";
import { Score } from "lib";
import { Label, ScoreLabel } from "lib/entity";

const { PI, sin, cos, random } = Math;

const Config = {
  rockTime: 110, // approx tick count until a new asteroid gets introduced
  difficulty: 2, // how fast the game gets mor difficult
  turnFactor: 7, // how far the ship turns per frame
  thrustFactor: 0.1,
  subRockCount: 4, // how many small rocks to make on rock death
  bulletTime: 10, // ticks between bullets
  bulletSpeed: 5, // how fast the bullets move
  bulletEntropy: 100 // how much energy a bullet has before it runs out.
};

const infoLabel = new Label().setStyle({
  font: "24px Verdana",
  fillStyle: Color.White
});

// todo: move implements IRotatable to Entity & IEntity
class Rock extends Entity {
  static Small = Size.valueOf(20);
  static Medium = Size.valueOf(40);
  static Large = Size.valueOf(80);

  private static Surface = class Surface extends Entity {
    private static Edges = 36;
    private static DamageDeep = 0.2;

    parent!: Rock;
    views: IView<Surface>[] = [
      (surface, brush) => {
        const {
          w,
          h,
          parent: { rotation }
        } = surface;

        const wd2 = w / 2;
        const hd2 = h / 2;

        if (!surface.cache) {
          surface.cache = brush.getCacheBrush().setStyle(surface.style);

          const { cache } = surface;

          let angle = 0;
          const r = wd2;
          const edgeStep = 360 / Surface.Edges;
          cache.translate(wd2, hd2).beginPath();
          while (angle < 360) {
            const radius =
              r * (1 - Surface.DamageDeep) + random() * r * Surface.DamageDeep;
            angle += edgeStep + random() * edgeStep;

            const { x, y } = Point.byAngle(angle, radius);
            cache.lineTo(x, y);
          }
          cache.closePath().stroke();
        }

        brush
          .translate(-wd2, -hd2)
          .rotate(rotation)
          .translate(wd2, hd2)
          .drawCache(surface.cache, -w, -h);
      }
    ];
    style = { strokeStyle: Color.White };

    private hit: number; // average radial disparity
    private bounds: number;
    private cache!: IBrush;

    constructor(size: ISizeData) {
      super();

      this.setSize(size);

      this.hit = 0;
      this.bounds = 0;
    }
  };

  views: IView<Rock>[] = [
    styledView,
    (rock, brush) => {
      const { x, y, w, h } = rock;
      brush.translate(x + w, y + h);
    },
    childrenView
  ];
  behaviors: IBehavior<Rock>[] = [
    rock => {
      rock.rotation += rock.spin;
      rock.plusPosition(rock.velocity);
    },
    defaultBehavior,
    parentSphereBehavior
  ];
  style: IBrushStyle = { strokeStyle: Color.White, fillStyle: Color.Blue };

  private spin: number;
  private score: number;
  private rotation: number;
  private velocity: IPoint;

  constructor(size: ISizeData) {
    super();

    this.setSize(size)
      .setPosition(size.w, size.h)
      .invertPosition();

    this.rotation = 0;

    const { w } = size;

    // pick a random direction to move in and base the rotation off of speed
    const angle = random() * (PI * 2);
    this.velocity = new Point(
      sin(angle) * (6 - w / 15),
      cos(angle) * (6 - w / 15)
    );

    this.spin = random() * 0.05 * this.velocity.x;

    // associate score with size
    this.score = (5 - w / 10) * 100; // todo: magic formula

    this.add(new Rock.Surface(this));
  }
}

// todo: move implements IRotatable to Entity & IEntity
class Bullet extends Entity {
  private static Size = Size.valueOf(2);

  // todo:
  // o.entropy = BULLET_ENTROPY;
  // o.active = true;

  speed: number;
  style = { fillStyle: Color.White };
  views: IView<Bullet>[] = [ellipseView];
  behaviors: IBehavior<Bullet>[] = [
    bullet => bullet.moveByRotation(bullet.speed),
    parentSphereBehavior,
    removeAfterDelayBehavior(2)
  ];

  constructor(position: IPointData, angle: number) {
    super();

    this.r = angle;
    this.speed = Config.bulletSpeed;
    this.setSize(Bullet.Size).setPosition(position);
  }

  moveByRotation = (length: number) => {
    return this.moveToAngle(this.r, length);
  };

  moveToAngle = (angle: number, length: number, unit = Unit.deg) => {
    this.position.x += length * sin(angle * -(unit === Unit.deg ? Deg : PI));
    this.position.y += length * cos(angle * -(unit === Unit.deg ? Deg : PI));

    return this;
  };

  rotate = (angle: number, unit = Unit.deg) => {
    this.r += angle * -(unit === Unit.deg ? Deg : PI);

    return this;
  };
}

class Ship extends Entity {
  static TOGGLE = 60;
  static MAX_THRUST = 5;
  static MAX_VELOCITY = 5;

  speed: IPoint;
  alive: boolean;
  thrust: number;
  rotation: number;
  velocity: IPoint;

  views: IView<Ship>[] = [
    (ship, brush) => {
      const { x, y } = ship.clonePosition().round(); // todo: check round()

      brush.translate(x, y);

      // ship frame
      brush
        .beginPath()
        .rotate(ship.rotation * Deg)
        .moveTo(0, 10)
        .lineTo(5, -6)
        .lineTo(0, -2)
        .lineTo(-5, -6)
        .closePath()
        .stroke();

      if (ship.thrust !== 0) {
        // todo: fix it
        // flame
        brush
          .beginPath()
          .moveTo(2, 0)
          .lineTo(4, -3)
          .lineTo(2, -2)
          .lineTo(0, -5)
          .lineTo(-2, -2)
          .lineTo(-4, -3)
          .lineTo(-2, -0)
          .stroke()
          .closePath();
      }
    }
  ];
  behaviors: IBehavior<Ship>[] = [
    (ship, dt: number) => {
      // move by velocity
      ship.plusPosition(ship.velocity);

      // with thrust flicker a flame every Ship.TOGGLE frames, attenuate thrust
      if (ship.thrust > 0) {
        // todo:
        ship.thrust -= Config.thrustFactor + 0.01;
      } else {
        ship.thrust = 0;
      }
    },
    parentSphereBehavior
  ];
  style = { strokeStyle: Color.White, fillStyle: Color.Gray };

  private readonly bulletStream: Entity;

  constructor(bulletStream: Entity) {
    super();

    this.thrust = 0;
    this.alive = true;
    this.rotation = 180;
    this.speed = new Point();
    this.velocity = new Point();
    this.bulletStream = bulletStream;
  }

  fire = () => {
    // create the bullet
    this.bulletStream.add(new Bullet(this, this.rotation));

    // todo: play the shot sound
    // createjs.Sound.play("laser", { interrupt: createjs.Sound.INTERUPT_LATE });

    return this;
  };

  accelerate = () => {
    const { MAX_THRUST, MAX_VELOCITY } = Ship;

    // increase push amount for acceleration
    this.thrust += this.thrust + Config.thrustFactor;

    if (this.thrust >= MAX_THRUST) {
      this.thrust = MAX_THRUST;
    }

    // accelerate
    this.velocity.plus(
      sin(this.rotation * -Deg) * this.thrust,
      cos(this.rotation * -Deg) * this.thrust
    );

    // cap max speeds
    this.velocity.min(MAX_VELOCITY).max(-MAX_VELOCITY);
  };
}

class GameScene extends BaseScene {
  style = { fillStyle: Color.Black };
  behaviors = [
    new (class extends BaseBehavior<GameScene> {
      update(dt: number) {
        this.input()
          .firing()
          .turning()
          .thrusting()
          .newSpaceRocks()
          .shipLooping()
          .bulletMovement()
          .nested();
      }

      private input = () => {
        const {
          control,
          game: { input }
        } = this.parent;

        control.shoot = input.isKeyHold(Key.Space);
        control.left = input.isKeyHold(Key.a, Key.ArrowLeft);
        control.right = input.isKeyHold(Key.d, Key.ArrowRight);
        control.forward = input.isKeyHold(Key.w, Key.ArrowUp);

        if (input.isKeyPressed(Key.Escape)) {
          const { game } = this.parent;

          game.scene = new GameScene(game);
        }

        return this;
      };

      private firing = () => {
        const { parent: scene } = this;
        const { ship, control } = scene;

        if (scene.nextBulletTime <= 0) {
          if (ship.alive && control.shoot) ship.fire();
          scene.nextBulletTime = Config.bulletTime;
        } else {
          scene.nextBulletTime--;
        }

        return this;
      };

      private turning = () => {
        const { ship, control } = this.parent;

        if (ship.alive && control.left) {
          ship.rotation -= Config.turnFactor;
        }

        if (ship.alive && control.right) {
          ship.rotation += Config.turnFactor;
        }

        return this;
      };

      private thrusting = () => {
        const { ship, control, w, h } = this.parent;

        if (ship.alive && control.forward) {
          ship.accelerate();
        }

        return this;
      };

      private newSpaceRocks = () => {
        return this;
      };

      private shipLooping = () => {
        return this;
      };

      private bulletMovement = () => {
        return this;
      };

      private nested = () => {
        return this;
      };
    })(this),
    defaultBehavior
  ];

  private ship!: Ship;
  private nextBulletTime: number;
  private readonly rockBelt: Entity;
  private readonly gameGroup: Entity;
  private readonly bulletStream: Entity;

  private readonly control = {
    shoot: false,
    left: false,
    right: false,
    forward: false
  };

  constructor(game: IGame) {
    super(game);

    this.rockBelt = new Entity(this);
    this.gameGroup = new Entity(this);
    this.bulletStream = new Entity(this);
    this.nextBulletTime = Config.bulletTime;

    this.reset();

    const score = new ScoreLabel()
      .setStyle({
        font: "12px Verdana",
        fillStyle: Color.White
      })
      .setPosition(8);

    infoLabel
      .setStyle({ textBaseline: "middle", textAlign: "center" })
      .align(this, Position.CENTER);

    this.add(
      this.rockBelt,
      this.gameGroup,
      this.bulletStream,
      score,
      infoLabel
    );
  }

  reset = () => {
    const { rockBelt, gameGroup, bulletStream, control } = this;

    [rockBelt, gameGroup, bulletStream].forEach(group => group.clear());
    Score.reset();

    this.ship = new Ship(this.bulletStream);
    Bounds.align(this.ship, this, Position.CENTER);
    this.gameGroup.add(this.ship);
    // @ts-ignore
    Object.keys(control).forEach(key => (this.control[key] = false));

    rockBelt.add(new Rock(Rock.Large));

    return this;
  };
}

export class SpaceRockGame extends BaseGame {
  scene: IScene;

  constructor(screen: IScreen) {
    super(screen, 60);

    this.setStyle();

    this.scene = new GameScene(this);

    // setTimeout(this.stop, 100);
  }

  private setStyle = () => {
    const style = document.createElement("style");
    document.head.appendChild(style);

    style.innerText = `
      body {
        background: ${Color.Black};
      }
      
      canvas {
        top: 50%;
        left: 50%;
        position: absolute;
        border: 1px solid ${Color.White};
        transform: translate(-50%, -50%);
      }
    `;
  };
}
