import { Position } from "./position";
import { IWithToArray } from "./toArray";
import { Size, ISize, ISizeData } from "./size";
import { Point, IPoint, IPointData } from "./point";

export interface ICorners {
  [Position.TOP_LEFT]: IPoint;
  [Position.TOP_RIGHT]: IPoint;
  [Position.BOTTOM_LEFT]: IPoint;
  [Position.BOTTOM_RIGHT]: IPoint;
}

export interface IBoundsData extends ISizeData, IPointData {}

export interface IBounds extends IBoundsData, IWithToArray {
  getBounds: () => IBoundsData;
  getSize: () => ISizeData;
  getPosition: () => IPointData;
  setBounds: (bounds: IBoundsData) => this;
  setSize: (size: ISizeData) => this;
  setPosition: (position: IPointData) => this;
  plusBounds: (bounds: IBounds) => this;
  plusSize: (size: ISizeData) => this;
  plusPosition: (position: IPointData) => this;
  minusBounds: (bounds: IBoundsData) => this;
  minusSize: (size: ISizeData) => this;
  minusPosition: (position: IPointData) => this;
  multiplyBounds: (bounds: IBoundsData) => this;
  multiplySize: (size: ISizeData) => this;
  multiplyPosition: (position: IPointData) => this;
  divideBounds: (bounds: IBoundsData) => this;
  divideSize: (size: ISizeData) => this;
  dividePosition: (position: IPointData) => this;
  invertBounds: () => this;
  invertSize: () => this;
  invertPosition: () => this;
  swapBounds: () => this;
  swapSize: () => this;
  swapPosition: () => this;
  invertX: () => this;
  invertY: () => this;
  invertW: () => this;
  invertH: () => this;
  cloneBounds: () => IBounds;
  cloneSize: () => ISize;
  clonePosition: () => IPoint;
  eqBounds: (bounds: IBoundsData) => boolean;
  eqSize: (size: ISizeData) => boolean;
  eqPosition: (position: IPointData) => boolean;
  minBounds: (bounds: IBoundsData) => this;
  minSize: (size: ISizeData) => this;
  minPosition: (point: IPointData) => this;
  maxBounds: (bounds: IBoundsData) => this;
  maxSize: (size: ISizeData) => this;
  maxPosition: (point: IPointData) => this;
  mergeBounds: (bounds: IBoundsData) => this;
  cropBounds: (bounds: IBoundsData) => this;
  getCorners: () => ICorners;
  isIntersect: (bounds: IBoundsData) => boolean;
  ceilBounds: () => this;
  ceilSize: () => this;
  ceilPosition: () => this;
  roundBounds: () => this;
  roundSize: () => this;
  roundPosition: () => this;
  floorBounds: () => this;
  floorSize: () => this;
  floorPosition: () => this;
  lessThanBounds: (bounds: IBoundsData, orEqual: boolean) => boolean;
  lessThanSize: (size: ISizeData, orEqual: boolean) => boolean;
  lessThanPosition: (point: IPointData, orEqual: boolean) => boolean;
}

export class Bounds implements IBounds {
  protected readonly size: Size;
  protected readonly position: Point;

  static valueOf = (
    x?: number | IBoundsData,
    y: number = 0,
    w: number = 0,
    h: number = 0
  ): IBoundsData => {
    if (typeof x === "number") {
      return { x, y, w, h };
    } else if (x) {
      return { x: x.x, y: x.y, w: x.w, h: x.h };
    } else {
      return { x: 0, y, w, h };
    }
  };

  static objectOf = (
    x?: number | IBoundsData,
    y: number = 0,
    w: number = 0,
    h: number = 0
  ): Bounds => {
    return new Bounds(Bounds.valueOf(x, y, w, h));
  };

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

  constructor(bounds?: IBoundsData) {
    this.size = new Size(bounds);
    this.position = new Point(bounds);
  }

  getBounds = (): IBoundsData => {
    const { w, h } = this.size;
    const { x, y } = this.position;

    return { x, y, w, h };
  };

  getSize = () => this.size.get();

  getPosition = () => this.position.get();

  setBounds = (bounds: IBoundsData) => {
    const { x, y, w, h } = bounds;

    Object.assign(this, { x, y, w, h });

    return this;
  };

  setSize = (size: ISizeData) => {
    this.size.set(size);

    return this;
  };

  setPosition = (position: IPointData) => {
    this.position.set(position);

    return this;
  };

  plusBounds = (bounds: IBoundsData) => {
    this.size.plus(bounds);
    this.position.plus(bounds);

    return this;
  };

  plusSize = (size: ISizeData) => {
    this.size.plus(size);

    return this;
  };

  plusPosition = (position: IPointData) => {
    this.position.plus(position);

    return this;
  };

  minusBounds = (bounds: IBoundsData) => {
    this.size.minus(bounds);
    this.position.minus(bounds);

    return this;
  };

  minusSize = (size: ISizeData) => {
    this.size.minus(size);

    return this;
  };

  minusPosition = (position: IPointData) => {
    this.position.minus(position);

    return this;
  };

  multiplyBounds = (bounds: IBoundsData) => {
    this.size.multiply(bounds);
    this.position.multiply(bounds);

    return this;
  };

  multiplySize = (size: ISizeData) => {
    this.size.multiply(size);

    return this;
  };

