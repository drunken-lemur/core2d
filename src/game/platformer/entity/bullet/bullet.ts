import { bindMethods } from "lib/utils";
import { Box, Bullet as LibBullet } from "lib/entity";
import {
  Color,
  defaultBehavior,
  defaultView,
  IEntity,
  IPointData,
  onOutInOfBoundsBehavior,
  Sprite
} from "core";

import { getBulletSprite } from "./sprite";

export class Bullet extends LibBullet {
  static readonly Speed = LibBullet.Speed;

  views = [defaultView];

  private readonly sprite: Sprite;
  private readonly collider: IEntity;

  constructor(position: IPointData, angle: number) {
    super(position, angle);

    this.speed = 0;
    this.sprite = getBulletSprite();
    this.collider = new Box(); // .setStyle({ fillStyle: Color.Red });

    bindMethods(this, this.shoot);

    this.add(this.collider, this.sprite).addBehaviors(
      defaultBehavior,
      onOutInOfBoundsBehavior(this.remove),
      Bullet.UpdateSize
    );
  }

  private static UpdateSize(bullet: Bullet): void {
    bullet.collider.setBounds(bullet.sprite.getBounds());
  }

  shoot() {
    this.speed = Bullet.Speed;
    console.log("Bullet.shoot");
  }
}
