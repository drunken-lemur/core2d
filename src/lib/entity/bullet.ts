import {
  ellipseView,
  Entity,
  IBehavior,
  IPointData,
  IVelocity,
  IView,
  Size,
  parentSphereBehavior,
  removeAfterDelayBehavior
} from "core";
import { Color } from "core/color";

export interface IBullet extends IVelocity {
  power: number;
}

export class Bullet extends Entity {
  static readonly Speed = 5;
  static readonly Entropy = 4;
  static readonly Size = Size.valueOf(2);

  speed: number;
  style = { fillStyle: Color.White };
  views: IView<Bullet>[] = [ellipseView];
  behaviors: IBehavior<Bullet>[] = [
    bullet => bullet.moveByRotation(bullet.speed),
    removeAfterDelayBehavior(Bullet.Entropy )
  ];

  constructor(position: IPointData, angle: number) {
    super({ w: 2, h: 2 });

    this.r = angle;
    this.speed = Bullet.Speed;
    this.setSize(Bullet.Size).setPosition(position);
  }
}
