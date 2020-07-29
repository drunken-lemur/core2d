import { Position } from "./position";
import { IWithToArray } from "./toArray";
import { ISize, ISizeData, Size } from "./size";
import {Deg, IRotatable, IRotatableData, Unit} from "./rotatable";
import { IPoint, IPointData, Point } from "./point";

export interface ICorners {
  [Position.TopLeft]: IPoint;
  [Position.TopRight]: IPoint;
  [Position.BottomLeft]: IPoint;
  [Position.BottomRight]: IPoint;
}

export interface ISides {
  [Position.Top]: IBounds;
  [Position.Right]: IBounds;
  [Position.Bottom]: IBounds;
  [Position.Left]: IBounds;
}

export type ISidesIntersect = Record<keyof ISides, boolean>;

export interface IBoundsData extends ISizeData, IPointData, IRotatableData {}

export interface IBounds extends IBoundsData, IRotatable, IWithToArray {
  cloneBounds(): IBounds;
  cloneSize(): ISize;
  clonePosition(): IPoint;
  getBounds(): IBoundsData;
  getSize(): ISizeData;
  getPosition(): IPointData;
  setBounds(x: number | IBoundsData, y?: number, w?: number, h?: number): this;
  setSize(w: number | ISizeData, h?: number): this;
  setPosition(x: number | IPointData, y?: number): this;
  plusBounds(x: number | IBoundsData, y?: number, w?: number, h?: number): this;
  plusSize(w: number | ISizeData, h?: number): this;
  plusPosition(x: number | IPointData, y?: number): this;
  minusBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): this;
  minusSize(w: number | ISizeData, h?: number): this;
  minusPosition(x: number | IPointData, y?: number): this;
  multiplyBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): this;
  multiplySize(w: number | ISizeData, h?: number): this;
  multiplyPosition(x: number | IPointData, y?: number): this;
  divideBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number,
    euclidean?: boolean
  ): this;
  divideSize(w: number | ISizeData, h?: number, euclidean?: boolean): this;
  dividePosition(x: number | IPointData, y?: number, euclidean?: boolean): this;
  minBounds(x: number | IBoundsData, y?: number, w?: number, h?: number): this;
  minSize(w: number | ISizeData, h?: number): this;
  minPosition(point: IPointData): this;
  maxBounds(x: number | IBoundsData, y?: number, w?: number, h?: number): this;
  maxSize(w: number | ISizeData, h?: number): this;
  maxPosition(point: IPointData): this;
  swapBounds(): this;
  swapSize(): this;
  swapPosition(): this;
  invertBounds(): this;
  invertSize(): this;
  invertPosition(): this;
  invertX(): this;
  invertY(): this;
  invertW(): this;
  invertH(): this;
  floorBounds(): this;
  floorSize(): this;
  floorPosition(): this;
  roundBounds(): this;
  roundSize(): this;
  roundPosition(): this;
  ceilBounds(): this;
  ceilSize(): this;
  ceilPosition(): this;
  eqBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number,
    or?: boolean
  ): boolean;
  eqSize(w: number | ISizeData, h?: number, or?: boolean): boolean;
  eqPosition(x: number | IPointData, y?: number, or?: boolean): boolean;
  isLessBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number,
    or?: boolean
  ): boolean;
  isLessSize(w: number | ISizeData, y?: number, or?: boolean): boolean;
  isLessPosition(w: number | IPointData, y?: number, or?: boolean): boolean;
  isMoreBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number,
    or?: boolean
  ): boolean;
  isMoreSize(w: number | ISizeData, y?: number, or?: boolean): boolean;
  isMorePosition(w: number | IPointData, y?: number, or?: boolean): boolean;
  mergeBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): this;
  cropBounds(x: number | IBoundsData, y?: number, w?: number, h?: number): this;
  getCorners(): ICorners;
  getSides(w?: number, h?: number): ISides;
  isIntersect(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): boolean;
  getIntersectSides(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): ISidesIntersect;
  isIntersectByRadius(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): boolean;
}

export class Bounds implements IBounds {
  protected readonly size: Size;
  protected readonly position: Point;

  constructor(x: number | IBoundsData = 0, y?: number, w?: number, h?: number) {
    const bounds = Bounds.valueOf(x, y, w, h);

    this.size = new Size(bounds);
    this.position = new Point(bounds);
  }

