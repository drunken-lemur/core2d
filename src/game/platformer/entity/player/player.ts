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

/*
В прижке, нельзя присесть.
В обычном, прыжке два кадра - один прыжок, вторй падение
В присядке, нельзя прыгать, нельзя блокировать, нельз развернуться. (выстрел сидя два кдра - сидя закрыт и стреляет)

 */

export class Player extends Entity implements IVelocity {
  private static DefaultSpeed = new Point(2);
  private static DefaultState = PlayerState.Staying;

  views: IViews<Player> = [sceneView];
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

      if (control.left) {
        player.velocity.x = -player.speed.x;
        player.direction = Direction.West;
      } else if (control.right) {
        player.velocity.x = player.speed.x;
        player.direction = Direction.East;
      } else {
        player.velocity.x = 0;
      }

      if (control.jump) player.velocity.y -= 7;

      if (control.block) {
        player.setState(PlayerState.Blocking);
        player.isBlocking = true;
      } else if (control.duck) {
        player.setState(PlayerState.Ducking);
        player.isDucking = true;
      } else if (control.left) {
        player.setState(PlayerState.Walking);
        player.direction = Direction.West;
      } else if (control.right) {
        player.setState(PlayerState.Walking);
        player.direction = Direction.East;
      } else {
        player.sprite.rewind();
        player.setState(PlayerState.Staying);

        // player.velocity.y = 0;

        player.isJumping = false;
        player.isDucking = false;
        player.isFiring = false;
        player.isBlocking = false;
      }
    }
    // player => player.plusPosition(player.velocity) // todo: move to map behavior
  ];
  // style = { fillStyle: Color.Blue, strokeStyle: Color.Blue };

  // get w() {
  //   return this.sprite.w;
  // }
  // set w(w: number) {}
  //
  // get h() {
  //   return this.sprite.h;
  // }
  // set h(h: number) {}

  velocity: IPoint;

  private speed: IPoint;
  private sprite: Sprite;
  private state: PlayerState;

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
  private direction: Direction = Direction.East;

  constructor() {
    super();

    this.velocity = new Point();
    this.speed = Player.DefaultSpeed;
    this.state = Player.DefaultState;
    this.sprite = this.setState(this.state).sprite;

    this.add(this.sprite);
    // this.setSize(this.sprite);
    this.setSize(26, 27);
  }

  private setState = (state: PlayerState) => {
    this.sprite = getSpriteByState(state, this.direction);
    this.clear().add(this.sprite);

    return this;
  };
}
