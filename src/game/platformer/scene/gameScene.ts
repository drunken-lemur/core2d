import { Box, TiledMap } from "lib";
import { BaseScene, Bounds, Color, IGame, moveByWasdBehavior } from "core";

import { Player } from "../entity/player";
import { TestBox } from "game/platformer/entity";

export class GameScene extends BaseScene {
  style = { fillStyle: Color.MarioSky };

  constructor(game: IGame) {
    super(game);

    const map = new TiledMap("mario/world-1-1.tmx", "World");
    map.add(
      new TestBox().addBehaviors(moveByWasdBehavior(game.input.isKeyHold))
    );
    // map.setPlayer(new Player());

    this.add(map);
    // .add(numbersSprite);
  }
}
