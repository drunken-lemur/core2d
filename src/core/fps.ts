export interface IFps {
  value: number;
  update: () => void;
}

export class Fps implements IFps {
  private cursor: number;
  private readonly limit: number;
  private readonly measures: number[];

  constructor(limit = 60) {
    this.limit = limit;
    this.cursor = limit;

    this.measures = Array(limit + 2)
      .join("0")
      .split("")
      .map(Number);
  }

  get value() {
    const time = this.measures[this.cursor] - this.measures[this.cursor_next];

    return Math.floor((this.limit * 1000) / time);
  }

  private get cursor_next() {
    return (this.cursor + 1) % (this.limit + 1);
  }

  update = () => {
    this.cursor = this.cursor_next;
    this.measures[this.cursor] = Date.now();
  };
}
