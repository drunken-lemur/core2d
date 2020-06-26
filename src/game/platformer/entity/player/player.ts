import { Entity, Sprite } from "core";

import { PlayerState } from "./state";
import { getSpriteByState } from "./sprites";

export class Player extends Entity {
  private static DefaultState = PlayerState.StayingRight;

  sprite: Sprite;
  state: PlayerState;

  constructor() {
    super();

    this.state = Player.DefaultState;
    this.sprite = getSpriteByState(this.state)!;
    this.setSize(this.sprite).add(this.sprite);
  }

  setState = (state: PlayerState) => {
    this.state = state;
    this.sprite = getSpriteByState(state)!;
    this.setSize(this.sprite).clear().add(this.sprite);

    return this;
  };
}
