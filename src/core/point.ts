import { IWithToArray } from "./toArray";
import { Deg, IRotatable, IRotatableData, Unit } from "./rotatable";

export interface IPointData {
  x: number;
  y: number;
}

export interface IPoint extends IPointData, IRotatable, IWithToArray<number> {
  clone(): IPoint;
  get(): IPointData;
  set(x: number | IPointData, y?: number): this;
  plus(x: number | IPointData, y?: number): this;
  minus(x: number | IPointData, y?: number): this;
  multiply(x: number | IPointData, y?: number): this;
  divide(x: number | IPointData, y?: number, euclidean?: boolean): this;
  min(x: number | IPointData, y?: number): this;
  max(x: number | IPointData, y?: number): this;
  swap(): this;
  invert(): this;
  invertX(): this;
  invertY(): this;
  floor(): this;
  round(): this;
  ceil(): this;
  eq(x: number | IPointData, y?: number, or?: boolean): boolean;
  isLess(x: number | IPointData, y?: number, or?: boolean): boolean;
  isMore(x: number | IPointData, y?: number, or?: boolean): boolean;
  getDistance(x: number | IPointData, y?: number): number;
}

export class Point implements IPoint {
  x: number;
  y: number;
  r: number;

  constructor(x: number | IPointData = 0, y?: number) {
    this.x = 0;
    this.y = 0;
    this.r = 0;

    this.set(Point.valueOf(x, y));
  }

  static get(point: IPointData): IPointData {
    return { x: point.x, y: point.y };
  }

  static set(destination: IPointData, source: IPointData): IPointData {
    destination.x = source.x;
    destination.y = source.y;

    return destination;
  }

  static plus(a: IPointData, b: IPointData): IPointData {
    return { x: a.x + b.x, y: a.y + b.y };
  }

  static minus(a: IPointData, b: IPointData): IPointData {
    return { x: a.x - b.x, y: a.y - b.y };
  }

  static multiply(a: IPointData, b: IPointData): IPointData {
    return { x: a.x * b.x, y: a.y * b.y };
  }

  static divide(a: IPointData, b: IPointData, euclidean?: boolean): IPointData {
    return !euclidean
      ? { x: a.x / b.x, y: a.y / b.y }
      : { x: a.x % b.x, y: a.y % b.y };
  }

  static min(a: IPointData, b: IPointData): IPointData {
    return {
      x: Math.min(a.x, b.x),
      y: Math.min(a.y, b.y)
    };
  }

  static max(a: IPointData, b: IPointData): IPointData {
    return {
      x: Math.max(a.x, b.x),
      y: Math.max(a.y, b.y)
    };
  }

  static swap(point: IPointData): IPointData {
    // noinspection JSSuspiciousNameCombination
    return { x: point.y, y: point.x };
  }

  static invert(point: IPointData): IPointData {
    return { x: -point.x, y: -point.y };
  }

  static invertX(point: IPointData): IPointData {
    return { x: -point.x, y: point.y };
  }

  static invertY(point: IPointData): IPointData {
    return { x: point.x, y: -point.y };
  }

  static floor(point: IPointData): IPointData {
    return { x: point.x | 0, y: point.y | 0 };
  }

  static round(point: IPointData): IPointData {
    return { x: Math.round(point.x), y: Math.round(point.y) };
  }

  static ceil(point: IPointData): IPointData {
    return { x: (point.x | 0) + 1, y: (point.y | 0) + 1 };
  }

  static eq(a: IPointData, b: IPointData, or = false): boolean {
    return or ? a.x === b.x || a.y === b.y : a.x === b.x && a.y === b.y;
  }

  static isLess(a: IPointData, b: IPointData, or = false): boolean {
    return or ? a.x < b.x || a.y < b.y : a.x < b.x && a.y < b.y;
  }

  static isMore(a: IPointData, b: IPointData, or = false): boolean {
    return or ? a.x > b.x || a.y > b.y : a.x > b.x && a.y > b.y;
  }

  static valueOf(
    x: number | (IPointData & IRotatableData) = 0,
    y?: number,
    r: number = 0
  ): IPointData & IRotatableData {
    if (typeof x === "number") {
      return { x, y: y === undefined ? x : y, r };
    }

    return { x: x.x, y: x.y, r: x.r };
  }

