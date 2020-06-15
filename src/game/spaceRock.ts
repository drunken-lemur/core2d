import {
  BaseBehavior,
  BaseGame,
  BaseScene,
  BaseView,
  Bounds,
  Color,
  defaultBehavior,
  defaultView,
  ellipseView,
  Entity,
  IBehavior,
  IBrush,
  IBrushStyle,
  IGame,
  IPoint,
  IPointData,
  IRotatable,
  IScene,
  IScreen,
  ISizeData,
  IView,
  Key,
  Point,
  Position,
  rectView,
  RectView,
  Size,
  Unit
} from "core";
import { Score } from "lib";
import { ScoreLabel } from "lib/entity";

const { PI, sin, cos, random } = Math;
const Deg = PI / 180;

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

class Rock extends Entity {
  static Small = Size.valueOf(10);
  static Medium = Size.valueOf(20);
  static Large = Size.valueOf(40);
  private static Surface = class Surface extends Entity {
    parent!: Rock;
    views = [rectView];
    private hit: number; // average radial disparity
    private bounds: number;

    style = { strokeStyle: Color.Red, fillStyle: Color.Red };

    constructor(size: ISizeData) {
      super();

      this.setSize(size);

      this.hit = 0;
      this.bounds = 0;
    }

    // get style() {
    //   return this.parent.style;
    // }

    // set style(style: IBrushStyle) {
    //   if (this.parent) {
    //     this.parent.style = style;
    //   }
    // }

    // view = new (class extends BaseView<Surface> {
    //   private cache!: IBrush;
    //
    //   draw(b: IBrush, dt: number) {
    //     if (!this.cache) {
    //       this.cache = b.getCacheBrush();
    //
    //       const { parent: surface } = this;
    //       const size = surface.w;
    //
    //       let angle = 0;
    //       let radius = size / 2;
    //       surface.hit = size;
    //       surface.bounds = 0;
    //       this.cache.beginPath().moveTo(0, size);
    //       while (angle < PI * 2 - 0.5) {
    //         angle += 0.25 + (random() * 100) / 500;
    //         radius = size + (size / 2) * random();
    //         b.lineTo(sin(angle) * radius, cos(angle) * radius);
    //
    //         // track visual depiction for interaction // todo:
    //         if (radius > surface.bounds) {
    //           surface.bounds = radius;
    //         }
    //
    //         surface.hit = (surface.hit + radius) / 2;
    //       }
    //
    //       b.closePath().stroke();
    //
    //       surface.hit *= 1.1;
    //     }
    //
    //     b.drawImage(this.cache);
    //
    //     return this;
    //   }
    // })(this);
  };
  views: IView<Rock>[] = [
    (rock, brush) => {
      brush.rotate(rock.rotation);
    },
    defaultView
  ];
  behaviors: IBehavior<Rock>[] = [
    new (class extends BaseBehavior<Rock> {
      constructor(rock: Rock) {
        super(rock);

        const size = rock.w;

        // pick a random direction to move in and base the rotation off of speed
        const angle = random() * (PI * 2);
        rock.velocity.set(
          sin(angle) * (5 - size / 15),
          cos(angle) * (5 - size / 15)
        );
        rock.spin = random() + 0.002 * rock.velocity.x;

        // associate score with size
        rock.score = (5 - size / 10) * 100;
      }

      update(dt: number) {
        const { parent: rock } = this;

        rock.rotation += rock.spin;
        rock.plusPosition(rock.velocity);
      }
    })(this)
  ];
  private spin: number;
  private score: number;

  style: IBrushStyle = { strokeStyle: Color.White, fillStyle: Color.Blue };
  private rotation: number;
  private velocity: IPoint = new Point(1);

  constructor(size: ISizeData) {
    super();

    this.setSize(size);

    // this.spin = 0;
    this.spin = random() + 0.1; // * this.vX;
    this.score = 0;
    this.rotation = 0;
    this.velocity = new Point(1);

    this.add(new Rock.Surface(this));
  }
}

class Bullet extends Entity implements IRotatable {
  private static Size = Size.valueOf(2);

  // todo:
  // o.entropy = BULLET_ENTROPY;
  // o.active = true;

  speed: number;
  rotation: number;

  style = { fillStyle: Color.White };
  views: IView<Bullet>[] = [ellipseView];
  behaviors = [
    (bullet: Bullet) => {
      const { parent: bulletStream, x, y, w, h } = bullet;

      bullet.moveByRotation(bullet.speed);

      const w2 = w / 2;
      const h2 = h / 2;

      if (
        x + w2 < 0 ||
        x - w2 > bulletStream!.w ||
        y + h2 < 0 ||
        y - h2 > bulletStream!.h
      ) {
        bullet.remove(); // self-remove
      }
    }
  ];

  constructor(position: IPointData, angle: number) {
    super();

    this.rotation = angle;
    this.speed = Config.bulletSpeed;
    this.setSize(Bullet.Size).setPosition(position);
  }

  moveByRotation = (length: number) => {
    return this.moveToAngle(this.rotation, length);
  };

  moveToAngle = (angle: number, length: number, unit = Unit.deg) => {
    this.position.x += length * sin(angle * -(unit === Unit.deg ? Deg : PI));
    this.position.y += length * cos(angle * -(unit === Unit.deg ? Deg : PI));

    return this;
  };

  rotate = (angle: number, unit = Unit.deg) => {
    this.rotation += angle * -(unit === Unit.deg ? Deg : PI);

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

      // console.log("behaviors ship.thrust", ship.thrust);

      // with thrust flicker a flame every Ship.TOGGLE frames, attenuate thrust
      if (ship.thrust > 0) {
        // todo:
        ship.thrust -= Config.thrustFactor + 0.01;
      } else {
        ship.thrust = 0;
      }
    }
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
    // console.log("accelerate ship.thrust", this.thrust);
    this.thrust += this.thrust + Config.thrustFactor;
    // console.log("accelerate ship.thrust", this.thrust);

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

        // keep ship on screen
        ship.plusPosition(w, h).dividePosition(w, h, true);

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

    this.add(this.rockBelt, this.gameGroup, this.bulletStream, score);
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

    // rockBelt.add(new Rock(Rock.Large));

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
