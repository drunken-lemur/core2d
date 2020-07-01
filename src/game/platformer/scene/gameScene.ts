import { numbersSprite, TiledMap } from "lib";
import { BaseScene, Color, IGame } from "core";

import { Player } from "../entity/player";

export class GameScene extends BaseScene {
  style = { fillStyle: Color.MarioSky };

  map: TiledMap;
  player: Player;

  constructor(game: IGame) {
    super(game);

    this.map = new TiledMap("mario/world-1-1.tmx", "World");
    this.player = new Player();

    this
        .add(this.map.add(this.player))
        // .add(numbersSprite);
  }
}
