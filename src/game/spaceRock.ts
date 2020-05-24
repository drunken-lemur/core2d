import {
  align,
  BaseBehavior,
  BaseGame,
  BaseScene,
  BaseView,
  Entity,
  IDrawer,
  IGame,
  IInput,
  IPoint,
  IScene,
  IScreen,
  Point,
  Position
} from "core";

class Score {
  private score = 0;

  get value() {
    return this.score;
  }

  reset = () => {
    this.score = 0;

    return this;
  };

  add = (value: number) => {
    this.score += value;

    return this;
  };
}

class ShipBody extends Entity {
  private static View = class extends BaseView<ShipBody> {
    draw = (d: IDrawer, dt: number) => {
      d.beginPath();
      d.moveTo(0, 10);
      d.lineTo(5, -6);
      d.lineTo(0, -2);
      d.lineTo(-5, -6);
      d.closePath();

      d.stroke();

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
      d.scale(0.5, 0.5);
      d.translate(0, -5);

      d.beginPath();
      d.moveTo(2, 0); // ship
      d.lineTo(4, -3); // rpoint
      d.lineTo(2, -2); // rnotch
      d.lineTo(0, -5); // tip
      d.lineTo(-4, -3); // lnotch
      d.lineTo(-2, -0); // lpoint
      d.lineTo(-2, -0); // ship
      d.closePath();

      d.stroke();

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

  constructor(game: IGame) {
    super(game);

    const ship = new Ship();

    align(ship, this, Position.CENTER);

    this.add(ship);
  }
}

export class SpaceRock extends BaseGame {
  input: IInput;
  scene: IScene;

  constructor(screen: IScreen) {
    super(screen, 60);

    this.input = {} as any; // todo
    this.scene = new GameScene(this);
  }
}
