import { BaseScene, Color, IGame, Key, Position } from "core";

import { InfoLabel } from "lib";

import { Map, Player } from "../entity";

export class GameScene extends BaseScene {
  style = { fillStyle: Color.MarioSky };

  constructor(game: IGame) {
    super(game);

    this.addOnEscHandler();
    this.configureInfoLabel();

    this.add(new Map(), new Player());

    this.add(InfoLabel.getInstance());
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
