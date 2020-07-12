import { Position } from "./position";
import { IWithToArray } from "./toArray";
import { IRotatable, Unit } from "./rotatable";
import { ISize, ISizeData, Size } from "./size";
import { IPoint, IPointData, Point } from "./point";

export interface ICorners {
  [Position.TopLeft]: IPoint;
  [Position.TopRight]: IPoint;
  [Position.BottomLeft]: IPoint;
  [Position.BottomRight]: IPoint;
}

export interface IBoundsData extends ISizeData, IPointData {}

export interface IBounds extends IBoundsData, IRotatable, IWithToArray {
  getBounds(): IBoundsData;
  getSize(): ISizeData;
  getPosition(): IPointData;
  setBounds(x: number | IBoundsData, y?: number, w?: number, h?: number): this;
  setSize(w: number | ISizeData, h?: number): this;
  setPosition(x: number | IPointData, y?: number): this;
  plusBounds(bounds: IBounds): this;
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
    h?: number
  ): this;
  divideSize(w: number | ISizeData, h?: number, euclidean?: boolean): this;
  dividePosition(x: number | IPointData, y?: number, euclidean?: boolean): this;
  invertBounds(): this;
  invertSize(): this;
  invertPosition(): this;
  swapBounds(): this;
  swapSize(): this;
  swapPosition(): this;
  invertX(): this;
  invertY(): this;
  invertW(): this;
  invertH(): this;
  cloneBounds(): IBounds;
  cloneSize(): ISize;
  clonePosition(): IPoint;
  eqBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): boolean;
  eqSize(w: number | ISizeData, h?: number): boolean;
  eqPosition(x: number | IPointData, y?: number): boolean;
  minBounds(x: number | IBoundsData, y?: number, w?: number, h?: number): this;
  minSize(w: number | ISizeData, h?: number): this;
  minPosition(point: IPointData): this;
  maxBounds(x: number | IBoundsData, y?: number, w?: number, h?: number): this;
  maxSize(w: number | ISizeData, h?: number): this;
  maxPosition(point: IPointData): this;
  mergeBounds(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): this;
  cropBounds(x: number | IBoundsData, y?: number, w?: number, h?: number): this;
  getCorners(): ICorners;
  isIntersect(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): boolean;
  isIntersectByRadius(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): boolean;
  ceilBounds(): this;
  ceilSize(): this;
  ceilPosition(): this;
  roundBounds(): this;
  roundSize(): this;
  roundPosition(): this;
  floorBounds(): this;
  floorSize(): this;
  floorPosition(): this;
  lessThanBounds(
    orEqual: boolean,
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ): boolean;
  lessThanSize(orEqual: boolean, w: number | ISizeData, h?: number): boolean;
  lessThanPosition(
    orEqual: boolean,
    x: number | IPointData,
    y?: number
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
  get x() {
    return this.position.x;
  }
  // @ts-ignore
  set x(x: number) {
    this.position.x = x;
  }

  // @ts-ignore
  get y() {
    return this.position.y;
  }
  // @ts-ignore
  set y(y: number) {
    this.position.y = y;
  }

  // @ts-ignore
  get r() {
    return this.position.r;
  }
  // @ts-ignore
  set r(r: number) {
    this.position.r = r;
  }

  // @ts-ignore
  get w() {
    return this.size.w;
  }
  // @ts-ignore
  set w(w: number) {
    this.size.w = w;
  }

  // @ts-ignore
  get h() {
    return this.size.h;
  }
  // @ts-ignore
  set h(h: number) {
    this.size.h = h;
  }

  static align(
    bounds: IBoundsData,
    borderBounds: IBoundsData,
    position: Position
  ) {
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

  static valueOf(
    x: number | IBoundsData | IPointData | ISizeData = 0,
    y?: number,
    w?: number,
    h?: number
  ) {
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

  getBounds(): IBoundsData {
    const { w, h } = this.size;
    const { x, y } = this.position;

    return { x, y, w, h };
  }

  getSize() {
    return this.size.get();
  }

  getPosition() {
    return this.position.get();
  }

  setBounds(x: number | IBoundsData, y?: number, w?: number, h?: number) {
    Object.assign(this, Bounds.valueOf(x, y, w, h));

    return this;
  }

  setSize(w: number | ISizeData, h?: number) {
    this.size.set(Size.valueOf(w, h));

    return this;
  }

  setPosition(x: number | IPointData, y?: number) {
    this.position.set(Point.valueOf(x, y));

    return this;
  }

  plusBounds(x: number | IBoundsData, y?: number, w?: number, h?: number) {
    const bounds = Bounds.valueOf(x, y, w, h);

    this.size.plus(bounds);
    this.position.plus(bounds);

    return this;
  }

  plusSize(w: number | ISizeData, h?: number) {
    this.size.plus(Size.valueOf(w, h));

    return this;
  }

  plusPosition(x: number | IPointData, y?: number) {
    this.position.plus(Point.valueOf(x, y));

    return this;
  }

  minusBounds(x: number | IBoundsData, y?: number, w?: number, h?: number) {
    const bounds = Bounds.valueOf(x, y, w, h);

    this.size.minus(bounds);
    this.position.minus(bounds);

    return this;
  }

  minusSize(w: number | ISizeData, h?: number) {
    this.size.minus(Size.valueOf(w, h));

    return this;
  }

  minusPosition(x: number | IPointData, y?: number) {
    this.position.minus(Point.valueOf(x, y));

    return this;
  }

  multiplyBounds(x: number | IBoundsData, y?: number, w?: number, h?: number) {
    const bounds = Bounds.valueOf(x, y, w, h);

    this.size.multiply(bounds);
    this.position.multiply(bounds);

    return this;
  }

  multiplySize(w: number | ISizeData, h?: number) {
    this.size.multiply(Size.valueOf(w, h));

    return this;
  }

  multiplyPosition(x: number | IPointData, y?: number) {
    this.position.multiply(Point.valueOf(x, y));

    return this;
  }

  divideBounds(x: number | IBoundsData, y?: number, w?: number, h?: number) {
    const bounds = Bounds.valueOf(x, y, w, h);

    this.size.divide(bounds);
    this.position.divide(bounds);

    return this;
  }

  divideSize(w: number | ISizeData, h?: number, euclidean = false) {
    this.size.divide(w, h, euclidean);

    return this;
  }

  dividePosition(x: number | IPointData, y?: number, euclidean = false) {
    this.position.divide(x, y, euclidean);

    return this;
  }

  invertBounds() {
    this.size.invert();
    this.position.invert();

    return this;
  }

  invertSize() {
    this.size.invert();

    return this;
  }

  invertPosition() {
    this.position.invert();

    return this;
  }

  invertX() {
    this.position.invertX();

    return this;
  }

  invertY() {
    this.position.invertY();

    return this;
  }

  invertW() {
    this.size.invertW();

    return this;
  }

  invertH() {
    this.size.invertH();

    return this;
  }

  swapBounds() {
    this.size.swap();
    this.position.swap();

    return this;
  }

  swapSize() {
    this.size.swap();

    return this;
  }

  swapPosition() {
    this.position.swap();

    return this;
  }

  cloneBounds() {
    return new Bounds(this.getBounds());
  }

  cloneSize() {
    return new Size(this.size.get());
  }

  clonePosition() {
    return new Point(this.position.get());
  }

  eqBounds(x: number | IBoundsData, y?: number, w?: number, h?: number) {
    const bounds = Bounds.valueOf(x, y, w, h);

    return (
      this.position.x === bounds.x &&
      this.position.y === bounds.y &&
      this.size.w === bounds.w &&
      this.size.h === bounds.h
    );
  }

  eqSize(w: number | ISizeData, h?: number) {
    return this.size.eq(Size.valueOf(w, h));
  }

  eqPosition(x: number | IPointData, y?: number) {
    return this.position.eq(Point.valueOf(x, y));
  }

  minBounds(x: number | IBoundsData, y?: number, w?: number, h?: number) {
    const bounds = Bounds.valueOf(x, y, w, h);

    this.size.w = Math.min(this.size.w, bounds.w);
    this.size.h = Math.min(this.size.h, bounds.h);
    this.position.x = Math.min(this.position.x, bounds.x);
    this.position.y = Math.min(this.position.y, bounds.y);

    return this;
  }

  minSize(w: number | ISizeData, h?: number) {
    const size = Size.valueOf(w, h);

    this.size.w = Math.min(this.size.w, size.w);
    this.size.h = Math.min(this.size.h, size.h);

    return this;
  }

  minPosition(point: IPointData) {
    this.position.x = Math.min(this.position.x, point.x);
    this.position.y = Math.min(this.position.y, point.y);

    return this;
  }

  maxBounds(x: number | IBoundsData, y?: number, w?: number, h?: number) {
    const bounds = Bounds.valueOf(x, y, w, h);

    this.size.w = Math.max(this.size.w, bounds.w);
    this.size.h = Math.max(this.size.h, bounds.h);
    this.position.x = Math.max(this.position.x, bounds.x);
    this.position.y = Math.max(this.position.y, bounds.y);

    return this;
  }

  maxSize(w: number | ISizeData, h?: number) {
    const size = Size.valueOf(w, h);

    this.size.w = Math.max(this.size.w, size.w);
    this.size.h = Math.max(this.size.h, size.h);

    return this;
  }

  maxPosition(point: IPointData) {
    this.position.x = Math.max(this.position.x, point.x);
    this.position.y = Math.max(this.position.y, point.y);

    return this;
  }

  mergeBounds(x: number | IBoundsData, y?: number, w?: number, h?: number) {
    const bounds = Bounds.valueOf(x, y, w, h);

    this.size.max(bounds);
    this.position.min(bounds);

    return this;
  }

  cropBounds(x: number | IBoundsData, y?: number, w?: number, h?: number) {
    const bounds = Bounds.valueOf(x, y, w, h);

    this.size.min(bounds);
    this.position.max(bounds);

    return this;
  }

  getCorners(): ICorners {
    const { w, h } = this.size;
    const { x, y } = this.position;

    return {
      [Position.TopLeft]: new Point({ x, y }),
      [Position.TopRight]: new Point({ x: x + w, y }),
      [Position.BottomLeft]: new Point({ x, y: y + h }),
      [Position.BottomRight]: new Point({ x: x + w, y: y + h })
    };
  }

  isIntersect(x: number | IBoundsData, y?: number, w?: number, h?: number) {
    const bounds = Bounds.valueOf(x, y, w, h);

    return (
      this.position.x + this.size.w > bounds.x &&
      this.position.x < bounds.x + bounds.w &&
      this.position.y + this.size.h > bounds.y &&
      this.position.y < bounds.y + bounds.h
    );
  }

  // @deprecated // todo: fix logic
  isIntersectByRadius(
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ) {
    const { min, abs, pow, sqrt } = Math;
    const bounds = Bounds.valueOf(x, y, w, h);

    const thisRadius = min(this.w, this.h) / 2;
    const boundsRadius = min(bounds.w, bounds.h) / 2;

    const distance = sqrt(
      pow(abs(this.x - bounds.x), 2) + pow(abs(this.y - bounds.y), 2)
    );

    return distance < thisRadius + boundsRadius;
  }

  ceilBounds() {
    this.size.ceil();
    this.position.ceil();

    return this;
  }

  ceilSize() {
    this.size.ceil();

    return this;
  }

  ceilPosition() {
    this.position.ceil();

    return this;
  }

  roundBounds() {
    this.size.round();
    this.position.round();

    return this;
  }

  roundSize() {
    this.size.round();

    return this;
  }

  roundPosition() {
    this.position.round();

    return this;
  }

  floorBounds() {
    this.size.floor();
    this.position.floor();

    return this;
  }

  floorSize() {
    this.size.floor();

    return this;
  }

  floorPosition() {
    this.position.floor();

    return this;
  }

  lessThanBounds(
    orEqual: boolean,
    x: number | IBoundsData,
    y?: number,
    w?: number,
    h?: number
  ) {
    const bounds = Bounds.valueOf(x, y, w, h);

    return (
      this.size.lessThan(orEqual, bounds) &&
      this.position.lessThan(orEqual, bounds)
    );
  }

  lessThanSize(orEqual: boolean, w: number | ISizeData, h?: number) {
    return this.size.lessThan(orEqual, Size.valueOf(w, h));
  }

  lessThanPosition(orEqual: boolean, x: number | IPointData, y?: number) {
    return this.position.lessThan(orEqual, Point.valueOf(x, y));
  }

  toArray() {
    return [...this.position.toArray(), ...this.size.toArray()];
  }

  align(bounds: IBoundsData, position: Position) {
    Bounds.align(this, bounds, position);

    return this;
  }

  moveByRotation(length: number) {
    this.position.moveByRotation(length);

    return this;
  }

  moveToAngle(angle: number, length: number, unit = Unit.deg) {
    this.position.moveToAngle(angle, length, unit);

    return this;
  }

  rotate(angle: number, unit = Unit.deg) {
    this.position.rotate(angle, unit);

    return this;
  }
}
