import { IWithToArray } from "./toArray";

export interface ISizeData {
  w: number;
  h: number;
}

export interface ISize extends ISizeData, IWithToArray<number> {
  clone(): ISize;

  get(): ISizeData;

  set(w: number | ISizeData, h?: number): this;

  plus(w: number | ISizeData, h?: number): this;

  minus(w: number | ISizeData, h?: number): this;

  multiply(w: number | ISizeData, h?: number): this;

  divide(w: number | ISizeData, h?: number, euclidean?: boolean): this;

  min(w: number | ISizeData, h?: number): this;

  max(w: number | ISizeData, h?: number): this;

  swap(): this;

  invert(): this;

  invertW(): this;

  invertH(): this;

  floor(): this;

  round(): this;

  ceil(): this;

  eq(w: number | ISizeData, h?: number): boolean;

  isLess(w: number | ISizeData, y?: number, or?: boolean): boolean;

  isMore(w: number | ISizeData, y?: number, or?: boolean): boolean;

  getMinRadius(): number;
}

export class Size implements ISize {
  w: number;
  h: number;

  constructor(w: number | ISizeData = 0, h?: number) {
    this.w = 0;
    this.h = 0;

    this.set(Size.valueOf(w, h));
  }

  static get(size: ISizeData): ISizeData {
    return { w: size.w, h: size.h };
  }

  static set(destination: ISizeData, source: ISizeData): ISizeData {
    destination.w = source.w;
    destination.h = source.h;

    return destination;
  }

  static plus(a: ISizeData, b: ISizeData): ISizeData {
    return { w: a.w + b.w, h: a.h + b.h };
  }

  static minus(a: ISizeData, b: ISizeData): ISizeData {
    return { w: a.w - b.w, h: a.h - b.h };
  }

  static multiply(a: ISizeData, b: ISizeData): ISizeData {
    return { w: a.w * b.w, h: a.h * b.h };
  }

  static divide(a: ISizeData, b: ISizeData, euclidean?: boolean): ISizeData {
    return !euclidean
      ? { w: a.w / b.w, h: a.h / b.h }
      : { w: a.w % b.w, h: a.h % b.h };
  }

  static min(a: ISizeData, b: ISizeData): ISizeData {
    return {
      w: Math.min(a.w, b.w),
      h: Math.min(a.h, b.h)
    };
  }

  static max(a: ISizeData, b: ISizeData): ISizeData {
    return {
      w: Math.max(a.w, b.w),
      h: Math.max(a.h, b.h)
    };
  }

  static swap(size: ISizeData): ISizeData {
    // noinspection JSSuspiciousNameCombination
    return { w: size.h, h: size.w };
  }

  static invert(size: ISizeData): ISizeData {
    return { w: -size.w, h: -size.h };
  }

  static invertW(size: ISizeData): ISizeData {
    return { w: -size.w, h: size.h };
  }

  static invertH(size: ISizeData): ISizeData {
    return { w: size.w, h: -size.h };
  }

  static floor(size: ISizeData): ISizeData {
    return { w: size.w | 0, h: size.h | 0 };
  }

  static round(size: ISizeData): ISizeData {
    return { w: Math.round(size.w), h: Math.round(size.h) };
  }

  static ceil(size: ISizeData): ISizeData {
    return { w: (size.w | 0) + 1, h: (size.h | 0) + 1 };
  }

  static eq(a: ISizeData, b: ISizeData, or = false): boolean {
    return or ? a.w === b.w || a.h === b.h : a.w === b.w && a.h === b.h;
  }

  static isLess(a: ISizeData, b: ISizeData, or = false): boolean {
    return or ? a.w < b.w || a.h < b.h : a.w < b.w && a.h < b.h;
  }

  static isMore(a: ISizeData, b: ISizeData, or = false): boolean {
    return or ? a.w > b.w || a.h > b.h : a.w > b.w && a.h > b.h;
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

  static getMinRadius(size: ISizeData): number {
    return Math.min(size.w, size.h) / 2;
  }

  clone(): ISize {
    return new Size(this);
  }

  get(): ISizeData {
    return { w: this.w, h: this.h };
  }

  set(w: number | ISizeData, h?: number): this {
    const size = Size.valueOf(w, h);

    this.w = size.w;
    this.h = size.h;

    return this;
  }

  plus(w: number | ISizeData, h?: number): this {
    return this.set(Size.plus(this, Size.valueOf(w, h)));
  }

  minus(w: number | ISizeData, h?: number): this {
    return this.set(Size.minus(this, Size.valueOf(w, h)));
  }

  multiply(w: number | ISizeData, h?: number): this {
    return this.set(Size.multiply(this, Size.valueOf(w, h)));
  }

  divide(w: number | ISizeData, h?: number, euclidean = false): this {
    return this.set(Size.divide(this, Size.valueOf(w, h), euclidean));
  }

  min(w: number | ISizeData, h?: number): this {
    return this.set(Size.min(this, Size.valueOf(w, h)));
  }

  max(w: number | ISizeData, h?: number): this {
    return this.set(Size.max(this, Size.valueOf(w, h)));
  }

  swap(): this {
    return this.set(Size.swap(this));
  }

  invert(): this {
    return this.set(Size.invert(this));
  }

  invertW(): this {
    return this.set(Size.invertW(this));
  }

  invertH(): this {
    return this.set(Size.invertH(this));
  }

  floor(): this {
    return this.set(Size.floor(this));
  }

  round(): this {
    return this.set(Size.round(this));
  }

  ceil(): this {
    return this.set(Size.ceil(this));
  }

  eq(w: number | ISizeData, h?: number, or = false): boolean {
    return Size.eq(this, Size.valueOf(w, h), or);
  }

  isLess(w: number | ISizeData, h?: number, or = false): boolean {
    return Size.isLess(this, Size.valueOf(w, h), or);
  }

  isMore(w: number | ISizeData, h?: number, or = false): boolean {
    return Size.isMore(this, Size.valueOf(w, h), or);
  }

  getMinRadius(): number {
    return Size.getMinRadius(this);
  }

  toArray(): [number, number] {
    return [this.w, this.h];
  }
}
