import {
  Bounds,
  Direction,
  ISpriteBoundsFrame,
  ISpriteFrames,
  ISpriteFunctionFrame,
  Sprite,
  SpritePlayMode
} from "core";

import { Bullet } from ".";
import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";

const delay = 5;

const playMode = SpritePlayMode.Forward;

const shootFrame: ISpriteFunctionFrame = sprite => {
  const bullet: Bullet = sprite.parent as Bullet;
  (sprite as Sprite).nextFrame();
  bullet.shoot();
};

const frames: ISpriteFrames = [
  Bounds.valueOf(193, 132, 16, 16),
  { ...Bounds.valueOf(212, 137, 6, 8), ox: 5, oy: 4 },
  { ...Bounds.valueOf(221, 134, 14, 14), ox: 1, oy: 1 },
  { ...Bounds.valueOf(237, 133, 16, 16), ox: 0, oy: 0 },
  { ...Bounds.valueOf(255, 133, 16, 16), ox: 0, oy: 0 },
  shootFrame,
  { ...Bounds.valueOf(274, 138, 24, 7), ox: 0, oy: 5 }
];

const reflectFrames = (frames: ISpriteFrames) =>
  frames.map(f => {
    const frame = f as ISpriteBoundsFrame;

    return frame.x ? { ...frame, x: -frame.x } : f;
  });

const left = () =>
  new Sprite(darkwingDuckLeftTexture).setFrames(
    reflectFrames(frames),
    delay,
    playMode
  );

const right = () =>
  new Sprite(darkwingDuckRightTexture).setFrames(frames, delay, playMode);

export const getBulletSprite = (direction?: Direction) =>
  direction === Direction.West ? left() : right();
