export const Second = 1000;

export const Minute = Second * 60;

export const Hour = Minute * 60;

export interface ITimer {
  fps: number;
  start: () => this;
  stop: () => this;
}

type Update = (deltaTime: number) => void;

export class Timer implements ITimer {
  fps = 0;

  private readonly step: number;
  private readonly draw: Update;
  private readonly update: Update;

  private deltaTime = 0;
  private isRunning: boolean = false;
  private lastTime = performance.now();

  constructor(fps: number, update: Update, draw: Update) {
    this.draw = draw;
    this.update = update;

    this.step = 1 / fps;
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
      // todo:: calc fps

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
