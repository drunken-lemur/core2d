import { IViews } from "./view";
import { Entity, IEntity } from "./entity";
import { IBrush } from "./brush";
import { Bounds, IBoundsData } from "./bounds";
import { IBehaviorFunction, IBehaviors } from "./behavior";
import { ITexture, setSizeOnLoad, Texture } from "./texture";

export enum SpritePlayMode {
  Forward = "Forward",
  Backward = "Backward",
  ForwardLoop = "ForwardLoop",
  BackwardLoop = "BackwardLoop"
}

export type ISpriteBoundsFrame = IBoundsData;
export type ISpriteFunctionFrame = IBehaviorFunction;

export type ISpriteFrame = ISpriteBoundsFrame | ISpriteFunctionFrame;

export interface ISpriteFrames extends Array<ISpriteFrame> {}

export interface ISprite {
  isLoaded: boolean;
  setFrames: (
    frames: ISpriteFrames,
    delay?: number,
    mode?: SpritePlayMode
  ) => this;
  setTexture: (texture: ITexture) => this;
  rewind: () => this;
  goFrame: (offset: number, loop?: boolean) => this;
  nextFrame: (n: number, loop?: boolean) => this;
  prevFrame: (n: number, loop?: boolean) => this;
}

export class Sprite extends Entity implements ISprite {
  views: IViews<Sprite> = [
    (sprite, brush, deltaTime) => {
      const { texture } = this;
      if (texture?.isLoaded && texture.brush) {
        const { x, y, frameIndex, frames } = sprite;

        const frame = frames[frameIndex];

        if (typeof frame !== "function") {
          brush.drawImage(
            texture.brush,
            frame.x,
            frame.y,
            frame.w,
            frame.h,
            x,
            y,
            frame.w,
            frame.h
          );
        }
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
        sprite.frameIndex = sprite.frameIndex || 0; // todo: fix bug, frameIndex = NaN ?

        const frame = sprite.frames[sprite.frameIndex];
        if (frame) {
          if (typeof frame == "function") {
            frame(sprite, deltaTime);
          } else {
            sprite.w = frame.w;
            sprite.h = frame.h;
          }
        }
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

  private get isGoBack() {
    const { Backward, BackwardLoop } = SpritePlayMode;

    return [Backward, BackwardLoop].includes(this.mode);
  }

  // get w() {
  //   const { frames, frameIndex } = this;
  //
  //   return frames[frameIndex] ? frames[frameIndex].w : 0;
  // }
  // set w(w: number){}
  //
  // get h() {
  //   const { frames, frameIndex } = this;
  //
  //   return frames[frameIndex] ? frames[frameIndex].h : 0;
  // }
  // set h(h: number){}

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
        if (typeof frame !== "function") {
          if (!frame.x) frame.x = 0;
          if (!frame.y) frame.y = 0;
          if (frame.x < 0) frame.x = w + frame.x - frame.w;
          if (frame.y < 0) frame.y = h + frame.y - frame.h;

          if (!frame.w) frame.w = w - frame.x;
          if (!frame.h) frame.h = h - frame.y;
          if (frame.w < 0) frame.w = w + frame.w - frame.x;
          if (frame.h < 0) frame.h = h + frame.h - frame.y;
        }

        return frame;
      });

      if (mode) this.mode = mode;
      if (delay) this.speed = delay;
      this.rewind();

      const frame = this.frames[this.frameIndex];
      if (frame && typeof frame !== "function") {
        this.w = frame.w;
        this.h = frame.h;
      }
    } else {
      this.texture?.addOnLoad(() => this.setFrames(frames, delay, mode));
    }

    return this;
  };

  rewind = () => {
    const { frames, isGoBack } = this;

    this.frameIndex = !isGoBack ? 0 : frames.length - 1;

    return this;
  };

  goFrame = (offset = 0, loop = false) => {
    const {
      isGoBack,
      frames: { length }
    } = this;

    this.frameIndex += offset;

    if (loop) {
      this.frameIndex = (this.frameIndex + length) % length;
    } else {
      if (this.frameIndex < 0) this.frameIndex = 0;
      if (this.frameIndex > length - 1) this.frameIndex = length - 1;
    }

    return this;
  };

  nextFrame = (n = 1, loop = false) => this.goFrame(n, loop);

  prevFrame = (n = 1, loop = false) => this.goFrame(-n, loop);

  private forward = (deltaTime: number) => this.nextFrame();

  private backward = (deltaTime: number) => this.prevFrame();

  private forwardLoop = (deltaTime: number) => this.nextFrame(1, true);

  private backwardLoop = (deltaTime: number) => this.prevFrame(1, true);

  private modes: Record<SpritePlayMode, (deltaTime: number) => void> = {
    [SpritePlayMode.Forward]: this.forward,
    [SpritePlayMode.Backward]: this.backward,
    [SpritePlayMode.ForwardLoop]: this.forwardLoop,
    [SpritePlayMode.BackwardLoop]: this.backwardLoop
  };
}
