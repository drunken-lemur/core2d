import {
  defaultBehavior,
  Direction,
  Entity,
  IBehaviors,
  IScene,
  Key,
  Sprite
} from "core";

import { PlayerState } from "./state";
import { getSpriteByState } from "./sprites";

export class Player extends Entity {
  private static DefaultState = PlayerState.Staying;

  private sprite!: Sprite;
  private state: PlayerState;
  private isJumping = false;
  private isDucking = false;
  private isFiring = false;
  private isBlocking = false;

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

      if (control.left) player.direction = Direction.West;
      if (control.right) player.direction = Direction.East;

      if (control.block) {
        player.setState(PlayerState.Blocking);
        player.isBlocking = true;
      } else if (control.duck) {
        player.setState(PlayerState.Ducking);
        player.isDucking = true;
      } else {
        player.setState(PlayerState.Staying);
        player.isJumping = false;
        player.isDucking = false;
        player.isFiring = false;
        player.isBlocking = false;
      }
    }
  ];
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

    this.state = Player.DefaultState;
    this.state = this.setState(this.state).state;
    this.setSize(this.sprite).add(this.sprite);
  }

  private setState = (state: PlayerState) => {
    this.sprite = getSpriteByState(state, this.direction);
    this.clear().add(this.sprite);

    return this;
  };
}
