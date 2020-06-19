import {
  BaseScene,
  borderBouncingBehavior,
  Bounds,
  Color,
  IBrush,
  IGame,
  IViewFunction,
  Size,
  Texture
  // Sprite
} from "core";

export class GameScene extends BaseScene {
  style = { fillStyle: Color.Blue };

  constructor(game: IGame) {
    super(game);

    this.add(
      //   new Sprite("coin-sprite-animation.png", Size.valueOf(44, 40))
      //     .setFrames(10, 2)
      //     .setStyle({ fillStyle: Color.Red })
      //     .addBehaviors(
      //       borderBouncingBehavior(() => {
      //         console.log("Ding !!!");
      //       })
      //     )
      //     .setPosition(300),
      //   new Sprite("kirbywalk.gif", Size.valueOf(23))
      //     .setFrames(6, 4)
      //     .setStyle({ fillStyle: Color.Red })
      //     .setPosition(100)
      // );

      // new Sprite(
      //   "NES - Darkwing Duck - Darkwing Duck.gif",
      //   Size.valueOf(33, 36)
      // ).setPosition(10, 10)

      new Texture(
        "NES - Darkwing Duck - Darkwing Duck.gif",
        // Bounds.valueOf(4, 298, -150, -7)
        Bounds.valueOf(4, 298, 173, -7)
      )
    );
  }
}
