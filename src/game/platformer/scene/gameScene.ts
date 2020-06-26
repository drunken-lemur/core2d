import { TiledMap } from "lib";
import { BaseScene, Color, IGame } from "core";

import { Player, PlayerState } from "../entity/player";

export class GameScene extends BaseScene {
  style = { fillStyle: Color.MarioSky };

  map: TiledMap;
  player: Player;

  constructor(game: IGame) {
    super(game);

    this.map = new TiledMap("mario/world-1-1.tmx");
    this.player = new Player().setState(PlayerState.DieingLeft );

    this.add(this.map, this.player);
  }
}
