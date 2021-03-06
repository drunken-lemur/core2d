import { InfoLabel, TiledMap } from "lib";
import { BaseScene, Color, IGame, Key, Point, Position } from "core";

import { Player } from "../entity";
import { Bullet } from "../entity/bullet";

export class GameScene extends BaseScene {
  style = { fillStyle: Color.MarioSky };

  constructor(game: IGame) {
    super(game);

    const player = new Player();
    const label = InfoLabel.getInstance();
    const map = new TiledMap("mario/world-1-1.tmx", "World");

    this.addOnEscHandler();
    this.configureInfoLabel();

    this.add(map.add(player), label, new Bullet(Point.valueOf(100, 100), -90));
  }

  addOnEscHandler() {
    this.addBehaviors(() => {
      if (this.game.input.isKeyPressed(Key.Escape)) {
        this.game.scene = new GameScene(this.game);
      }
    });
  }

  configureInfoLabel() {
    InfoLabel.getInstance("Info Label").align(this, Position.Center);
  }
}
