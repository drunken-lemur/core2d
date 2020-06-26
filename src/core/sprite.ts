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

  get isLoaded() {
    return this.texture?.isLoaded;
  }

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
    if (this.isLoaded) {
      if(typeof frames === "number"){
        this.frames = frames;
      } else {
        const { w, h } = this;
        this.frames = frames.map(frame => {
          if (!frame.x) frame.x = 0;
          if (!frame.y) frame.y = 0;
          if (frame.x < 0) {
            frame.x = w + frame.x - frame.w
          }
          if (frame.y < 0) {
            frame.y = h + frame.y - frame.h
          }

          if (!frame.w) frame.w = w - frame.x;
          if (!frame.h) frame.h = h - frame.y;
          if (frame.w < 0) {
            frame.w = w + frame.w - frame.x;
          }
          if (frame.h < 0) {
            frame.h = h + frame.h - frame.y;
          }

          return frame;
        })
      }
      if (speed) this.speed = speed;
    } else {
      this.texture?.addOnLoad(() => this.setFrames(frames, speed));
    }

    return this;
  };
}
