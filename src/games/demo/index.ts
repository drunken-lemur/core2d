import { BaseGame, IInput, IScreen, IScene } from "../../core";

import { Greeting } from "./scenes";

export class Demo extends BaseGame {
  input: IInput;
  scene: IScene;

  constructor(screen: IScreen) {
    super(screen, 60);

    this.input = {} as any; // todo
    this.scene = new Greeting(this, this.screen.get()); // todo: refactor .get() to getSize();
  }
}