  // @ts-ignore
  get x(): number {
    return this.position.x;
  }

  // @ts-ignore
  set x(x: number): void {
    this.position.x = x;
  }

  // @ts-ignore
  get y(): number {
    return this.position.y;
  }

  // @ts-ignore
  set y(y: number): void {
    this.position.y = y;
  }

  // @ts-ignore
  get r(): number {
    return this.position.r;
  }

  // @ts-ignore
  set r(r: number): void {
    this.position.r = r;
  }

  // @ts-ignore
  set r(r: number): void {
    this.position.r = r;
  }

  // @ts-ignore
  get r(): number {
    return this.position.r;
  }

  // @ts-ignore
  get w(): number {
    return this.size.w;
  }

  // @ts-ignore
  set w(w: number): void {
    this.size.w = w;
  }

  // @ts-ignore
  get h(): number {
    return this.size.h;
  }

  // @ts-ignore
  set h(h: number): void {
    this.size.h = h;
  }

  static plusBounds(a: IBoundsData, b: IBoundsData): IBoundsData {
    return { x: a.x + b.x, y: a.y + b.y, w: a.w + b.w, h: a.h + b.h };
  }

  static plusSize(a: IBoundsData, b: ISizeData): IBoundsData {
    return { x: a.x, y: a.y, w: a.w + b.w, h: a.h + b.h };
  }

  static plusPosition(a: IBoundsData, b: IPointData): IBoundsData {
    return { x: a.x + b.x, y: a.y + b.y, w: a.w, h: a.h };
  }

  static minusBounds(a: IBoundsData, b: IBoundsData): IBoundsData {
    return { x: a.x - b.x, y: a.y - b.y, w: a.w - b.w, h: a.h - b.h };
  }

  static minusSize(a: IBoundsData, b: ISizeData): IBoundsData {
    return { x: a.x, y: a.y, w: a.w - b.w, h: a.h - b.h };
  }

  static minusPosition(a: IBoundsData, b: IPointData): IBoundsData {
    return { x: a.x - b.x, y: a.y - b.y, w: a.w, h: a.h };
  }

  static multiplyBounds(a: IBoundsData, b: IBoundsData): IBoundsData {
    return { x: a.x * b.x, y: a.y * b.y, w: a.w * b.w, h: a.h * b.h };
  }

  static multiplySize(a: IBoundsData, b: ISizeData): IBoundsData {
    return { x: a.x, y: a.y, w: a.w * b.w, h: a.h * b.h };
  }

  static multiplyPosition(a: IBoundsData, b: IPointData): IBoundsData {
    return { x: a.x * b.x, y: a.y * b.y, w: a.w, h: a.h };
  }

  static divideBounds(
    a: IBoundsData,
    b: IBoundsData,
    euclidean?: boolean
  ): IBoundsData {
    return !euclidean
      ? { x: a.x / b.x, y: a.y / b.y, w: a.w / b.w, h: a.h / b.h }
      : { x: a.x % b.x, y: a.y % b.y, w: a.w % b.w, h: a.h % b.h };
  }

  static divideSize(
    a: IBoundsData,
    b: ISizeData,
    euclidean?: boolean
  ): IBoundsData {
    return !euclidean
      ? { x: a.x, y: a.y, w: a.w / b.w, h: a.h / b.h }
      : { x: a.x, y: a.y, w: a.w % b.w, h: a.h % b.h };
  }

  static dividePosition(
    a: IBoundsData,
    b: IPointData,
    euclidean?: boolean
  ): IBoundsData {
    return !euclidean
      ? { x: a.x / b.x, y: a.y / b.y, w: a.w, h: a.h }
      : { x: a.x % b.x, y: a.y % b.y, w: a.w, h: a.h };
  }

  static minBounds(a: IBoundsData, b: IBoundsData): IBoundsData {
    return {
      x: Math.min(a.x, b.x),
      y: Math.min(a.y, b.y),
      w: Math.min(a.w, b.w),
      h: Math.min(a.h, b.h)
    };
  }

  static minSize(a: IBoundsData, b: ISizeData): IBoundsData {
    return {
      x: a.x,
      y: a.y,
      w: Math.min(a.w, b.w),
      h: Math.min(a.h, b.h)
    };
  }

