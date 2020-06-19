import {
  BaseScene,
  borderBouncingBehavior,
  Color,
  IBrush,
  IGame,
  IViewFunction,
  Size,
  Sprite
} from "core";

export class GameScene extends BaseScene {
  style = { fillStyle: Color.Blue };

  constructor(game: IGame) {
    super(game);

    this.add(
      new Sprite("coin-sprite-animation.png", Size.valueOf(44, 40))
        .setFrames(10, 2)
        .addBehaviors(
          borderBouncingBehavior(() => {
            console.log("Ding !!!");
          })
        )
        .setPosition(300),
      new Sprite("kirbywalk.gif") //, Size.valueOf(23))
        // .setFrames(6, 4)
        .setPosition(100)
    );
  }
}

