import { BaseGame, IInput, IScreen, IScene } from "core";

import { Intro } from "scenes";

export class Demo extends BaseGame {
  input: IInput;
  scene: IScene;

  constructor(screen: IScreen) {
    super(screen, 60);

    this.input = {} as any; // todo
    this.scene = new Intro(this); // todo: refactor .getSize() to getSize();
  }
}