  static minPosition(a: IBoundsData, b: IPointData): IBoundsData {
    return {
      x: Math.min(a.x, b.x),
      y: Math.min(a.y, b.y),
      w: a.w,
      h: a.h
    };
  }

  static maxBounds(a: IBoundsData, b: IBoundsData): IBoundsData {
    return {
      x: Math.max(a.x, b.x),
      y: Math.max(a.y, b.y),
      w: Math.max(a.w, b.w),
      h: Math.max(a.h, b.h)
    };
  }

  static maxSize(a: IBoundsData, b: ISizeData): IBoundsData {
    return {
      x: a.x,
      y: a.y,
      w: Math.max(a.w, b.w),
      h: Math.max(a.h, b.h)
    };
  }

  static maxPosition(a: IBoundsData, b: IPointData): IBoundsData {
    return {
      x: Math.max(a.x, b.x),
      y: Math.max(a.y, b.y),
      w: a.w,
      h: a.h
    };
  }

  static swapBounds(bounds: IBoundsData): IBoundsData {
    // noinspection JSSuspiciousNameCombination
    return { x: bounds.y, y: bounds.x, w: bounds.h, h: bounds.w };
  }

  static swapSize(bounds: IBoundsData): IBoundsData {
    // noinspection JSSuspiciousNameCombination
    return { x: bounds.x, y: bounds.y, w: bounds.h, h: bounds.w };
  }

  static swapPosition(bounds: IBoundsData): IBoundsData {
    // noinspection JSSuspiciousNameCombination
    return { x: bounds.y, y: bounds.x, w: bounds.w, h: bounds.h };
  }

  static invertBounds(bounds: IBoundsData): IBoundsData {
    return { x: -bounds.x, y: -bounds.y, w: -bounds.w, h: -bounds.h };
  }

  static invertSize(bounds: IBoundsData): IBoundsData {
    return { x: bounds.x, y: bounds.y, w: -bounds.w, h: -bounds.h };
  }

  static invertPosition(bounds: IBoundsData): IBoundsData {
    return { x: -bounds.x, y: -bounds.y, w: bounds.w, h: bounds.h };
  }

  static invertX(bounds: IBoundsData): IBoundsData {
    return { x: -bounds.x, y: bounds.y, w: bounds.w, h: bounds.h };
  }

  static invertY(bounds: IBoundsData): IBoundsData {
    return { x: bounds.x, y: -bounds.y, w: bounds.w, h: bounds.h };
  }

  static invertW(bounds: IBoundsData): IBoundsData {
    return { x: bounds.x, y: bounds.y, w: -bounds.w, h: bounds.h };
  }

  static invertH(bounds: IBoundsData): IBoundsData {
    return { x: bounds.x, y: bounds.y, w: bounds.w, h: -bounds.h };
  }

  static floorBounds(bounds: IBoundsData): IBoundsData {
    return {
      x: bounds.x | 0,
      y: bounds.y | 0,
      w: bounds.w | 0,
      h: bounds.h | 0
    };
  }

  static floorSize(bounds: IBoundsData): IBoundsData {
    return {
      x: bounds.x,
      y: bounds.y,
      w: bounds.w | 0,
      h: bounds.h | 0
    };
  }

  static floorPosition(bounds: IBoundsData): IBoundsData {
    return {
      x: bounds.x | 0,
      y: bounds.y | 0,
      w: bounds.w,
      h: bounds.h
    };
  }

  static roundBounds(bounds: IBoundsData): IBoundsData {
    return {
      x: Math.round(bounds.x),
      y: Math.round(bounds.y),
      w: Math.round(bounds.w),
      h: Math.round(bounds.h)
    };
  }

  static roundSize(bounds: IBoundsData): IBoundsData {
    return {
      x: bounds.x,
      y: bounds.y,
      w: Math.round(bounds.w),
      h: Math.round(bounds.h)
    };
  }

  static roundPosition(bounds: IBoundsData): IBoundsData {
    return {
      x: Math.round(bounds.x),
      y: Math.round(bounds.y),
      w: bounds.w,
      h: bounds.h
    };
  }

