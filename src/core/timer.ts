import { Fps, IFps } from "./fps";

export const Second = 1000;

export const Minute = Second * 60;

export const Hour = Minute * 60;

export interface ITimer {
  fps: number;
  start: () => this;
  stop: () => this;
}

type Draw = (deltaTime: number) => void;
type Update = (deltaTime: number) => void;

export class Timer implements ITimer {
  private readonly fpsMeter: IFps;
  private readonly step: number;
  private readonly draw: Draw;
  private readonly update: Update;
  private readonly fpsLimit: number;

  private deltaTime = 0;
  private isRunning: boolean = false;
  private lastTime = performance.now();

  get fps() {
    return this.fpsMeter.value;
  }

  constructor(fpsLimit: number, update: Update, draw: Draw) {
    this.draw = draw;
    this.update = update;
    this.step = 1 / fpsLimit;
    this.fpsLimit = fpsLimit;

    this.fpsMeter = new Fps(fpsLimit);
  }

  private loop = (now: number) => {
    this.deltaTime += Math.min(1, (now - this.lastTime) / 1000);

    while (this.deltaTime > this.step) {
      this.deltaTime -= this.step;
      this.update(this.step);
    }

    this.lastTime = now;

    this.draw(this.deltaTime);

    if (this.isRunning) {
      this.fpsMeter.update();

      requestAnimationFrame(this.loop);
    }

    return this;
  };

  start = () => {
    this.isRunning = true;

    return this.loop(this.lastTime);
  };

  stop = () => {
    this.isRunning = false;

    return this;
  };
}
