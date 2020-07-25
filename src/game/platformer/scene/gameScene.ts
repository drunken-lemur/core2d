import { TiledMap } from "lib";
import { BaseScene, Color, IGame } from "core";

import { Player } from "../entity/player";

export class GameScene extends BaseScene {
  style = { fillStyle: Color.MarioSky };

  constructor(game: IGame) {
    super(game);

    const map = new TiledMap("mario/world-1-1.tmx", "World");
    map.setPlayer(new Player());

    this.add(map);
    // .add(numbersSprite);
  }
}
