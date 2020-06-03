import { BaseGame, IBoundsData } from "core";

import { Label } from "./label";

export class FpsLabel extends Label {
  constructor(bounds?: IBoundsData) {
    super("", bounds);

    this.update(0);
  }

  update(dt: number) {
    this.text = `${BaseGame.instance.timer.fps}`;

    return super.update(dt);
  }
}
