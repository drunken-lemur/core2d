import { IWithToArray } from "./toArray";

export interface ISizeData {
  w: number;
  h: number;
}

export interface ISize extends ISizeData, IWithToArray<number> {
  get: () => ISizeData;
  set: (w: number | ISizeData, h?: number) => this;
  plus: (w: number | ISizeData, h?: number) => this;
  minus: (w: number | ISizeData, h?: number) => this;
  multiply: (w: number | ISizeData, h?: number) => this;
  divide: (w: number | ISizeData, h?: number, euclidean?: boolean) => this;
  invert: () => this;
  swap: () => this;
  clone: () => ISize;
  eq: (w: number | ISizeData, h?: number) => boolean;
  min: (w: number | ISizeData, h?: number) => this;
  max: (w: number | ISizeData, h?: number) => this;
  invertW: () => this;
  invertH: () => this;
  ceil: () => this;
  round: () => this;
  floor: () => this;
  lessThan: (orEqual: boolean, w: number | ISizeData, h?: number) => boolean;
}

export class Size implements ISize {
  w: number;
  h: number;

  constructor(w: number | ISizeData = 0, h?: number) {
    this.w = 0;
    this.h = 0;

    this.set(Size.valueOf(w, h));
  }

  static valueOf(w: number | ISizeData = 0, h?: number): ISizeData {
    if (typeof w === "number") {
      return { w, h: h === undefined ? w : h };
    }

    return { w: w.w, h: w.h };
  }

  static random(w: number | ISizeData = 1, h?: number): ISize {
    const size = Size.valueOf(w, h);

    return new Size(Math.random() * size.w, Math.random() * size.h);
  }

  get = (): ISizeData => ({ w: this.w, h: this.h });

  set = (w: number | ISizeData, h?: number) => {
    Object.assign(this, Size.valueOf(w, h));

    return this;
  };

  plus = (w: number | ISizeData, h?: number) => {
    const size = Size.valueOf(w, h);

    this.w += size.w;
    this.h += size.h;

    return this;
  };

  minus = (w: number | ISizeData, h?: number) => {
    const size = Size.valueOf(w, h);

    this.w -= size.w;
    this.h -= size.h;

    return this;
  };

  multiply = (w: number | ISizeData, h?: number) => {
    const size = Size.valueOf(w, h);

    this.w *= size.w;
    this.h *= size.h;

    return this;
  };

  divide = (w: number | ISizeData, h?: number, euclidean = false) => {
    const size = Size.valueOf(w, h);

    if (!euclidean) {
      this.w /= size.w;
      this.h /= size.h;
    } else {
      this.w %= size.w;
      this.h %= size.h;
    }

    return this;
  };

  invert = () => this.multiply({ w: -1, h: -1 });

  swap = () => this.set({ w: this.h, h: this.w });

  clone = () => new Size(this.get());

  eq = (w: number | ISizeData, h?: number) => {
    const size = Size.valueOf(w, h);

    return this.w === size.w && this.h === size.h;
  };

  min = (w: number | ISizeData, h?: number) => {
    const size = Size.valueOf(w, h);

    this.w = Math.min(this.w, size.w);
    this.h = Math.min(this.h, size.h);

    return this;
  };

  max = (w: number | ISizeData, h?: number) => {
    const size = Size.valueOf(w, h);

    this.w = Math.max(this.w, size.w);
    this.h = Math.max(this.h, size.h);

    return this;
  };

  invertW = () => this.multiply({ w: -1, h: 1 });

  invertH = () => this.multiply({ w: 1, h: -1 });

  ceil = () => {
    this.w = Math.ceil(this.w);
    this.h = Math.ceil(this.h);

    return this;
  };

  round = () => {
    this.w = Math.round(this.w);
    this.h = Math.round(this.h);

    return this;
  };

  floor = () => {
    this.w = Math.floor(this.w);
    this.h = Math.floor(this.h);

    return this;
  };

  lessThan = (orEqual: boolean, w: number | ISizeData, h?: number) => {
    const size = Size.valueOf(w, h);

    if (orEqual) {
      return this.w <= size.w && this.h <= size.h;
    } else {
      return this.w < size.w && this.h < size.h;
    }
  };

  toArray = () => [this.w, this.h];
}
