import { IInput } from "./input";
import { IScene } from "./scene";
import { IScreen } from "./screen";
import { ITimer, Timer } from "./timer";

export interface IGame {
  input: IInput;
  scene: IScene;
  screen: IScreen;
  stop: () => this;
  start: () => this;
}

export abstract class BaseGame implements IGame {
  screen: IScreen;
  abstract input: IInput;
  abstract scene: IScene;

  private timer: ITimer;

  protected constructor(screen: IScreen, fps: number) {
    this.screen = screen;
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
