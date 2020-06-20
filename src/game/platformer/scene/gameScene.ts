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

const frames = [
  Bounds.valueOf(0, 0, 56, 56),
  Bounds.valueOf(55, 1, 57, 56),
  Bounds.valueOf(115, 1, 58, 56)
];

export class GameScene extends BaseScene {
  style = { fillStyle: Color.Blue };

  constructor(game: IGame) {
    super(game);

    const texture = new Texture(
      "NES - Darkwing Duck - Darkwing Duck.gif",
      Bounds.valueOf(4, 298, -150, -7)
    );

    const sprite = new Sprite(texture).setFrames(frames, 10);

    this.add(
      // new Sprite("coin-sprite-animation.png", Size.valueOf(44, 40))
      //   .setFrames(10, 2)
      //   .setStyle({ fillStyle: Color.Red })
      //   .addBehaviors(
      //     borderBouncingBehavior(() => {
      //       console.log("Ding !!!");
      //     })
      //   )
      //   .setPosition(300),
      // new Sprite("kirbywalk.gif", Size.valueOf(23))
      //   .setFrames(6, 4)
      //   .setStyle({ fillStyle: Color.Red })
      //   .setPosition(100),
      // new Sprite(
      //   "NES - Darkwing Duck - Darkwing Duck.gif",
      //   Size.valueOf(33, 36)
      // ).setPosition(10, 10)
      texture
      // sprite
    );
  }
}
