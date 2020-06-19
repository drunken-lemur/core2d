import { cacheView, IView, rectView } from "./view";
import { Entity } from "./entity";
import { ISizeData } from "./size";
import { IPointData } from "./point";
import { IBehavior } from "./behavior";
import { ITexture, Texture } from "./texture";
import { IBounds, IBoundsData } from "./bounds";
import { Delay } from "core/delay";
import { Label } from "lib/entity";
import { Color } from "core/color";

export interface ISprite {
  setTexture: (texture: ITexture) => this;
  setFrames: (frames: number, speed?: number) => this;
}

export class Sprite extends Entity implements ISprite {
  private tickCount = 0;
  private frameIndex = 0;
  private texture?: ITexture;

  private stateIndex = 0;
  private delay = new Delay(0.5);

  ticksPerFrame: number = 1;
  numberOfFrames: number = 1;

  style = { fillStyle: Color.Red };
  views: IView<Sprite>[] = [
    cacheView(rectView), rectView
    // (sprite, brush, deltaTime) => {
    //   if (this.texture?.loaded) {
    //     const { x, y, w, h, frameIndex, stateIndex, delay } = sprite;
    //
    //     delay.update(deltaTime);
    //
    //     const states = [
    //       { scale: { x: -0.25, y: 1 }, translate: { x: w * 0.25, y: 0 } },
    //       { scale: { x: -0.5, y: 1 }, translate: { x: w * 0.5, y: 0 } },
    //       { scale: { x: -0.75, y: 1 }, translate: { x: w * 0.75, y: 0 } },
    //       { scale: { x: -1, y: 1 }, translate: { x: w * 1, y: 0 } },
    //
    //       { scale: { x: -1.5, y: 1 }, translate: { x: w * 1.5, y: 0 } },
    //       { scale: { x: -2, y: 1 }, translate: { x: w * 2, y: 0 } },
    //       { scale: { x: -1.5, y: 1 }, translate: { x: w * 1.5, y: 0 } },
    //
    //       { scale: { x: -1, y: 1 }, translate: { x: w * 1, y: 0 } },
    //       { scale: { x: -0.75, y: 1 }, translate: { x: w * 0.75, y: 0 } },
    //       { scale: { x: -0.5, y: 1 }, translate: { x: w * 0.5, y: 0 } },
    //       { scale: { x: -0.25, y: 1 }, translate: { x: w * 0.25, y: 0 } }
    //     ];
    //
    //     if (delay.isDone) {
    //       delay.reset();
    //       this.stateIndex = (stateIndex + 1) % states.length;
    //     }
    //
    //     // const offset = w * frameIndex;
    //
    //     const { scale, translate } = states[this.stateIndex];
    //
    //     if (scale.x < 0) {
    //       translate.x = -scale.x * w;
    //     }
    //
    //     if (scale.y < 0) {
    //       translate.y = -scale.y * h;
    //     }
    //
    //     brush
    //       .save()
    //       .translate(translate.x, translate.y)
    //       .scale(scale.x, scale.y);
    //     // .drawImage(this.texture.image, offset, 0, w, h, x, y, w, h)
    //     brush.ctx.drawImage(this.texture.image, 0, 0);
    //     brush.restore();
    //   }
    // }
  ];
  behaviors: IBehavior<Sprite>[] = [
    sprite => {
      sprite.tickCount++;

      if (sprite.tickCount > sprite.ticksPerFrame) {
        sprite.tickCount = 0;

        if (sprite.frameIndex < sprite.numberOfFrames - 1) {
          sprite.frameIndex++;
        } else {
          sprite.frameIndex = 0;
        }
      }
    }
  ];

  constructor(
    texture?: string | ITexture,
    bounds?: IPointData | ISizeData | IBoundsData
  ) {
    super(bounds);

    if (texture) this.setTexture(texture, bounds);
  }

  setTexture = (
    texture: string | ITexture,
    bounds?: IPointData | ISizeData | IBoundsData
  ) => {
    if (typeof texture === "string") {
      this.texture = new Texture(texture);
    } else {
      this.texture = texture;
    }

    if (bounds) {
      const { x, y, w, h } = bounds as IBounds;

      if (x || y) this.setPosition(x, y);
      if (w || h) this.setSize(w, h);
    } else {
      const { width, height } = this.texture?.image!;

      this.setSize(width, height);
    }

    return this;
  };

  setFrames = (numberOfFrames: number, ticksPerFrame?: number) => {
    this.numberOfFrames = numberOfFrames;

    if (ticksPerFrame) this.ticksPerFrame = ticksPerFrame;

    return this;
  };

  scaleMe = (x: number, y: number) => {
    // todo:
  };
}
