import { IWithToArray } from "./toArray";
import { Deg, IRotatable, Unit } from "./rotatable";

export interface IPointData {
  x: number;
  y: number;
}

export interface IPoint extends IPointData, IRotatable, IWithToArray<number> {
  get: () => IPointData;
  set: (x: number | IPointData, y?: number) => this;
  plus: (x: number | IPointData, y?: number) => this;
  minus: (x: number | IPointData, y?: number) => this;
  multiply: (x: number | IPointData, y?: number) => this;
  divide: (x: number | IPointData, y?: number, euclidean?: boolean) => this;
  invert: () => this;
  swap: () => this;
  clone: () => IPoint;
  eq: (x: number | IPointData, y?: number) => boolean;
  min: (x: number | IPointData, y?: number) => this;
  max: (x: number | IPointData, y?: number) => this;
  invertX: () => this;
  invertY: () => this;
  ceil: () => this;
  round: () => this;
  floor: () => this;
  lessThan: (orEqual: boolean, x: number | IPointData, y?: number) => boolean;
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

  static valueOf(x: number | IPointData = 0, y?: number): IPointData {
    if (typeof x === "number") {
      return { x, y: y === undefined ? x : y };
    }

    return { x: x.x, y: x.y };
  }

  static random(x: number | IPointData = 1, y?: number): IPoint {
    const point = Point.valueOf(x, y);

    return new Point(Math.random() * point.x, Math.random() * point.y);
  }

  static byAngle = (angle: number, length: number = 1) => {
    const x = length * Math.sin(angle * -Deg);
    const y = length * Math.cos(angle * -Deg);

    return Point.valueOf(x, y);
  };

  get = (): IPointData => ({ x: this.x, y: this.y });

  set = (x: number | IPointData, y?: number) => {
    Object.assign(this, Point.valueOf(x, y));

    return this;
  };

  plus = (x: number | IPointData, y?: number) => {
    const point = Point.valueOf(x, y);

    this.x += point.x;
    this.y += point.y;

    return this;
  };

  minus = (x: number | IPointData, y?: number) => {
    const point = Point.valueOf(x, y);

    this.x -= point.x;
    this.y -= point.y;

    return this;
  };

  multiply = (x: number | IPointData, y?: number) => {
    const point = Point.valueOf(x, y);

    this.x *= point.x;
    this.y *= point.y;

    return this;
  };

  divide = (x: number | IPointData, y?: number, euclidean = false) => {
    const point = Point.valueOf(x, y);

    if (!point.x || !point.y) {
      throw new Error(
        `Wrong divide arguments { x: ${point.x}, y: ${point.y}} !`
      );
    }

    if (!euclidean) {
      this.x /= point.x;
      this.y /= point.y;
    } else {
      this.x %= point.x;
      this.y %= point.y;
    }

    return this;
  };

  invert = () => this.multiply({ x: -1, y: -1 });

  // noinspection JSSuspiciousNameCombination
  swap = () => this.set({ x: this.y, y: this.x });

  clone = () => new Point(this.get());

  eq = (x: number | IPointData, y?: number) => {
    const point = Point.valueOf(x, y);

    return this.x === point.x && this.y === point.y;
  };

  min = (x: number | IPointData, y?: number) => {
    const point = Point.valueOf(x, y);

    this.x = Math.min(this.x, point.x);
    this.y = Math.min(this.y, point.y);

    return this;
  };

  max = (x: number | IPointData, y?: number) => {
    const point = Point.valueOf(x, y);

    this.x = Math.max(this.x, point.x);
    this.y = Math.max(this.y, point.y);

    return this;
  };

  invertX = () => this.multiply({ x: -1, y: 1 });

  invertY = () => this.multiply({ x: 1, y: -1 });

  ceil = () => {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);

    return this;
  };

  round = () => {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    return this;
  };

  floor = () => {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);

    return this;
  };

  lessThan = (orEqual: boolean, x: number | IPointData, y?: number) => {
    const point = Point.valueOf(x, y);

    if (orEqual) {
      return this.x <= point.x && this.y <= point.y;
    } else {
      return this.x < point.x && this.y < point.y;
    }
  };

  moveByRotation = (length: number) => {
    return this.moveToAngle(this.r, length);
  };

  moveToAngle = (angle: number, length: number, unit = Unit.deg) => {
    this.x += length * Math.sin(angle * -(unit === Unit.deg ? Deg : Math.PI));
    this.y += length * Math.cos(angle * -(unit === Unit.deg ? Deg : Math.PI));

    return this;
  };

  rotate = (angle: number, unit = Unit.deg) => {
    this.r += angle * -(unit === Unit.deg ? Deg : Math.PI);

    return this;
  };

  toArray = () => [this.x, this.y];
}
