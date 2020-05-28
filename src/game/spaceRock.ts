import {
  BaseBehavior,
  BaseGame,
  BaseScene,
  BaseView,
  Bounds,
  Color,
  Entity,
  IDrawer,
  IGame,
  IPoint,
  IPointData,
  IScene,
  IScreen,
  ISizeData,
  Key,
  Point,
  Position,
  Size
} from "core";
import { Score } from "lib";
import { ScoreLabel } from "lib/entity";
import { IRotatable, Unit } from "core/rotatable";

const { PI, sin, cos } = Math;
const Deg = PI / 180;

const Config = {
  rockTime: 110, // approx tick count until a new asteroid gets introduced
  difficulty: 2, // how fast the game gets mor difficult
  turnFactor: 7, // how far the ship turns per frame
  thrustFactor: 0.1,
  subRockCount: 4, // how many small rocks to make on rock death
  bulletTime: 15, // ticks between bullets
  bulletSpeed: 5, // how fast the bullets move
  bulletEntropy: 100 // how much energy a bullet has before it runs out.
};

class Rock extends Entity {
  static SML_ROCK = 10;
  static MED_ROCK = 20;
  static LRG_ROCK = 40;

  private hit: number; // average radial disparity
  // private bounds; //visual radial size

  private spin: number;
  private score: number;
  private rotation: number;
  private velocity: IPointData;

  // private active; //is it active

  view = new (class extends BaseView<Rock> {
    draw(d: IDrawer, dt: number) {
      const { parent: self } = this;

      const angle = 0;
      const radius = new Size(self).divide(2);

      // todo: finish
      // this.size = size;
      // this.hit = size;
      // this.bounds = 0;

      return this;
    }
  })(this);

  behavior = new (class extends BaseBehavior<Rock> {
    update(dt: number) {
      const { parent: self } = this;

      self.rotation += self.spin;
      self.plusPosition(self.velocity);

      return this;
    }
  })(this);

  constructor(size: ISizeData) {
    super();

    this.hit = 0;
    this.spin = 0;
    this.score = 0;
    this.rotation = 0;
    this.velocity = Point.valueOf(1);

    this.setSize(size);
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

  view = new (class extends BaseView<Bullet> {
    draw(d: IDrawer, dt: number) {
      const { x, y, w, h } = this.parent;

      d.beginPath()
        .ellipse(x, y, w / 2, h / 2, 0, 0, 2 * PI)
        .closePath()
        .fill();

      return this;
    }
  })(this);

  behavior = new (class extends BaseBehavior<Bullet> {
    update(dt: number) {
      const { parent: bullet } = this;

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

      return this;
    }
  })(this);
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

  style = { strokeStyle: Color.White };

  fire = () => {
    this.behavior.fire();

    return this;
  };

  accelerate = () => {
    this.behavior.accelerate();

    return this;
  };

  view = new (class extends BaseView<Ship> {
    draw = (d: IDrawer, dt: number) => {
      const { parent: ship } = this;

      d.translate(ship.x, ship.y);

      // ship frame
      d.beginPath()
        .scale(1, 1)
        .rotate(ship.rotation * Deg)
        .moveTo(0, 10)
        .lineTo(5, -6)
        .lineTo(0, -2)
        .lineTo(-5, -6)
        .closePath()
        .stroke();

      // flame
      d.beginPath()
        .scale(1, 1)
        .rotate(ship.rotation * Deg)
        .moveTo(0, 10)
        .lineTo(5, -6)
        .lineTo(0, -2)
        .lineTo(-5, -6)
        .closePath();

      return this;
    };
  })(this);

  behavior = new (class extends BaseBehavior<Ship> {
    update(dt: number) {
      const { parent: ship } = this;

      // move by velocity
      ship.plusPosition(ship.velocity);

      // with thrust flicker a flame every Ship.TOGGLE frames, attenuate thrust
      if (ship.thrust > 0) {
        // todo:
        ship.thrust -= Config.thrustFactor;
      } else {
        ship.thrust = 0;
      }

      return this;
    }

    fire = () => {
      const { parent: ship } = this;

      // create the bullet
      ship.bulletStream.add(new Bullet(ship, ship.rotation));

      // todo: play the shot sound
      // createjs.Sound.play("laser", { interrupt: createjs.Sound.INTERUPT_LATE });

      return this;
    };

    accelerate = () => {
      const { MAX_THRUST, MAX_VELOCITY } = Ship;
      const { parent: ship } = this;

      // increase push amount for acceleration
      ship.thrust += ship.thrust + Config.thrustFactor;
      if (ship.thrust >= MAX_THRUST) {
        ship.thrust = MAX_THRUST;
      }

      // accelerate
      ship.velocity.plus(
        sin(ship.rotation * -Deg) * ship.thrust,
        cos(ship.rotation * -Deg) * ship.thrust
      );

      // cap max speeds
      ship.velocity.min(MAX_VELOCITY).max(-MAX_VELOCITY);
    };
  })(this);
}

class GameScene extends BaseScene {
  private ship!: Ship;
  private nextBulletTime: number;
  private readonly rockBelt: Entity;
  private readonly gameGroup: Entity;
  private readonly bulletStream: Entity;

  private control = {
    shoot: false,
    left: false,
    right: false,
    forward: false
  };

  style = { fillStyle: Color.Black };

  constructor(game: IGame) {
    super(game);

    this.rockBelt = new Entity(this);
    this.gameGroup = new Entity(this);
    this.bulletStream = new Entity(this);
    this.nextBulletTime = Config.bulletTime;

    this.reset();

    const score = new ScoreLabel()
      .setStyle({
        font: "16px Verdana",
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

    return this;
  };

  behavior = new (class extends BaseBehavior<GameScene> {
    update(dt: number) {
      return this.input()
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
  })(this);
}

export class SpaceRockGame extends BaseGame {
  scene: IScene;

  constructor(screen: IScreen) {
    super(screen, 60);

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

    this.scene = new GameScene(this);
  }
}
