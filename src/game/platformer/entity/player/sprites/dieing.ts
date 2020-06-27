import { Bounds, Direction, Sprite } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";

const left = new Sprite(darkwingDuckLeftTexture).setFrames(
  [Bounds.valueOf(-73, 254, 31, 28)],
  10
);

const right = new Sprite(darkwingDuckRightTexture).setFrames(
  [Bounds.valueOf(73, 254, 31, 28)],
  10
);

export const getDieingSprite = (direction: Direction) =>
  direction === Direction.West ? left : right;
