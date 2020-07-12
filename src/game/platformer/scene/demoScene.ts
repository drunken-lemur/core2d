import {
  BaseScene,
  Color,
  foreachBehavior,
  hideOnOutOfBoundsBehavior,
  IBehaviors,
  IGame,
  Key,
  moveByKeyboard,
  onOutInOfBoundsBehavior,
  sceneBehavior,
  Size,
  Sprite,
  Texture
} from "core";
import { Square } from "lib/entity";

const texture = new Texture(
  "//yastatic.net/s3/home-static/_/x/Q/xk8YidkhGjIGOrFm_dL5781YA.svg"
);
const sprite = new Sprite(texture);

const square = new Square(Size.valueOf(50)).setStyle({
  fillStyle: Color.random()
});

export class DemoScene extends BaseScene {
  style = { fillStyle: Color.random() };

  behaviors: IBehaviors<DemoScene> = [
    sceneBehavior,
    foreachBehavior(hideOnOutOfBoundsBehavior)
  ];

  constructor(game: IGame) {
    super(game);

    const { isKeyHold } = game.input;
    this.add(
      texture.setBehaviors(
        moveByKeyboard(
          isKeyHold,
          60,
          Key.ArrowUp,
          Key.ArrowLeft,
          Key.ArrowDown,
          Key.ArrowRight
        )
        // square => console.log(square.getBounds())
      )
    );
  }

  method(): void;
  method(id: number): void;
  method(obj: object): void;
  method(idOrObj?: number | object) {
    console.log({ idOrObj });

    const a = this.sum(1, 1);
    const b = this.sum("1", "1");
  }

  sum(a: string, b: string): string;
  sum(a: number, b: number): number;
  sum(a: any, b: any): any {
    this.method(this);

    return a + b;
  }
}
