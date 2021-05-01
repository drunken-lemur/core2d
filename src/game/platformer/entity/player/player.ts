import {
  Color,
  defaultBehavior,
  Delay,
  Direction,
  Entity,
  IBehaviors,
  IPoint,
  IScene,
  IVelocity,
  Key,
  moveByVelocityBehavior,
  Point,
  Sprite
} from "core";

import { PlayerState } from "./state";
import { getSpriteByState } from "./sprites";
import {Bullet} from "../bullet";

export class Player extends Entity implements IVelocity {
  private static DefaultSpeed = new Point(2);
  private static DefaultState = PlayerState.Staying;

  // views: IViews<Player> = [sceneView];
  behaviors: IBehaviors<Player> = [
    defaultBehavior,
    Player.processControl,
    Player.moveByControl,
    Player.shoot,
    moveByVelocityBehavior
  ];
  style = { fillStyle: Color.Blue, strokeStyle: Color.Blue };
  velocity: IPoint;
  private speed: IPoint;
  private sprite!: Sprite;
  private state!: PlayerState;
  private direction!: Direction;
  private isJumping = false;
  private isDucking = false;
  private isFiring = false;
  private isBlocking = false;
  private control = {
    jump: false,
    duck: false,
    fire: false,
    block: false,
    left: false,
    right: false
  };
  private shootDelay: Delay = new Delay(.5);

  constructor() {
    super();

    this.velocity = new Point();
    this.speed = Player.DefaultSpeed;
    this.direction = Direction.East;

    this.setState(Player.DefaultState);

    // this.add(this.sprite);
    this.setSize(26, 27);
  }

  get w() {
    return this.sprite?.w || 0;
  }

  set w(w: number) {}

  get h() {
    return this.sprite?.h || 0;
  }

  set h(h: number) {}

  private static processControl = (player: Player) => {
    const scene = player?.parent?.parent as IScene;

    if (!scene) return;

    const { control } = player;
    const { isKeyHold, isKeyPressed } = scene.game.input;

    control.jump = isKeyPressed(Key.Space);
    control.duck = isKeyHold(Key.ArrowDown);
    control.fire = isKeyHold(
      Key.MetaLeft,
      Key.MetaRight,
      Key.ControlLeft,
      Key.ControlRight
    );
    control.block = isKeyHold(Key.ArrowUp);
    control.left = isKeyHold(Key.ArrowLeft);
    control.right = isKeyHold(Key.ArrowRight);
  };

  private static moveByControl = (player: Player) => {
    const { control } = player;

    if (control.jump) player.velocity.y -= 7;

    if (control.block) {
      player.setState(PlayerState.Blocking);
      player.isBlocking = true;
    } else if (control.duck) {
      player.setState(PlayerState.Ducking);
      player.isDucking = true;
    } else {
      if (control.left) {
        player.velocity.x = -player.speed.x;
        player.setState(PlayerState.Walking, Direction.West);
      } else if (control.right) {
        player.velocity.x = player.speed.x;
        player.setState(PlayerState.Walking, Direction.East);
      } else {
        player.velocity.x = 0;
        player.setState(PlayerState.Staying);
      }

      // player.isJumping = false;
      // player.isDucking = false;
      // player.isFiring = false;
      // player.isBlocking = false;
    }
  };

  private static shoot = (player: Player, deltaTime: number) => {
    const { control, parent, shootDelay, direction } = player;

    shootDelay.update(deltaTime);
    if (control.fire && shootDelay.isDone) {
      shootDelay.reset();

      const toLeft = direction === Direction.East;
      const toRight = direction === Direction.West;

      const angle = toLeft ? -90 : toRight ? 90 : 90;
      parent?.add(new Bullet(player, angle));
    }
  };

  private setState = (state: PlayerState, direction?: Direction) => {
    const dir = direction || this.direction;

    if (this.state !== state || this.direction !== dir) {
      this.state = state;
      this.direction = dir;
      this.sprite = getSpriteByState(state, dir);

      this.sprite.rewind();
      this.clear().add(this.sprite);
    }

    return this;
  };
}
