import { IScene } from "./scene";
import { IScreen } from "./screen";
import { ITimer, Timer } from "./timer";
import { BaseInput, IInput } from "./input";

export interface IGame {
  input: IInput;
  scene: IScene;
  timer: ITimer;
  screen: IScreen;
  stop: () => this;
  start: () => this;
}

export abstract class BaseGame implements IGame {
  static instance: IGame;

  input: IInput;
  screen: IScreen;
  abstract scene: IScene;

  readonly timer: ITimer;

  protected constructor(screen: IScreen, fps: number) {
    BaseGame.instance = this;

    this.screen = screen;
    this.input = new BaseInput();
    this.timer = new Timer(fps, this.update, this.draw);
  }

  stop = () => {
    this.timer.stop();

    return this;
  };

  start = () => {
    this.timer.start();

    return this;
  };

  private update = (deltaTime: number) => {
    this.scene.update(deltaTime);
  };

  private draw = (deltaTime: number) => {
    this.screen.render(this.scene, deltaTime);
  };
}
