import {
  align,
  BaseBehavior,
  BaseGame,
  BaseScene,
  BaseView,
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
  Score,
  Size
} from "core";

const Config = {
  rockTime: 110, // approx tick count until a new asteroid gets introduced
  difficulty: 2, // how fast the game gets mor difficult
  turnFactor: 7, // how far the ship turns per frame
  subRockCount: 4, // how many small rocks to make on rock death
  bulletTime: 5, // ticks between bullets
  bulletSpeed: 17, // how fast the bullets move
  bulletEntropy: 100 // how much energy a bullet has before it runs out.
};

class SpaceRock extends Entity {
  static SML_ROCK = 10;
  static MED_ROCK = 20;
  static LRG_ROCK = 40;

  private hit: number; // average radial disparity
  private bounds; //visual radial size

  private spin: number;
  private score: number;
  private rotation: number;
  private velocity: IPointData;

  private active; //is it active

  view = new (class extends BaseView<SpaceRock> {
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

  behavior = new (class extends BaseBehavior<SpaceRock> {
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
  private getShape = function(size) {
    var angle = 0;
    var radius = size;

    this.size = size;
    this.hit = size;
    this.bounds = 0;

    //setup
    this.graphics.clear();
    this.graphics.beginStroke("#FFFFFF");
    this.graphics.moveTo(0, size);

    //draw spaceRock
    while (angle < Math.PI * 2 - 0.5) {
      angle += 0.25 + (Math.random() * 100) / 500;
      radius = size + (size / 2) * Math.random();
      this.graphics.lineTo(Math.sin(angle) * radius, Math.cos(angle) * radius);

      //track visual depiction for interaction
      if (radius > this.bounds) {
        this.bounds = radius;
      } //furthest point

      this.hit = (this.hit + radius) / 2; //running average
    }

    this.graphics.closePath(); // draw the last line segment back to the start point.
    this.hit *= 1.1; //pad a bit
  };

  // handle reinit for poolings sake
  private activate = function(size) {
    this.getShape(size);

    //pick a random direction to move in and base the rotation off of speed
    var angle = Math.random() * (Math.PI * 2);
    this.vX = Math.sin(angle) * (5 - size / 15);
    this.vY = Math.cos(angle) * (5 - size / 15);
    this.spin = (Math.random() + 0.2) * this.vX;

    //associate score with size
    this.score = (5 - size / 10) * 100;
    this.active = true;
  };

  // position the spaceRock so it floats on screen
  private floatOnScreen = function(width, height) {
    //base bias on real estate and pick a side or top/bottom
    if (Math.random() * (width + height) > width) {
      //side; ensure velocity pushes it on screen
      if (this.vX > 0) {
        this.x = -2 * this.bounds;
      } else {
        this.x = 2 * this.bounds + width;
      }
      //randomly position along other dimension
      if (this.vY > 0) {
        this.y = Math.random() * height * 0.5;
      } else {
        this.y = Math.random() * height * 0.5 + 0.5 * height;
      }
    } else {
      //top/bottom; ensure velocity pushes it on screen
      if (this.vY > 0) {
        this.y = -2 * this.bounds;
      } else {
        this.y = 2 * this.bounds + height;
      }
      //randomly position along other dimension
      if (this.vX > 0) {
        this.x = Math.random() * width * 0.5;
      } else {
        this.x = Math.random() * width * 0.5 + 0.5 * width;
      }
    }
  };

  private hitPoint = function(tX, tY) {
    return this.hitRadius(tX, tY, 0);
  };

  private hitRadius = function(tX, tY, tHit) {
    //early returns speed it up
    if (tX - tHit > this.x + this.hit) {
      return;
    }
    if (tX + tHit < this.x - this.hit) {
      return;
    }

    if (tY - tHit > this.y + this.hit) {
      return;
    }

    if (tY + tHit < this.y - this.hit) {
      return;
    }

    //now do the circle distance test
    return (
      this.hit + tHit >
      Math.sqrt(
        Math.pow(Math.abs(this.x - tX), 2) + Math.pow(Math.abs(this.y - tY), 2)
      )
    );
  };
}

class ShipBody extends Entity {
  private static View = class extends BaseView<ShipBody> {
    draw = (d: IDrawer, dt: number) => {
      d.beginPath()
        .moveTo(0, 10)
        .lineTo(5, -6)
        .lineTo(0, -2)
        .lineTo(-5, -6)
        .closePath()

        .stroke();

      return this;
    };
  };

  private static Behavior = class extends BaseBehavior<ShipBody> {
    update = (dt: number) => {
      super.update(dt);

      return this;
    };
  };

  constructor() {
    super();

    this.setView(new ShipBody.View(this)).setBehavior(
      new ShipBody.Behavior(this)
    );
  }
}

class ShipFlame extends Entity {
  private static View = class extends BaseView<ShipFlame> {
    draw = (d: IDrawer, dt: number) => {
      d.scale(0.5, 0.5)
        .translate(0, -5)

        .beginPath()
        .moveTo(2, 0) // ship
        .lineTo(4, -3) // rpoint
        .lineTo(2, -2) // rnotch
        .lineTo(0, -5) // tip
        .lineTo(-4, -3) // lnotch
        .lineTo(-2, -0) // lpoint
        .lineTo(-2, -0) // ship
        .closePath()

        .stroke();

      return this;
    };
  };

  private static Behavior = class extends BaseBehavior<ShipFlame> {
    update = (dt: number) => {
      super.update(dt);

      return this;
    };
  };

  constructor() {
    super();

    this.setView(new ShipFlame.View(this)).setBehavior(
      new ShipFlame.Behavior(this)
    );
  }
}

export class Ship extends Entity {
  private static View = class extends BaseView<Ship> {
    draw = (d: IDrawer, dt: number) => {
      return this;
    };
  };

  private static Behavior = class extends BaseBehavior<Ship> {
    update = (dt: number) => {
      const { parent } = this;

      // move by velocity
      parent.plusPosition(parent.speed);

      // with thrust flicker a flame every Ship.TOGGLE frames, attenuate thrust
      if (parent.thrust > 0) {
        parent.timeout++;
        // this.shipFlame.alpha = 1; // todo:

        if (parent.timeout > Ship.TOGGLE) {
          // this.shipFlame.scale = 0.5; // todo:
        } else {
          // this.shipFlame.scale = 1; // todo:
        }
      } else {
        // this.shipFlame.alpha = 0 // todo:
        parent.thrust = 0;
      }

      super.update(dt);

      return this;
    };

    accelerate = () => {
      const { parent } = this;
      const { sin, cos, PI, min, max } = Math;
      const { MAX_VELOCITY } = Ship;

      // increase push amount for acceleration
      parent.thrust += parent.thrust + 0.6;

      if (parent.thrust >= Ship.MAX_THRUST) {
        parent.thrust = Ship.MAX_THRUST;
      }

      // accelerate
      parent.plusPosition(
        sin(parent.rotation * (PI / -180)) * parent.thrust,
        cos(parent.rotation * (PI / -180)) * parent.thrust
      );

      // cap max speeds
      parent.speed.set(min(MAX_VELOCITY, max(-MAX_VELOCITY, parent.speed.x)));
    };
  };

  static TOGGLE = 60;
  static MAX_THRUST = 60;
  static MAX_VELOCITY = 60;

  shipBody: ShipBody;
  shipFlame: ShipFlame;

  speed: IPoint;
  thrust: number;
  timeout: number;
  rotation: number;

  hit: any;
  bounds: any;

  constructor() {
    super();

    this.thrust = 0;
    this.timeout = 0;
    this.rotation = 0;
    this.speed = new Point();

    this.setView(new Ship.View(this)).setBehavior(new Ship.Behavior(this));

    this.shipBody = new ShipBody();
    this.shipFlame = new ShipFlame();

    this.add(this.shipFlame, this.shipBody);
  }

  accelerate = () => {
    // increase push amount for acceleration
    (this.behavior as any).accelerate(); // todo: isDone types

    return this;
  };
}

export class GameScene extends BaseScene {
  score = new Score();

  style = { fillStyle: Color.White };

  private control = {
    shoot: false,
    left: false,
    right: false,
    forward: true
  };

  behavior = new (class extends BaseBehavior<GameScene> {
    constructor(parent: GameScene) {
      super(parent);
    }

    update(dt: number) {
      const { parent: self } = this;

      this.input()
        .firing()
        .turning()
        .thrust()
        .newSpaceRocks()
        .shipLooping()
        .bulletMovement()
        .nested();

      //   call sub ticks
      //   ship.tick(event);
      //   stage.update(event);

      return this;
    }

    private restart = () => {
      const { parent: scene } = this;

      // hide anything on stage and show the score
      scene.clear();
      Score.reset();

      return this;
    };

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
      return this;
    };

    private thrust = () => {
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

    const ship = new Ship();

    align(ship, this, Position.CENTER);

    this.add(ship);
  }
}

export class SpaceRockGame extends BaseGame {
  scene: IScene;

  constructor(screen: IScreen) {
    super(screen, 60);

    this.scene = new GameScene(this);
  }
}
