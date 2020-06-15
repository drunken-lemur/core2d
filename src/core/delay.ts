import { IUpdated } from "./updated";

export interface IDelay extends IUpdated {
  delay: number;
  ignore: number;
  factor: number;
  isDone: boolean;
  isStart: boolean;
  add: (value: number) => this;
  reset: () => this;
  onDone: () => void;
}

export class Delay implements IDelay {
  delay: number;
  ignore: number;
  onDone: () => void;

  private passed: number;

  constructor(sec: number, onDone: () => void = () => void 0, ignoreSec = 0) {
    this.passed = 0;

    this.delay = sec;
    this.onDone = onDone;
    this.ignore = ignoreSec;
  }

  get factor() {
    const { passed, ignore, delay } = this;

    return Math.max(0, passed - ignore) / delay;
  }

  get isDone() {
    const { passed, ignore, delay } = this;

    return passed - ignore >= delay;
  }

  get isStart() {
    return this.passed - this.ignore >= 0;
  }

  update(deltaTime: number) {
    const { passed, ignore, delay } = this;

    if (passed - ignore < delay) {
      this.passed += deltaTime;
    }

    if (this.isDone) {
      this.onDone();
    }
  }

  add = (value: number) => {
    this.passed += value;

    return this;
  };

  reset = () => {
    this.passed = 0;

    return this;
  };
}
