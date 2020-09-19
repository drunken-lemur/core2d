import { Bounds, Direction, Sprite, SpritePlayMode } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../../texture";

const left = new Sprite(darkwingDuckLeftTexture).setFrames(
  [
    Bounds.valueOf(-4, 42, 27, 29),
    Bounds.valueOf(-37, 42, 28, 29),
    Bounds.valueOf(-65, 42, 30, 29),
    Bounds.valueOf(-95, 42, 29, 29)
  ],
  10,
  SpritePlayMode.Forward
);

const right = new Sprite(darkwingDuckRightTexture).setFrames(
  [
    Bounds.valueOf(4, 42, 27, 29),
    Bounds.valueOf(37, 42, 28, 29),
    Bounds.valueOf(65, 42, 30, 29),
    Bounds.valueOf(95, 42, 29, 29)
  ],
  10,
  SpritePlayMode.Forward
);

export const getBlockingSprite = (direction: Direction) =>
  direction === Direction.West ? left : right;
