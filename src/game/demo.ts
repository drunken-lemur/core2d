import {
  BaseGame,
  IInput,
  IScreen,
  IScene,
  IGame,
  Color,
  BaseScene,
  Size,
  BaseInput
} from "core";

import { FpsLabel, Label, Mosaic, TypingLabelBehavior } from "entity";

const lorem =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

export class Demo extends BaseGame {
  private static Intro = class extends BaseScene {
    constructor(game: IGame) {
      super(game);

      const fps = new FpsLabel();
      fps.setStyle({
        font: "20px Georgia",
        fillStyle: Color.Black
      });

      const mosaic = new Mosaic(this.size, Size.valueOf(10));

      this.add(mosaic, fps);

      const fontSize = 20;
      const typingSec = 2;
      const maxStrLen = 70;

      lorem
        .split(" ")
        .reduce(
          (acc, str) => {
            if (acc[acc.length - 1].length + str.length >= maxStrLen) {
              acc.push("");
            }

            acc[acc.length - 1] += " " + str;

            if (acc[acc.length - 1].length < maxStrLen) {
              acc[acc.length - 1] += Array();
            }

            return acc;
          },
          [""]
        )
        .forEach((str, key) => {
          console.log({ str });
          const label = new Label(str);
          this.add(
            label
              .setPosition(0, fontSize * key + fontSize)
              .setStyle({
                font: `${fontSize}px Georgia`,
                fillStyle: Color.Green
              })
              .setBehavior(
                new TypingLabelBehavior(label, typingSec, typingSec * key)
              )
          );
        });
    }
  };
  input: IInput;
  scene: IScene;

  constructor(screen: IScreen) {
    super(screen, 60);

    this.input = new BaseInput();
    this.scene = new Demo.Intro(this);
  }
}
