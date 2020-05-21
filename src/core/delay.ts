import { IUpdated } from "./updated";

export interface IDelay extends IUpdated {
  delay: number;
  ignore: number;
  factor: number;
  isDone: boolean;
  isStart: boolean;
  reset: () => void;
  onDone: () => void;
}

export class Delay implements IDelay {
  delay: number;
  ignore: number;
  onDone: () => void;

  private passed: number;

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

  constructor(sec: number, onDone: () => void = () => void 0, ignoreSec = 0) {
    this.passed = 0;

    this.delay = sec;
    this.onDone = onDone;
    this.ignore = ignoreSec;
  }

  update(deltaTime: number) {
    const { passed, ignore, delay } = this;

    if (passed - ignore < delay) {
      this.passed += deltaTime;
    }

    return this;
  }

  reset = () => {
    this.passed = 0;

    return this;
  };
}
