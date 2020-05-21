import { IGame, BaseScene, Color, Size } from "core";

import { FpsLabel, Mosaic } from "entity";

export class Intro extends BaseScene {
  constructor(game: IGame) {
    super(game);

    const fps = new FpsLabel();
    fps.setStyle({
      textBaseline: "top",
      font: "20px Georgia",
      fillStyle: Color.Black
    });

    const mosaic = new Mosaic(this.size, Size.valueOf(30));

    this.add(mosaic, fps);
  }
}