  static ceilBounds(bounds: IBoundsData): IBoundsData {
    return {
      x: (bounds.x | 0) + 1,
      y: (bounds.y | 0) + 1,
      w: (bounds.w | 0) + 1,
      h: (bounds.h | 0) + 1
    };
  }

  static ceilSize(bounds: IBoundsData): IBoundsData {
    return {
      x: bounds.x,
      y: bounds.y,
      w: (bounds.w | 0) + 1,
      h: (bounds.h | 0) + 1
    };
  }

  static ceilPosition(bounds: IBoundsData): IBoundsData {
    return {
      x: (bounds.x | 0) + 1,
      y: (bounds.y | 0) + 1,
      w: bounds.w,
      h: bounds.h
    };
  }

  static eqBounds(a: IBoundsData, b: IBoundsData, or = false): boolean {
    return or
      ? a.x === b.x || a.y === b.y || a.w === b.w || a.h === b.h
      : a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
  }

  static eqSize(a: IBoundsData, b: ISizeData, or = false): boolean {
    return or ? a.w === b.w || a.h === b.h : a.w === b.w && a.h === b.h;
  }

  static eqPosition(a: IBoundsData, b: IPointData, or = false): boolean {
    return or ? a.x === b.x || a.y === b.y : a.x === b.x && a.y === b.y;
  }

  static isLessBounds(a: IBoundsData, b: IBoundsData, or = false): boolean {
    return or
      ? a.x < b.x || a.y < b.y || a.w < b.w || a.h < b.h
      : a.x < b.x && a.y < b.y && a.w < b.w && a.h < b.h;
  }

  static isLessSize(a: IBoundsData, b: ISizeData, or = false): boolean {
    return or ? a.w < b.w || a.h < b.h : a.w < b.w && a.h < b.h;
  }

  static isLessPosition(a: IBoundsData, b: IPointData, or = false): boolean {
    return or ? a.x < b.x || a.y < b.y : a.x < b.x && a.y < b.y;
  }

  static isMoreBounds(a: IBoundsData, b: IBoundsData, or = false): boolean {
    return or
      ? a.x > b.x || a.y > b.y || a.w > b.w || a.h > b.h
      : a.x > b.x && a.y > b.y && a.w > b.w && a.h > b.h;
  }

  static isMoreSize(a: IBoundsData, b: ISizeData, or = false): boolean {
    return or ? a.w > b.w || a.h > b.h : a.w > b.w && a.h > b.h;
  }

  static isMorePosition(a: IBoundsData, b: IPointData, or = false): boolean {
    return or ? a.x > b.x || a.y > b.y : a.x > b.x && a.y > b.y;
  }

  static mergeBounds(a: IBoundsData, b: IBoundsData): IBoundsData {
    return {
      x: Math.min(a.x, b.x),
      y: Math.min(a.y, b.y),
      w: Math.max(a.w, b.w),
      h: Math.max(a.h, b.h)
    };
  }

  static cropBounds(a: IBoundsData, b: IBoundsData): IBoundsData {
    return {
      x: Math.max(a.x, b.x),
      y: Math.max(a.y, b.y),
      w: Math.min(a.w, b.w),
      h: Math.min(a.h, b.h)
    };
  }

  static getCorners(bounds: IBoundsData): ICorners {
    const { x, y, w, h } = bounds;

    return {
      [Position.TopLeft]: new Point({ x, y }),
      [Position.TopRight]: new Point({ x: x + w, y }),
      [Position.BottomLeft]: new Point({ x, y: y + h }),
      [Position.BottomRight]: new Point({ x: x + w, y: y + h })
    };
  }

  static getSides(bounds: IBoundsData, w = 0, h = 0): ISides {
    return {
      [Position.Top]: new Bounds(bounds.x, bounds.y, bounds.w, h),
      [Position.Right]: new Bounds(bounds.x + bounds.w, bounds.y, -w, bounds.h),
      [Position.Bottom]: new Bounds(
        bounds.x,
        bounds.y + bounds.h,
        bounds.w,
        -h
      ),
      [Position.Left]: new Bounds(bounds.x, bounds.y, w, bounds.h)
    };
  }

  static isIntersect(a: IBoundsData, b: IBoundsData): boolean {
    return (
      a.x + a.w > b.x && a.x <= b.x + b.w && a.y + a.h > b.y && a.y <= b.y + b.h
    );
  }

