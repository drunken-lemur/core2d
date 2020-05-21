import { BaseGame, BaseInput, BaseScene, IInput, IScene, IScreen } from "core";

class GameScene extends BaseScene {}

export class Snake extends BaseGame {
  private static FPS = 60;
  input: IInput;
  scene: IScene;

  constructor(screen: IScreen) {
    super(screen, Snake.FPS);

    this.input = new BaseInput();

    this.scene = new GameScene(this);
  }
}
