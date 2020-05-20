import { IGame, BaseScene, Color } from "core";

import { FpsLabel } from "entity";

export class Intro extends BaseScene {
  constructor(game: IGame) {
    super(game);

    const label = new FpsLabel();
    // label.text = "Hello 2D";
    label.setStyle({
      textBaseline: "top",
      font: "20px Georgia",
      fillStyle: Color.Black
    });

    this.add(label);
  }
}
