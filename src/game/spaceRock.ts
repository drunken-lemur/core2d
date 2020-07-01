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
  IBoundsData,
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
  rockTime: 500, // approx tick count until a new asteroid gets introduced
  difficulty: 5, // how fast the game gets mor difficult
  turnFactor: 7, // how far the ship turns per frame
  thrustFactor: 0.1,
  subRockCount: 4, // how many small rocks to make on rock death
  bulletTime: 18, // ticks between bullets
  bulletSpeed: 5, // how fast the bullets move
  bulletEntropy: 400 // how much energy a bullet has before it runs out.
};

const infoLabel = new Label().setStyle({
  font: "24px Verdana",
  fillStyle: Color.White
});

class Rock extends Entity {
  static Small = Size.valueOf(20);
  static Medium = Size.valueOf(40);
  static Large = Size.valueOf(80);

  private static Surface = class Surface extends Entity {
    static Edges = 36;
    static DamageDeep = 0.2;

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
  private readonly score: number;
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
      sin(angle) * (5 - w / 15),
      cos(angle) * (5 - w / 15)
    );

    this.spin = random() * 0.05 * this.velocity.x;

    // associate score with size
    this.score = Math.round(w + random() * w);

    this.add(new Rock.Surface(this));
  }

  explode = () => {
    if (this.eqSize(Rock.Large)) {
      [...Array(3)].forEach(() => {
        this.parent?.add(new Rock(Rock.Medium).setPosition(this));
      });
    } else if (this.eqSize(Rock.Medium)) {
      [...Array(5)].forEach(() => {
        this.parent?.add(new Rock(Rock.Small).setPosition(this));
      });
    }

    Score.add(this.score);
    this.remove();
  };
}

class Bullet extends Entity {
  private static Size = Size.valueOf(2);

  speed: number;
  style = { fillStyle: Color.White };
  views: IView<Bullet>[] = [ellipseView];
  behaviors: IBehavior<Bullet>[] = [
    bullet => bullet.moveByRotation(bullet.speed),
    parentSphereBehavior,
    removeAfterDelayBehavior(Config.bulletEntropy / 100)
  ];

  constructor(position: IPointData, angle: number) {
    super();

    this.r = angle;
    this.speed = Config.bulletSpeed;
    this.setSize(Bullet.Size).setPosition(position);
  }
}

class Ship extends Entity {
  static TOGGLE = 60;
  static MAX_THRUST = 5;
  static MAX_VELOCITY = 5;

  speed: IPoint;
  thrust: number;
  isAlive: boolean;
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

      // flame
      if (ship.thrust !== 0) {
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
        // todo: refine accelerate & brake logic
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
    this.isAlive = true;
    this.rotation = 180;
    this.speed = new Point();
    this.velocity = new Point();
    this.bulletStream = bulletStream;

    this.setSize(5);
  }

  fire = () => {
    // create the bullet
    this.bulletStream.add(new Bullet(this, this.rotation));

    // todo: play the shot sound

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
          .rockShipCollision()
          .rockBulletCollision();
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
          if (ship.isAlive && control.shoot) ship.fire();
          scene.nextBulletTime = Config.bulletTime;
        } else {
          scene.nextBulletTime--;
        }

        return this;
      };

      private turning = () => {
        const { ship, control } = this.parent;

        if (ship.isAlive && control.left) {
          ship.rotation -= Config.turnFactor;
        }

        if (ship.isAlive && control.right) {
          ship.rotation += Config.turnFactor;
        }

        return this;
      };

      private thrusting = () => {
        const { ship, control, w, h } = this.parent;

        if (ship.isAlive && control.forward) {
          ship.accelerate();
        }

        return this;
      };

      private newSpaceRocks = () => {
        const { parent: scene } = this;

        if (scene.nextRockTime <= 0) {
          if (scene.ship.isAlive) {
            scene.timeToRock -= Config.difficulty; // reduce spaceRock spacing slowly to increase difficulty with time

            scene.rockBelt.add(new Rock(Rock.Large));

            scene.nextRockTime =
              scene.timeToRock + scene.timeToRock * Math.random();
          }
        } else {
          scene.nextRockTime--;
        }

        return this;
      };

      private rockShipCollision = () => {
        const { parent: scene } = this;

        if (scene.ship.isAlive) {
          scene.rockBelt.forEach<Rock>(rock => {
            if (scene.ship.isIntersect(rock)) {
              rock.explode();
              scene.ship.remove();

              infoLabel.text = "You're dead:  Press Esc to play again";
              // todo: scene.gameOver();
            }
          });
          // todo: watchRestart();
          // todo: play death sound
        }

        return this;
      };

      private rockBulletCollision = () => {
        const { parent: scene } = this;

        scene.bulletStream.forEach(bullet => {
          scene.rockBelt.forEach(rock => {
            if (bullet.isIntersect(rock)) {
              bullet.remove();

              (rock as Rock).explode();
            }
          });
        });

        return this;
      };
    })(this),
    defaultBehavior
  ];

  private ship!: Ship;
  private timeToRock: number;
  private nextRockTime: number;
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

    this.nextRockTime = 0;
    this.nextBulletTime = 0;
    this.timeToRock = Config.rockTime;

    this.reset();

    const score = new ScoreLabel()
      .setStyle({
        font: "12px Verdana",
        fillStyle: Color.White
      })
      .setPosition(8);

    infoLabel
      .setStyle({ textBaseline: "middle", textAlign: "center" })
      .align(this, Position.Center);

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
    Bounds.align(this.ship, this, Position.Center);
    this.gameGroup.add(this.ship);
    // @ts-ignore
    Object.keys(control).forEach(key => (this.control[key] = false));

    infoLabel.text = "";

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
