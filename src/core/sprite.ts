import { Entity } from "./entity";
import { ISizeData } from "./size";
import { IPointData } from "./point";
import { IBehavior } from "./behavior";
import { cacheView, IView } from "./view";
import { IBounds, IBoundsData } from "./bounds";
import { ITexture, setSizeOnLoad, Texture } from "./texture";

export interface ISprite {
  speed: number;
  frames: number | IBoundsData[];
  setTexture: (texture: ITexture) => this;
  setFrames: (frames: number, speed?: number) => this;
}

export interface ISpriteFrames extends Array<IBoundsData> {}

export class Sprite extends Entity implements ISprite {
  speed: number = 1;
  frames: number | IBoundsData[] = 1;

  views: IView<Sprite>[] = [
    cacheView<Sprite>(0)((sprite, brush, deltaTime) => {
      if (this.texture?.isLoaded && this.texture.brush) {
        const { x, y, w, h, frameIndex, frames } = sprite;

        brush.save();

        if (Array.isArray(frames)) {
          const frame = frames[frameIndex];

          brush.drawImage(
            this.texture.brush,
            frame.x,
            frame.y,
            frame.w,
            frame.h,
            x,
            y,
            frame.w,
            frame.h
          );
        } else {
          brush.drawImage(
            this.texture.brush,
            w * frameIndex,
            0,
            w,
            h,
            x,
            y,
            w,
            h
          );
        }

        brush.restore();
      }
    })
  ];
  behaviors: IBehavior<Sprite>[] = [
    sprite => {
      if (sprite.speed < 1) return;

      sprite.tickCount++;

      if (sprite.tickCount > sprite.speed) {
        sprite.tickCount = 0;

        const { frames, frameIndex } = sprite;
        if (Array.isArray(frames) && frameIndex < frames.length - 1) {
          sprite.frameIndex++;
        } else if (frameIndex < (frames as number) - 1) {
          sprite.frameIndex++;
        } else {
          sprite.frameIndex = 0;
        }
      }
    }
  ];

  private tickCount = 0;
  private frameIndex = 0;
  private texture?: ITexture;

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

      if (w || h) this.setSize(w, h);
      if (x || y) this.setPosition(x, y);
    } else {
      this.texture.addOnLoad(setSizeOnLoad(this));
    }

    return this;
  };

  // todo: refactor speed use Delay & secMs
  setFrames = (frames: number | ISpriteFrames, speed: number = 0) => {
    this.frames = frames;

    if (speed) this.speed = speed;

    return this;
  };
}
