import { BaseGame, IScreen, IScene, IGame, Color, BaseScene, Size } from "core";

import { FpsLabel, Mosaic } from "lib/entity";
import { TypingLabel } from "lib/entity/typingLabel";

const lorem =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

class IntroScene extends BaseScene {
  style = { fillStyle: Color.Gray };

  constructor(game: IGame) {
    super(game);

    const fps = new FpsLabel().setStyle({
      font: "20px Verdana",
      fillStyle: Color.Black
    });

    const mosaic = new Mosaic(this.size, Size.valueOf(10));

    const typingText = new TypingLabel(lorem, 2);

    this.add(mosaic, typingText, fps);
  }
}

export class Demo extends BaseGame {
  scene: IScene;

  constructor(screen: IScreen) {
    super(screen, 60);

    this.scene = new IntroScene(this);

    // setTimeout(this.stop, 100)
  }
}
