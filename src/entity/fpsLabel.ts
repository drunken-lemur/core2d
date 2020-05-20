import { BaseGame, IBoundsData } from "core";

import { Label } from "./label";

export class FpsLabel extends Label {
  constructor(bounds?: IBoundsData) {
    super("", bounds);
  }

  update(deltaTime: number) {
    this.text = `${BaseGame.instance.timer.fps}`;

    super.update(deltaTime);

    return this;
  }
}
