import { Entity, Sprite } from "core";

import { PlayerState } from "./state";
import { getSpriteByState } from "./sprites";

export class Player extends Entity {
  sprite: Sprite;
  state: PlayerState;

  constructor() {
    super();

    // todo: setBounds
    this.state = PlayerState.WalkingRight;

    this.sprite = getSpriteByState(this.state)!;

    this.add(this.sprite);
    this.setSize(this.sprite);
  }

  setState = (state: PlayerState) => {
    this.state = state;

    this.sprite = getSpriteByState(state)!;
    this.setSize(this.sprite);
  };
}
