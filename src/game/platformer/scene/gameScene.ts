import {
  BaseScene,
  borderBouncingBehavior,
  Bounds,
  Color,
  IBrush,
  IGame,
  IViewFunction,
  Size,
  Sprite,
  Texture
  // Sprite
} from "core";
import { TilesetMap } from "lib/entity";
import { level01 } from "game/platformer/maps/level01";

const greetingFrames = [
  Bounds.valueOf(6, 3, 28, 34),
  Bounds.valueOf(34, 3, 33, 34),
  Bounds.valueOf(66, 3, 32, 34),
  Bounds.valueOf(101, 3, 27, 34),
  Bounds.valueOf(127, 3, 28, 34),
  Bounds.valueOf(156, 3, 24, 34),
  // REPEAT
  Bounds.valueOf(156, 3, 24, 34),
  Bounds.valueOf(156, 3, 24, 34)
  // Bounds.valueOf(216, 235, 66, 74),
  // Bounds.valueOf(216, 235, 66, 74),
];

const blockingFrames = [
  Bounds.valueOf(4, 42, 27, 29),
  Bounds.valueOf(37, 42, 28, 29),
  Bounds.valueOf(65, 42, 30, 29),
  Bounds.valueOf(95, 42, 29, 29)
  // REPEAT
  // Bounds.valueOf(65, 42, 30, 29),
  // Bounds.valueOf(37, 42, 28, 29)
];

const runningFrames = [
  Bounds.valueOf(2, 76, 28, 29),
  Bounds.valueOf(31, 76, 34, 29),
  Bounds.valueOf(65, 78, 34, 29),
  Bounds.valueOf(99, 76, 34, 29),
  Bounds.valueOf(133, 76, 34, 29),
  // REPEAT
  Bounds.valueOf(99, 76, 34, 29),
  Bounds.valueOf(65, 78, 34, 29),
  Bounds.valueOf(31, 76, 34, 29)
];

const wellDoneFrames = [
  Bounds.valueOf(4, 298, 56, 56),
  Bounds.valueOf(59, 299, 57, 56),
  Bounds.valueOf(119, 299, 58, 56)
];

export class GameScene extends BaseScene {
  style = { fillStyle: Color.Blue };

  constructor(game: IGame) {
    super(game);

    const texture = new Texture("phpThumb_generated_thumbnail.jpg");

    const tilesetMap = new TilesetMap(texture);

    tilesetMap.addLayers(...level01);

    this.add(tilesetMap);
  }

  c_onstructor(game: IGame) {
    // super(game);

    const texture = new Texture(
      "NES - Darkwing Duck - Darkwing Duck.gif",
      Bounds.valueOf(0),
      texture => texture.removeColor("#a4e0a0")
    );

    const greetingSprite = new Sprite(texture).setFrames(greetingFrames, 10);
    const blockingSprite = new Sprite(texture).setFrames(blockingFrames, 10);
    const runningSprite = new Sprite(texture).setFrames(runningFrames, 10);
    const wellDoneSprite = new Sprite(texture).setFrames(wellDoneFrames, 5);

    this.add(
      greetingSprite.setPosition(0, 0),
      blockingSprite.setPosition(0, 34),
      runningSprite.setPosition(0, 63),
      wellDoneSprite.setPosition(0, 92)
    );
  }
}
