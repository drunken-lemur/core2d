import {
  Color,
  Entity,
  IBrushStyle,
  IPointData,
  IVelocity,
  IViews,
  Point,
  rectView
} from "core";

export class Player extends Entity implements IVelocity {
  velocity: IPointData;
  style: IBrushStyle = { fillStyle: Color.Blue, strokeStyle: Color.Black };

  views: IViews<this> = [rectView];

  constructor() {
    super();

    this.velocity = new Point();

    this.setPosition(60, 60).setSize(30, 30);
  }
}