  multiplyPosition = (position: IPointData) => {
    this.position.multiply(position);

    return this;
  };

  divideBounds = (bounds: IBoundsData) => {
    this.size.divide(bounds);
    this.position.divide(bounds);

    return this;
  };

  divideSize = (size: ISizeData) => {
    this.size.divide(size);

    return this;
  };

  dividePosition = (position: IPointData) => {
    this.position.divide(position);

    return this;
  };

  invertBounds = () => {
    this.size.invert();
    this.position.invert();

    return this;
  };

  invertSize = () => {
    this.size.invert();

    return this;
  };

  invertPosition = () => {
    this.position.invert();

    return this;
  };

  invertX = () => {
    this.position.invertX();

    return this;
  };

  invertY = () => {
    this.position.invertY();

    return this;
  };

  invertW = () => {
    this.size.invertW();

    return this;
  };

  invertH = () => {
    this.size.invertH();

    return this;
  };

  swapBounds = () => {
    this.size.swap();
    this.position.swap();

    return this;
  };

  swapSize = () => {
    this.size.swap();

    return this;
  };

  swapPosition = () => {
    this.position.swap();

    return this;
  };

  cloneBounds = () => new Bounds(this.getBounds());

  cloneSize = () => new Size(this.size.get());

  clonePosition = () => new Point(this.position.get());

  eqBounds = (bounds: IBoundsData) => {
    return (
      this.position.x === bounds.x &&
      this.position.y === bounds.y &&
      this.size.w === bounds.w &&
      this.size.h === bounds.h
    );
  };

  eqSize = (size: ISizeData) => this.size.eq(size);

  eqPosition = (position: IPointData) => this.position.eq(position);

  minBounds = (bounds: IBoundsData) => {
    this.size.w = Math.min(this.size.w, bounds.w);
    this.size.h = Math.min(this.size.h, bounds.h);
    this.position.x = Math.min(this.position.x, bounds.x);
    this.position.y = Math.min(this.position.y, bounds.y);

    return this;
  };

  minSize = (size: ISizeData) => {
    this.size.w = Math.min(this.size.w, size.w);
    this.size.h = Math.min(this.size.h, size.h);

    return this;
  };

  minPosition = (point: IPointData) => {
    this.position.x = Math.min(this.position.x, point.x);
    this.position.y = Math.min(this.position.y, point.y);

    return this;
  };

  maxBounds = (bounds: IBoundsData) => {
    this.size.w = Math.max(this.size.w, bounds.w);
    this.size.h = Math.max(this.size.h, bounds.h);
    this.position.x = Math.max(this.position.x, bounds.x);
    this.position.y = Math.max(this.position.y, bounds.y);

    return this;
  };

  maxSize = (size: ISizeData) => {
    this.size.w = Math.max(this.size.w, size.w);
    this.size.h = Math.max(this.size.h, size.h);

    return this;
  };

  maxPosition = (point: IPointData) => {
    this.position.x = Math.max(this.position.x, point.x);
    this.position.y = Math.max(this.position.y, point.y);

    return this;
  };

  mergeBounds = (bounds: IBoundsData) => {
    this.size.max(bounds);
    this.position.min(bounds);

    return this;
  };

  cropBounds = (bounds: IBoundsData) => {
    this.size.min(bounds);
    this.position.max(bounds);

    return this;
  };

  getCorners = (): ICorners => {
    const { w, h } = this.size;
    const { x, y } = this.position;

    return {
      [Position.TOP_LEFT]: Point.objectOf({ x, y }),
      [Position.TOP_RIGHT]: Point.objectOf({ x: x + w, y }),
      [Position.BOTTOM_LEFT]: Point.objectOf({ x, y: y + h }),
      [Position.BOTTOM_RIGHT]: Point.objectOf({ x: x + w, y: y + h })
    };
  };

  isIntersect = (bounds: IBoundsData) => {
    return (
      this.position.x + this.size.w > bounds.x &&
      this.position.x < bounds.x + bounds.w &&
      this.position.y + this.size.h > bounds.y &&
      this.position.y < bounds.y + bounds.h
    );
  };

  ceilBounds = () => {
    this.size.ceil();
    this.position.ceil();

    return this;
  };

  ceilSize = () => {
    this.size.ceil();

    return this;
  };

  ceilPosition = () => {
    this.position.ceil();

    return this;
  };

  roundBounds = () => {
    this.size.round();
    this.position.round();

    return this;
  };

  roundSize = () => {
    this.size.round();

    return this;
  };

  roundPosition = () => {
    this.position.round();

    return this;
  };

  floorBounds = () => {
    this.size.floor();
    this.position.floor();

    return this;
  };

  floorSize = () => {
    this.size.floor();

    return this;
  };

  floorPosition = () => {
    this.position.floor();

    return this;
  };

  lessThanBounds = (bounds: IBoundsData, orEqual: boolean = false) => {
    return (
      this.size.lessThan(bounds, orEqual) &&
      this.position.lessThan(bounds, orEqual)
    );
  };

  lessThanSize = (size: ISizeData, orEqual: boolean = false) => {
    return this.size.lessThan(size, orEqual);
  };

  lessThanPosition = (ponit: IPointData, orEqual: boolean = false) => {
    return this.position.lessThan(ponit, orEqual);
  };

  toArray = () => [...this.position.toArray(), ...this.size.toArray()];
}