  static random(x: number | IPointData = 1, y?: number): IPoint {
    const point = Point.valueOf(x, y);

    return new Point(Math.random() * point.x, Math.random() * point.y);
  }

  static getDistance(a: IPointData, b: IPointData): number {
    const { abs, sqrt } = Math;

    return sqrt(abs(a.x - b.x) ** 2 + abs(a.y - b.y) ** 2);
  }

  static rotate(
    point: IPointData & IRotatableData,
    angle: number,
    unit = Unit.deg
  ): IPointData & IRotatableData {
    return {
      x: point.x,
      y: point.y,
      r: (point.r || 0) + angle * -(unit === Unit.deg ? Deg : Math.PI)
    };
  }

  static moveToAngle(
    point: IPointData & IRotatableData,
    angle: number,
    length: number,
    unit = Unit.deg
  ): IPointData & IRotatableData {
    const x = length * Math.sin(angle * -(unit === Unit.deg ? Deg : Math.PI));
    const y = length * Math.cos(angle * -(unit === Unit.deg ? Deg : Math.PI));

    return {
      x: point.x + x,
      y: point.y + y,
      r: point.r
    };
  }

  static moveByRotation(
    point: IPointData & IRotatableData,
    length: number
  ): IPointData & IRotatableData {
    return Point.moveToAngle(point, point.r || 0, length);
  }

  // todo: check & remove
  static byAngle(angle: number, length: number = 1) {
    const x = length * Math.sin(angle * -Deg);
    const y = length * Math.cos(angle * -Deg);

    return Point.valueOf(x, y);
  }

  clone(): IPoint {
    return new Point(this);
  }

  get(): IPointData {
    const { x, y } = this;

    return { x, y };
  }

  set(x: number | IPointData, y?: number, r?: number): this {
    const point = Point.valueOf(x, y, r);

    this.x = point.x;
    this.y = point.y;
    this.r = point.r || 0;

    return this;
  }

  plus(x: number | IPointData, y?: number): this {
    return this.set(Point.plus(this, Point.valueOf(x, y)));
  }

  minus(x: number | IPointData, y?: number): this {
    return this.set(Point.minus(this, Point.valueOf(x, y)));
  }

  multiply(x: number | IPointData, y?: number): this {
    return this.set(Point.multiply(this, Point.valueOf(x, y)));
  }

  divide(x: number | IPointData, y?: number, euclidean = false): this {
    return this.set(Point.divide(this, Point.valueOf(x, y), euclidean));
  }

  min(x: number | IPointData, y?: number): this {
    return this.set(Point.min(this, Point.valueOf(x, y)));
  }

  max(x: number | IPointData, y?: number): this {
    return this.set(Point.max(this, Point.valueOf(x, y)));
  }

  swap(): this {
    return this.set(Point.swap(this));
  }

  invert(): this {
    return this.set(Point.invert(this));
  }

  invertX(): this {
    return this.set(Point.invertX(this));
  }

  invertY(): this {
    return this.set(Point.invertY(this));
  }

  floor(): this {
    return this.set(Point.floor(this));
  }

  round(): this {
    return this.set(Point.round(this));
  }

  ceil(): this {
    return this.set(Point.ceil(this));
  }

  eq(x: number | IPointData, y?: number, or = false): boolean {
    return Point.eq(this, Point.valueOf(x, y), or);
  }

  isLess(x: number | IPointData, y?: number, or = false): boolean {
    return Point.isLess(this, Point.valueOf(x, y), or);
  }

  isMore(x: number | IPointData, y?: number, or = false): boolean {
    return Point.isMore(this, Point.valueOf(x, y), or);
  }

  getDistance(x: number | IPointData, y?: number): number {
    return Point.getDistance(this, Point.valueOf(x, y));
  }

  rotate(angle: number, unit = Unit.deg): this {
    return this.set(Point.rotate(this, angle, unit));
  }

  moveToAngle(angle: number, length: number, unit = Unit.deg): this {
    return this.set(Point.moveToAngle(this, angle, length, unit));
  }

  moveByRotation(length: number): this {
    return this.set(Point.moveByRotation(this, length));
  }

  toArray(): [number, number] {
    return [this.x, this.y];
  }
}
