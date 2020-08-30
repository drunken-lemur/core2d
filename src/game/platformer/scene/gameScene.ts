import {InfoLabel, TiledMap, velocityDecorator} from "lib";
import {
  BaseScene,
  Color,
  IGame,
  Key,
  moveByWasdBehavior,
  Position
} from "core";
import { TestBox } from "game/platformer/entity";

export class GameScene extends BaseScene {
  style = { fillStyle: Color.MarioSky };

  constructor(game: IGame) {
    super(game);

    const map = new TiledMap("mario/world-1-1.tmx", "World");
    map.add(
      velocityDecorator(new TestBox().addBehaviors(moveByWasdBehavior(game.input.isKeyHold, 60)))
    );
    // map.setPlayer(new Player());

    this.addBehaviors(() => {
      if (game.input.isKeyPressed(Key.Escape)) {
        game.scene = new GameScene(game);
      }
    });
    this.add(
      map,
      InfoLabel.getInstance("Info Label").align(this, Position.Center)
    );
    // .add(numbersSprite);
  }
}
