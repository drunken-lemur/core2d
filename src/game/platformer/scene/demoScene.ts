import {
  BaseScene,
  Color,
  Direction,
  foreachBehavior,
  hideOnOutOfBoundsBehavior,
  IBehaviors,
  IGame,
  Key,
  moveByKeyboardBehavior,
  Position,
  sceneBehavior
} from "core";
import { Label } from "lib/entity";
import { PlayerState } from "game/platformer/entity/player";
import { getSpriteByState } from "game/platformer/entity/player/sprites";
import { darkwingDuckLeftTexture } from "game/platformer/entity/texture";

// const texture = new Texture(
//   "//yastatic.net/s3/home-static/_/x/Q/xk8YidkhGjIGOrFm_dL5781YA.svg"
// ).addOnLoad(scaleOnLoad(-1, 1));

const sprite = getSpriteByState(PlayerState.Greeting, Direction.West);
// const sprite = new Sprite(darkwingDuckLeftTexture);

const infoLabel = new Label("Hello =)").setStyle({
  fillStyle: Color.White,
  textAlign: "center",
  textBaseline: "middle",
  font: `${36}px Verdana bold`
});

export class DemoScene extends BaseScene {
  style = { fillStyle: Color.random() };

  behaviors: IBehaviors<DemoScene> = [
    sceneBehavior,
    foreachBehavior(hideOnOutOfBoundsBehavior),
    () => {
      infoLabel.text = JSON.stringify(sprite.getBounds());
    }
  ];

  constructor(game: IGame) {
    super(game);

    const { isKeyHold, isKeyPressed } = game.input;

    infoLabel.align(this, Position.Center);

    this.add(
      darkwingDuckLeftTexture,
      infoLabel,
      sprite.addBehaviors(
        moveByKeyboardBehavior(
          isKeyHold,
          60,
          Key.ArrowUp,
          Key.ArrowRight,
          Key.ArrowDown,
          Key.ArrowLeft
        ),
        moveByKeyboardBehavior(
          isKeyPressed,
          60,
          Key.KeyW,
          Key.KeyD,
          Key.KeyS,
          Key.KeyA
        )
      )
    );
  }

  method(): void;
  method(id: number): void;
  method(obj: object): void;
  method(idOrObj?: number | object) {
    console.log({ idOrObj });

    // const a = this.sum(1, 1);
    // const b = this.sum("1", "1");
  }

  sum(a: string, b: string): string;
  sum(a: number, b: number): number;
  sum(a: any, b: any): any {
    this.method(this);

    return a + b;
  }
}
