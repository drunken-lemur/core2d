import {
  BaseGame,
  BaseScene,
  Color,
  IGame,
  IScene,
  IScreen,
  Position,
  Size
} from "core";
import { Score } from "lib";
import { FpsLabel, Mosaic, ScoreLabel, Square, TypingLabel } from "lib/entity";

const lorem =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

class IntroScene extends BaseScene {
  style = { fillStyle: Color.Gray };

  constructor(game: IGame) {
    super(game);

    const font = "16px verdana";

    this.add(
      new Mosaic(this.size, Size.valueOf(10)),
      new TypingLabel(lorem, 2),
      new Square(Size.valueOf(50)),
      new FpsLabel()
        .align(this, Position.TopRight)
        .setStyle({ font, textAlign: "right" }),

      new ScoreLabel().setStyle({ font })
    );

    Score.add(100400);
  }
}

export class Demo extends BaseGame {
  scene: IScene;

  constructor(screen: IScreen) {
    super(screen, 60);

    this.scene = new IntroScene(this);

    // setTimeout(this.stop, 100);
  }
}
