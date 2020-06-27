import { Entity } from "./entity";
import { ISizeData } from "./size";
import { IPointData } from "./point";
import { IBehavior } from "./behavior";
import { IView } from "./view";
import { IBounds, IBoundsData } from "./bounds";
import { ITexture, setSizeOnLoad, Texture } from "./texture";
import { IUpdated } from "core/updated";

export interface ISprite {
  speed: number;
  frames: number | IBoundsData[];
  setTexture: (texture: ITexture) => this;
  setFrames: (frames: number, speed?: number) => this;
}

export interface ISpriteFrames extends Array<IBoundsData> {}

export enum SpritePlayMode {
  Forward = "Forward",
  Backward = "Backward",
  ForwardLoop = "ForwardLoop",
  BackwardLoop = "BackwardLoop",
  ForwardBackward = "ForwardBackward",
  BackwardForward = "BackwardForward",
  ForwardBackwardLoop = "ForwardBackwardLoop",
  BackwardForwardLoop = "BackwardForwardLoop"
}

export class Sprite extends Entity implements ISprite {
  private static SpritePlayer = class SpritePlayer implements IUpdated {
    private sprite: Sprite;
    private mode: SpritePlayMode;

    constructor(
      sprite: Sprite,
      mode: SpritePlayMode = SpritePlayMode.ForwardLoop
    ) {
      this.mode = mode;
      this.sprite = sprite;
    }

    private get frames() {
      return this.sprite.frames;
    }

    private get pointer() {
      return this.sprite.frameIndex;
    }

    private set pointer(pointer: number) {
      this.sprite.frameIndex = pointer;
    }

    setMode = (mode: SpritePlayMode) => {
      this.mode = mode;

      return this;
    };

    update = (deltaTime: number) => this.modes[this.mode](deltaTime);

    private forward = (deltaTime: number) => {};

    private backward = (deltaTime: number) => {};

    private forwardLoop = (deltaTime: number) => {};

    private backwardLoop = (deltaTime: number) => {};

    private forwardBackward = (deltaTime: number) => {};

    private backwardForward = (deltaTime: number) => {};

    private forwardBackwardLoop = (deltaTime: number) => {};

    private backwardForwardLoop = (deltaTime: number) => {};

    private modes: Record<SpritePlayMode, (deltaTime: number) => void> = {
      [SpritePlayMode.Forward]: this.forward,
      [SpritePlayMode.Backward]: this.backward,
      [SpritePlayMode.ForwardLoop]: this.forwardLoop,
      [SpritePlayMode.BackwardLoop]: this.backwardLoop,
      [SpritePlayMode.ForwardBackward]: this.forwardBackward,
      [SpritePlayMode.BackwardForward]: this.backwardForward,
      [SpritePlayMode.ForwardBackwardLoop]: this.forwardBackwardLoop,
      [SpritePlayMode.BackwardForwardLoop]: this.backwardForwardLoop
    };
  };

  speed: number = 1;
  frames: number | IBoundsData[] = 1;
  player = new Sprite.SpritePlayer(this);
  behaviors: IBehavior<Sprite>[] = [
    (sprite, deltaTime) => {
      if (sprite.speed < 1) return;

      sprite.tickCount++;

      if (sprite.tickCount > sprite.speed) {
        sprite.tickCount = 0;

        sprite.player.update(deltaTime); // todo: move logic to player ( tickCount & frameIndex )

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
  views: IView<Sprite>[] = [
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

  constructor(
    texture?: string | ITexture,
    bounds?: IPointData | ISizeData | IBoundsData
  ) {
    super(bounds);

    if (texture) this.setTexture(texture, bounds);
  }

  get isLoaded() {
    return this.texture?.isLoaded;
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
  setFrames = (
    frames: number | ISpriteFrames,
    speed: number = 0
    // playMode: SpritePlayMode = SpritePlayMode.ForwardLoop
  ) => {
    if (this.isLoaded) {
      if (typeof frames === "number") {
        this.frames = frames;
      } else {
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
      }
      if (speed) this.speed = speed;
    } else {
      this.texture?.addOnLoad(() => this.setFrames(frames, speed));
    }

    return this;
  };
}