  static getIntersectSides(a: IBoundsData, b: IBoundsData): ISidesIntersect {
    const sides = Bounds.getSides(a);

    return {
      [Position.Top]: Bounds.isIntersect(b, sides[Position.Top]),
      [Position.Right]: Bounds.isIntersect(b, sides[Position.Right]),
      [Position.Bottom]: Bounds.isIntersect(b, sides[Position.Bottom]),
      [Position.Left]: Bounds.isIntersect(b, sides[Position.Left])
    };
  }

  static isIntersectByRadius(a: IBoundsData, b: IBoundsData): boolean {
    const { min, abs, pow, sqrt } = Math;

    const thisRadius = min(a.w, a.h) / 2;
    const boundsRadius = min(b.w, b.h) / 2;

    const distance = sqrt(pow(abs(a.x - b.x), 2) + pow(abs(a.y - b.y), 2));

    return distance < thisRadius + boundsRadius;
  }

  static valueOf(
    x: number | IBoundsData | IPointData | ISizeData = 0,
    y?: number,
    w?: number,
    h?: number
  ): IBoundsData {
    if (typeof x === "number") {
      return {
        x,
        y: y !== undefined ? y : x,
        w: w !== undefined ? w : x,
        h: h !== undefined ? h : w !== undefined ? w : y !== undefined ? y : x
      };
    }

    return {
      // @ts-ignore
      x: x.x !== undefined ? x.x : x.w !== undefined ? x.w : 0,
      // @ts-ignore
      y: x.y !== undefined ? x.y : x.h !== undefined ? x.h : 0,
      // @ts-ignore
      w: x.w !== undefined ? x.w : x.x !== undefined ? x.x : 0,
      // @ts-ignore
      h: x.h !== undefined ? x.h : x.y !== undefined ? x.y : 0
    };
  }

  static random(
    x: number | IBoundsData | IPointData | ISizeData = 1,
    y?: number,
    w?: number,
    h?: number
  ): IBounds {
    const bounds = Bounds.valueOf(x, y, w, h);

    return new Bounds(
      Math.random() * bounds.x,
      Math.random() * bounds.y,
      Math.random() * bounds.w,
      Math.random() * bounds.h
    );
  }

  static align(
    bounds: IBoundsData,
    borderBounds: IBoundsData,
    position: Position
  ): void {
    switch (position) {
      case Position.TopLeft: {
        bounds.x = 0;
        bounds.y = 0;

        break;
      }
      case Position.Top:
      case Position.TopCenter: {
        bounds.x = borderBounds.x + (borderBounds.w - bounds.w) / 2;
        bounds.y = 0;

        break;
      }
      case Position.TopRight: {
        bounds.x = borderBounds.x + borderBounds.w - bounds.w;
        bounds.y = 0;

        break;
      }
      case Position.Left:
      case Position.CenterLeft: {
        bounds.x = 0;
        bounds.y = borderBounds.y + (borderBounds.h - bounds.h) / 2;

        break;
      }
      case Position.Center: {
        bounds.x = borderBounds.x + (borderBounds.w - bounds.w) / 2;
        bounds.y = borderBounds.y + (borderBounds.h - bounds.h) / 2;

        break;
      }
      case Position.Right:
      case Position.CenterRight: {
        bounds.x = borderBounds.x + borderBounds.w - bounds.w;
        bounds.y = borderBounds.y + (borderBounds.h - bounds.h) / 2;

        break;
      }
      case Position.BottomLeft: {
        bounds.x = 0;
        bounds.y = borderBounds.y + borderBounds.h - bounds.h;

        break;
      }
      case Position.Bottom:
      case Position.BottomCenter: {
        bounds.x = borderBounds.x + (borderBounds.w - bounds.w) / 2;
        bounds.y = borderBounds.y + borderBounds.h - bounds.h;

        break;
      }
      case Position.BottomRight: {
        bounds.x = borderBounds.x + borderBounds.w - bounds.w;
        bounds.y = borderBounds.y + borderBounds.h - bounds.h;

        break;
      }
      default: {
      }
    }
  }

  cloneBounds(): IBounds {
    return new Bounds(this);
  }

  cloneSize(): ISize {
    return new Size(this);
  }

  clonePosition(): IPoint {
    return new Point(this);
  }

