import { TilesetMap, TiledMap } from "lib";
import { BaseScene, Color, IGame, Texture } from "core";

import { darkwingDuck } from "../sprite";
import { level01 } from "../maps/level01";

export class GameScene extends BaseScene {
  style = { fillStyle: Color.MarioSky };

  constructor(game: IGame) {
    // c_onstructor(game: IGame) {
    super(game);

    const map = new TiledMap("mario/world-1-1.tmx");

    this.add(map);
  }
  // constructor(game: IGame) {
  c__onstructor(game: IGame) {
    // super(game);

    const texture = new Texture(
      "tilesets/other/phpThumb_generated_thumbnail.jpg"
    );

    const tilesetMap = new TilesetMap(texture);

    tilesetMap.addLayers(...level01);

    this.add(tilesetMap);
  }

  // constructor(game: IGame) {
  c_onstructor(game: IGame) {
    // super(game);

    this.add(
      darkwingDuck.greetingSprite.setPosition(0, 0),
      darkwingDuck.blockingSprite.setPosition(0, 34),
      darkwingDuck.runningSprite.setPosition(0, 63),
      darkwingDuck.wellDoneSprite.setPosition(0, 92)
    );
  }
}
