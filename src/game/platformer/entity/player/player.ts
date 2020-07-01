import {
  defaultBehavior,
  Direction,
  Entity,
  IBehaviors,
  IPoint,
  IScene,
  IVelocity,
  IViews,
  Key,
  Point,
  sceneView,
  Sprite
} from "core";

import { PlayerState } from "./state";
import { getSpriteByState } from "./sprites";
import { Color } from "core/color";

/*
В прижке, нельзя присесть.
В обычном, прыжке два кадра - один прыжок, вторй падение
В присядке, нельзя прыгать, нельзя блокировать, нельз развернуться. (выстрел сидя два кдра - сидя закрыт и стреляет)
 */

export class Player extends Entity implements IVelocity {
  private static DefaultSpeed = new Point(2);
  private static DefaultState = PlayerState.Staying;

  // views: IViews<Player> = [sceneView];
  behaviors: IBehaviors<Player> = [
    defaultBehavior,
    player => {
      const { control } = player;
      const { game } = this.parent?.parent as IScene;
      const { isKeyHold, isKeyPressed } = game.input;

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
    },
    player => {
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
    }
  ];
  style = { fillStyle: Color.Blue, strokeStyle: Color.Blue };

  get w() {
    return this.sprite?.w || 0;
  }
  set w(w: number) {}

  get h() {
    return this.sprite?.h || 0;
  }
  set h(h: number) {}

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

  constructor() {
    super();

    this.velocity = new Point();
    this.speed = Player.DefaultSpeed;
    this.direction = Direction.East;

    this.setState(Player.DefaultState);

    // this.add(this.sprite);
    this.setSize(26, 27);
  }

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