  getBounds(): IBoundsData {
    const { w, h } = this.size;
    const { x, y } = this.position;

    return { x, y, w, h };
  }

  getSize(): ISizeData {
    return this.size.get();
  }

  getPosition(): IPointData {
    return this.position.get();
  }

  setBounds(x: number | IBoundsData, y?: number, w?: number, h?: number): this {
    const bounds = Bounds.valueOf(x, y, w, h);

    this.x = bounds.x;
    this.y = bounds.y;
    this.w = bounds.w;
    this.h = bounds.h;

    return this;
  }

  setSize(w: number | ISizeData, h?: number): this {
    const size = Size.valueOf(w, h);

    this.w = size.w;
    this.h = size.h;

    return this;
  }

  setPosition(x: number | IPointData, y?: number): this {
    const point = Point.valueOf(x, y);

    this.x = point.x;
    this.y = point.y;

    return this;
  }

  plusBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): this {
    return this.setBounds(Bounds.plusBounds(this, Bounds.valueOf(x, y, w, h)));
  }

  plusSize(w: number | ISizeData, h?: number): this {
    return this.setBounds(Bounds.plusSize(this, Size.valueOf(w, h)));
  }

  plusPosition(x: number | IPointData, y?: number): this {
    return this.setBounds(Bounds.plusPosition(this, Point.valueOf(x, y)));
  }

  minusBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): this {
    return this.setBounds(Bounds.minusBounds(this, Bounds.valueOf(x, y, w, h)));
  }

  minusSize(w: number | ISizeData, h?: number): this {
    return this.setBounds(Bounds.minusSize(this, Size.valueOf(w, h)));
  }

  minusPosition(x: number | IPointData, y?: number): this {
    return this.setBounds(Bounds.minPosition(this, Point.valueOf(x, y)));
  }

  multiplyBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): this {
    return this.setBounds(
      Bounds.multiplyBounds(this, Bounds.valueOf(x, y, w, h))
    );
  }

  multiplySize(w: number | ISizeData, h?: number): this {
    return this.setBounds(Bounds.multiplySize(this, Size.valueOf(w, h)));
  }

  multiplyPosition(x: number | IPointData, y?: number): this {
    return this.setBounds(Bounds.multiplyPosition(this, Point.valueOf(x, y)));
  }

  divideBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number,
    euclidean = false
  ): this {
    return this.setBounds(
      Bounds.divideBounds(this, Bounds.valueOf(x, y, w, h), euclidean)
    );
  }

  divideSize(w: number | ISizeData, h?: number, euclidean = false): this {
    return this.setBounds(
      Bounds.divideSize(this, Size.valueOf(w, h), euclidean)
    );
  }

  dividePosition(x: number | IPointData, y?: number, euclidean = false): this {
    return this.setBounds(
      Bounds.dividePosition(this, Point.valueOf(x, y), euclidean)
    );
  }

  minBounds(x: number | IBoundsData, y?: number, w?: number, h?: number): this {
    return this.setBounds(Bounds.minBounds(this, Bounds.valueOf(x, y, w, h)));
  }

  minSize(w: number | ISizeData, h?: number): this {
    return this.setBounds(Bounds.minSize(this, Size.valueOf(w, h)));
  }

  minPosition(x: number | IPointData, y?: number): this {
    return this.setBounds(Bounds.minPosition(this, Point.valueOf(x, y)));
  }

  maxBounds(x: number | IBoundsData, y?: number, w?: number, h?: number): this {
    return this.setBounds(Bounds.maxBounds(this, Bounds.valueOf(x, y, w, h)));
  }

  maxSize(w: number | ISizeData, h?: number): this {
    return this.setBounds(Bounds.maxSize(this, Size.valueOf(w, h)));
  }

  maxPosition(x: number | IPointData, y?: number): this {
    return this.setBounds(Bounds.maxPosition(this, Point.valueOf(x, y)));
  }

  swapBounds(): this {
    return this.setBounds(Bounds.swapBounds(this));
  }

  swapSize(): this {
    return this.setBounds(Bounds.swapSize(this));
  }

  swapPosition(): this {
    return this.setBounds(Bounds.swapPosition(this));
  }

  invertBounds(): this {
    return this.setBounds(Bounds.invertBounds(this));
  }

  invertSize(): this {
    return this.setBounds(Bounds.invertSize(this));
  }

  invertPosition(): this {
    return this.setBounds(Bounds.invertPosition(this));
  }

  invertX(): this {
    return this.setBounds(Bounds.invertX(this));
  }

  invertY(): this {
    return this.setBounds(Bounds.invertY(this));
  }

  invertW(): this {
    return this.setBounds(Bounds.invertW(this));
  }

  invertH(): this {
    return this.setBounds(Bounds.invertH(this));
  }

  floorBounds(): this {
    return this.setBounds(Bounds.floorBounds(this));
  }

  floorSize(): this {
    return this.setBounds(Bounds.floorSize(this));
  }

  floorPosition(): this {
    return this.setBounds(Bounds.floorPosition(this));
  }

  roundBounds(): this {
    return this.setBounds(Bounds.roundBounds(this));
  }

  roundSize(): this {
    return this.setBounds(Bounds.roundSize(this));
  }

  roundPosition(): this {
    return this.setBounds(Bounds.roundPosition(this));
  }

  ceilBounds(): this {
    return this.setBounds(Bounds.ceilBounds(this));
  }

  ceilSize(): this {
    return this.setBounds(Bounds.ceilSize(this));
  }

  ceilPosition(): this {
    return this.setBounds(Bounds.ceilPosition(this));
  }

  eqBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number,
    or = false
  ): boolean {
    return Bounds.eqBounds(this, Bounds.valueOf(x, y, w, h), or);
  }

  eqSize(w: number | ISizeData, h?: number, or = false): boolean {
    return Bounds.eqSize(this, Size.valueOf(w, h), or);
  }

  eqPosition(x: number | IPointData, y?: number, or = false): boolean {
    return Bounds.eqPosition(this, Point.valueOf(x, y), or);
  }

  isLessBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number,
    or = false
  ): boolean {
    return Bounds.isLessBounds(this, Bounds.valueOf(x, y, w, h), or);
  }

  isLessSize(w: number | ISizeData, h?: number, or = false): boolean {
    return Bounds.isLessSize(this, Size.valueOf(w, h), or);
  }

  isLessPosition(x: number | IPointData, y?: number, or = false): boolean {
    return Bounds.isLessPosition(this, Point.valueOf(x, y), or);
  }

  isMoreBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number,
    or = false
  ): boolean {
    return Bounds.isMoreBounds(this, Bounds.valueOf(x, y, w, h), or);
  }

  isMoreSize(w: number | ISizeData, h?: number, or = false): boolean {
    return Bounds.isMoreSize(this, Size.valueOf(w, h), or);
  }

  isMorePosition(x: number | IPointData, y?: number, or = false): boolean {
    return Bounds.isMorePosition(this, Point.valueOf(x, y), or);
  }

  mergeBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): this {
    return this.setBounds(Bounds.mergeBounds(this, Bounds.valueOf(x, y, w, h)));
  }

  cropBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): this {
    return this.setBounds(Bounds.cropBounds(this, Bounds.valueOf(x, y, w, h)));
  }

  getCorners(): ICorners {
    return Bounds.getCorners(this);
  }

  getSides(w = 0, h = 0): ISides {
    return Bounds.getSides(this, w, h);
  }

  isIntersect(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): boolean {
    return Bounds.isIntersect(this, Bounds.valueOf(x, y, w, h));
  }

  getIntersectSides(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): ISidesIntersect {
    return Bounds.getIntersectSides(this, Bounds.valueOf(x, y, w, h));
  }

  isIntersectByRadius(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): boolean {
    return Bounds.isIntersectByRadius(this, Bounds.valueOf(x, y, w, h));
  }

  toArray(): [number, number, number, number] {
    return [...this.position.toArray(), ...this.size.toArray()];
  }

  align(bounds: IBoundsData, position: Position): this {
    Bounds.align(this, bounds, position);

    return this;
  }

  moveByRotation(length: number): this {
    this.position.moveByRotation(length);

    return this;
  }

  moveToAngle(angle: number, length: number, unit = Unit.deg): this {
    this.position.moveToAngle(angle, length, unit);

    return this;
  }

  rotate(angle: number, unit = Unit.deg): this {
    this.position.rotate(angle, unit);

    return this;
  }
}
