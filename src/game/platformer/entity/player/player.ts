import {
  defaultBehavior,
  Direction,
  Entity,
  IBehaviors,
  IPoint,
  IPointData,
  IScene,
  Key,
  Point,
  Sprite
} from "core";

import { PlayerState } from "./state";
import { getSpriteByState } from "./sprites";

export class Player extends Entity {
  private static DefaultSpeed = new Point(1);
  private static DefaultState = PlayerState.Staying;

  behaviors: IBehaviors<Player> = [
    defaultBehavior,
    player => {
      const { control } = player;
      const { game } = this.parent as IScene;
      const { isKeyHold } = game.input;

      control.jump = isKeyHold(Key.Space);
      control.duck = isKeyHold(Key.ArrowDown);
      control.fire = isKeyHold(Key.Enter);
      control.block = isKeyHold(Key.ArrowUp);
      control.left = isKeyHold(Key.ArrowLeft);
      control.right = isKeyHold(Key.ArrowRight);
    },
    player => {
      const { control } = player;

      if (control.left) {
        player.delta.x = -player.speed.x;
        player.direction = Direction.West;
      } else if (control.right) {
        player.delta.x = player.speed.x;
        player.direction = Direction.East;
      }

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

        player.delta.x = 0;

        player.isJumping = false;
        player.isDucking = false;
        player.isFiring = false;
        player.isBlocking = false;
      }
    },
    player => player.plusPosition(player.delta)
  ];

  private delta: IPoint;
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

    this.delta = new Point();
    this.speed = Player.DefaultSpeed;
    this.state = Player.DefaultState;
    this.sprite = this.setState(this.state).sprite;

    this.setSize(this.sprite).add(this.sprite);
  }

  private setState = (state: PlayerState) => {
    this.sprite = getSpriteByState(state, this.direction);
    this.clear().add(this.sprite);

    return this;
  };
}
