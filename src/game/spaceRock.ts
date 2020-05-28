import {
  BaseBehavior,
  BaseGame,
  BaseScene,
  BaseView,
  Bounds,
  Color,
  Entity,
  IDrawer,
  IDrawerStyle,
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

const Deg = Math.PI / 180;

const Config = {
  rockTime: 110, // approx tick count until a new asteroid gets introduced
  difficulty: 2, // how fast the game gets mor difficult
  turnFactor: 7, // how far the ship turns per frame
  subRockCount: 4, // how many small rocks to make on rock death
  bulletTime: 5, // ticks between bullets
  bulletSpeed: 17, // how fast the bullets move
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

  // handle drawing a spaceRock
  // private getShape = function(size) {
  //   var angle = 0;
  //   var radius = size;
  //
  //   this.size = size;
  //   this.hit = size;
  //   this.bounds = 0;
  //
  //   //setup
  //   this.graphics.clear();
  //   this.graphics.beginStroke("#FFFFFF");
  //   this.graphics.moveTo(0, size);
  //
  //   //draw spaceRock
  //   while (angle < Math.PI * 2 - 0.5) {
  //     angle += 0.25 + (Math.random() * 100) / 500;
  //     radius = size + (size / 2) * Math.random();
  //     this.graphics.lineTo(Math.sin(angle) * radius, Math.cos(angle) * radius);
  //
  //     //track visual depiction for interaction
  //     if (radius > this.bounds) {
  //       this.bounds = radius;
  //     } //furthest point
  //
  //     this.hit = (this.hit + radius) / 2; //running average
  //   }
  //
  //   this.graphics.closePath(); // draw the last line segment back to the start point.
  //   this.hit *= 1.1; //pad a bit
  // };
  //
  // // handle reinit for poolings sake
  // private activate = function(size) {
  //   this.getShape(size);
  //
  //   //pick a random direction to move in and base the rotation off of speed
  //   var angle = Math.random() * (Math.PI * 2);
  //   this.vX = Math.sin(angle) * (5 - size / 15);
  //   this.vY = Math.cos(angle) * (5 - size / 15);
  //   this.spin = (Math.random() + 0.2) * this.vX;
  //
  //   //associate score with size
  //   this.score = (5 - size / 10) * 100;
  //   this.active = true;
  // };
  //
  // // position the spaceRock so it floats on screen
  // private floatOnScreen = function(width, height) {
  //   //base bias on real estate and pick a side or top/bottom
  //   if (Math.random() * (width + height) > width) {
  //     //side; ensure velocity pushes it on screen
  //     if (this.vX > 0) {
  //       this.x = -2 * this.bounds;
  //     } else {
  //       this.x = 2 * this.bounds + width;
  //     }
  //     //randomly position along other dimension
  //     if (this.vY > 0) {
  //       this.y = Math.random() * height * 0.5;
  //     } else {
  //       this.y = Math.random() * height * 0.5 + 0.5 * height;
  //     }
  //   } else {
  //     //top/bottom; ensure velocity pushes it on screen
  //     if (this.vY > 0) {
  //       this.y = -2 * this.bounds;
  //     } else {
  //       this.y = 2 * this.bounds + height;
  //     }
  //     //randomly position along other dimension
  //     if (this.vX > 0) {
  //       this.x = Math.random() * width * 0.5;
  //     } else {
  //       this.x = Math.random() * width * 0.5 + 0.5 * width;
  //     }
  //   }
  // };
  //
  // private hitPoint = function(tX, tY) {
  //   return this.hitRadius(tX, tY, 0);
  // };
  //
  // private hitRadius = function(tX, tY, tHit) {
  //   //early returns speed it up
  //   if (tX - tHit > this.x + this.hit) {
  //     return;
  //   }
  //   if (tX + tHit < this.x - this.hit) {
  //     return;
  //   }
  //
  //   if (tY - tHit > this.y + this.hit) {
  //     return;
  //   }
  //
  //   if (tY + tHit < this.y - this.hit) {
  //     return;
  //   }
  //
  //   //now do the circle distance test
  //   return (
  //     this.hit + tHit >
  //     Math.sqrt(
  //       Math.pow(Math.abs(this.x - tX), 2) + Math.pow(Math.abs(this.y - tY), 2)
  //     )
  //   );
  // };
}

class Ship extends Entity {
  static TOGGLE = 60;
  static MAX_THRUST = 60;
  static MAX_VELOCITY = 60;

  speed: IPoint;
  rotation: number;

  style = { strokeStyle: Color.White };

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

  constructor() {
    super();

    this.rotation = 0;
    this.speed = new Point();
  }
}

class GameScene extends BaseScene {
  private control = {
    shoot: false,
    left: false,
    right: false,
    forward: false
  };

  private ship!: Ship;
  private readonly rockBelt: Entity;
  private readonly gameGroup: Entity;
  private readonly bulletStream: Entity;

  style = { fillStyle: Color.Black };

  behavior = new (class extends BaseBehavior<GameScene> {
    update(dt: number) {
      return this.input()
        .firing()
        .turning()
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
      return this;
    };

    private turning = () => {
      const { ship, control } = this.parent;

      if (ship && control.left) {
        ship.rotation -= Config.turnFactor;
      }

      if (ship && control.right) {
        ship.rotation += Config.turnFactor;
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
  })(this);

  constructor(game: IGame) {
    super(game);

    this.rockBelt = new Entity(this);
    this.gameGroup = new Entity(this);
    this.bulletStream = new Entity(this);

    this.reset();
    this.reset();

    const score = new ScoreLabel()
      .setStyle({
        font: "16px Verdana",
        fillStyle: Color.White
      })
      .setPosition(8);

    this.add(score, this.rockBelt, this.gameGroup, this.bulletStream);
  }

  reset = () => {
    const { rockBelt, gameGroup, bulletStream, control } = this;

    [rockBelt, gameGroup, bulletStream].forEach(group => group.clear());
    Score.reset();

    this.ship = new Ship();
    Bounds.align(this.ship, this, Position.CENTER);
    this.gameGroup.add(this.ship);
    // @ts-ignore
    Object.keys(control).forEach(key => (this.control[key] = false));

    return this;
  };
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
