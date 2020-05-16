import { IWithToArray } from "./toArray";

export interface IPointData {
  x: number;
  y: number;
}

export interface IPoint extends IPointData, IWithToArray<number> {
  get: () => IPointData;
  set: (point: IPointData) => this;
  plus: (point: IPointData) => this;
  minus: (point: IPointData) => this;
  multiply: (point: IPointData) => this;
  divide: (point: IPointData) => this;
  invert: () => this;
  swap: () => this;
  clone: () => IPoint;
  eq: (point: IPointData) => boolean;
  min: (point: IPointData) => this;
  max: (point: IPointData) => this;
  invertX: () => this;
  invertY: () => this;
  ceil: () => this;
  round: () => this;
  floor: () => this;
  lessThan: (point: IPointData, orEqual: boolean) => boolean;
}

export class Point implements IPoint {
  x: number;
  y: number;

  static valueOf = (x?: number | IPointData, y: number = 0): IPointData => {
    if (typeof x === "number") {
      return { x, y };
    } else if (x) {
      return { x: x.x, y: x.y };
    } else {
      return { x: 0, y };
    }
  };

  static objectOf = (x?: number | IPointData, y: number = 0): Point => {
    return new Point(Point.valueOf(x, y));
  };

  constructor(point?: IPointData) {
    this.x = 0;
    this.y = 0;

    if (point) {
      this.set(point);
    }
  }

  get = (): IPointData => ({ x: this.x, y: this.y });

  set = (point: IPointData) => {
    Object.assign(this, point);

    return this;
  };

  plus = (point: IPointData) => {
    this.x += point.x;
    this.y += point.y;

    return this;
  };

  minus = (point: IPointData) => {
    this.x -= point.x;
    this.y -= point.y;

    return this;
  };

  multiply = (point: IPointData) => {
    this.x *= point.x;
    this.y *= point.y;

    return this;
  };

  divide = (point: IPointData) => {
    this.x /= point.x;
    this.y /= point.y;

    return this;
  };

  invert = () => this.multiply({ x: -1, y: -1 });

  // noinspection JSSuspiciousNameCombination
  swap = () => this.set({ x: this.y, y: this.x });

  clone = () => new Point(this.get());

  eq = (point: IPointData) => this.x === point.x && this.y === point.y;

  min = (point: IPointData) => {
    this.x = Math.min(this.x, point.x);
    this.y = Math.min(this.y, point.y);

    return this;
  };

  max = (point: IPointData) => {
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

  lessThan = (point: IPointData, orEqual: boolean = false) => {
    if (orEqual) {
      return this.x <= point.x && this.y <= point.y;
    } else {
      return this.x < point.x && this.y < point.y;
    }
  };

  toArray = () => [this.x, this.y];
}
