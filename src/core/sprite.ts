import { IViews } from "./view";
import { Entity } from "./entity";
import { IBoundsData } from "./bounds";
import { IBehaviors } from "./behavior";
import { ITexture, setSizeOnLoad, Texture } from "./texture";

export enum SpritePlayMode {
  Forward = "Forward",
  Backward = "Backward",
  ForwardLoop = "ForwardLoop",
  BackwardLoop = "BackwardLoop"
}

export interface ISpriteFrames extends Array<IBoundsData> {}

export interface ISprite {
  setFrames: (
    frames: ISpriteFrames,
    delay?: number,
    mode?: SpritePlayMode
  ) => this;
  isLoaded: boolean;
  setTexture: (texture: ITexture) => this;
}

export class Sprite extends Entity implements ISprite {
  views: IViews<Sprite> = [
    (sprite, brush, deltaTime) => {
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
    }
  ];
  behaviors: IBehaviors<Sprite> = [
    (sprite, deltaTime) => {
      if (sprite.speed < 1) return;

      sprite.tickCount++;

      if (sprite.tickCount > sprite.speed) {
        sprite.tickCount = 0;

        sprite.modes[sprite.mode](deltaTime);
      }
    }
  ];

  private tickCount = 0;
  private frameIndex = 0;
  private speed: number = 1;
  private texture?: ITexture;
  private frames: ISpriteFrames = [];
  private mode: SpritePlayMode = SpritePlayMode.ForwardLoop;

  constructor(texture?: string | ITexture, mode?: SpritePlayMode) {
    super();

    if (mode) this.mode = mode;
    if (texture) this.setTexture(texture);
  }

  get isLoaded() {
    return this.texture?.isLoaded || false;
  }

  setTexture = (texture: string | ITexture) => {
    this.texture = typeof texture === "string" ? new Texture(texture) : texture;
    this.texture.addOnLoad(setSizeOnLoad(this));

    return this;
  };

  // todo: refactor speed use Delay & secMs
  setFrames = (
    frames: ISpriteFrames,
    delay: number = 0,
    mode = SpritePlayMode.ForwardLoop
  ) => {
    if (this.isLoaded) {
      const { w, h } = this;

      this.frames = frames.map(frame => {
        if (!frame.x) frame.x = 0;
        if (!frame.y) frame.y = 0;
        if (frame.x < 0) {
          frame.x = w + frame.x - frame.w;
        }
        if (frame.y < 0) {
          frame.y = h + frame.y - frame.h;
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
      });

      if (mode) this.mode = mode;
      if (delay) this.speed = delay;
    } else {
      this.texture?.addOnLoad(() => this.setFrames(frames, delay, mode));
    }

    return this;
  };

  rewind = () => {
    const { Backward, BackwardLoop } = SpritePlayMode;
    const isBackward = [Backward, BackwardLoop].includes(this.mode);

    this.frameIndex = !isBackward ? 0 : this.frames.length - 1;

    return this;
  };

  private forward = (deltaTime: number) => {
    const { frames, frameIndex } = this;

    if (frameIndex < frames.length - 1) {
      this.frameIndex++;
    }
  };

  private backward = (deltaTime: number) => {
    const { frameIndex } = this;

    if (frameIndex > 0) {
      this.frameIndex--;
    }
  };

  private forwardLoop = (deltaTime: number) => {
    const { frames, frameIndex } = this;

    if (frameIndex < frames.length - 1) {
      this.frameIndex++;
    } else {
      this.rewind();
    }
  };

  private backwardLoop = (deltaTime: number) => {
    const { frameIndex } = this;

    if (frameIndex > 0) {
      this.frameIndex--;
    } else {
      this.rewind();
    }
  };

  private modes: Record<SpritePlayMode, (deltaTime: number) => void> = {
    [SpritePlayMode.Forward]: this.forward,
    [SpritePlayMode.Backward]: this.backward,
    [SpritePlayMode.ForwardLoop]: this.forwardLoop,
    [SpritePlayMode.BackwardLoop]: this.backwardLoop
  };
}
