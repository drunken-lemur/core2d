import { IWithToArray } from "./toArray";

export interface ISizeData {
  w: number;
  h: number;
}

export interface ISize extends ISizeData, IWithToArray<number> {
  getSize: () => ISizeData;
  set: (size: ISizeData) => this;
  plus: (size: ISizeData) => this;
  minus: (size: ISizeData) => this;
  multiply: (size: ISizeData) => this;
  divide: (size: ISizeData) => this;
  invert: () => this;
  swap: () => this;
  clone: () => ISize;
  eq: (size: ISizeData) => boolean;
  min: (size: ISizeData) => this;
  max: (size: ISizeData) => this;
  invertW: () => this;
  invertH: () => this;
  ceil: () => this;
  round: () => this;
  floor: () => this;
  lessThan: (size: ISizeData, orEqual: boolean) => boolean;
}

export class Size implements ISize {
  w: number;
  h: number;

  static valueOf(w?: number | ISizeData, h: number = 0): ISizeData {
    if (typeof w === "number") {
      return { w, h };
    } else if (w) {
      return { w: w.w, h: w.h };
    } else {
      return { w: 0, h: 0 };
    }
  }

  static objectOf(w?: number | ISizeData, h: number = 0): Size {
    return new Size(Size.valueOf(w, h));
  }

  constructor(size?: ISizeData) {
    this.w = 0;
    this.h = 0;

    if (size) {
      this.set(size);
    }
  }

  getSize = (): ISizeData => ({ w: this.w, h: this.h });

  set = (size: ISizeData) => {
    Object.assign(this, size);

    return this;
  };

  plus = (size: ISizeData) => {
    this.w += size.w;
    this.h += size.h;

    return this;
  };

  minus = (size: ISizeData) => {
    this.w -= size.w;
    this.h -= size.h;

    return this;
  };

  multiply = (size: ISizeData) => {
    this.w *= size.w;
    this.h *= size.h;

    return this;
  };

  divide = (size: ISizeData) => {
    this.w /= size.w;
    this.h /= size.h;

    return this;
  };

  invert = () => this.multiply({ w: -1, h: -1 });

  swap = () => this.set({ w: this.h, h: this.w });

  clone = () => new Size(this.getSize());

  eq = (size: ISizeData) => this.w === size.w && this.h === size.h;

  min = (size: ISizeData) => {
    this.w = Math.min(this.w, size.w);
    this.h = Math.min(this.h, size.h);

    return this;
  };

  max = (size: ISizeData) => {
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

  lessThan = (size: ISizeData, orEqual: boolean = false) => {
    if (orEqual) {
      return this.w <= size.w && this.h <= size.h;
    } else {
      return this.w < size.w && this.h < size.h;
    }
  };

  toArray = () => [this.w, this.h];
}
