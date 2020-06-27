import { Bounds, Direction, Sprite } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";

const left = new Sprite(darkwingDuckLeftTexture).setFrames(
  [Bounds.valueOf(-87, 130, 30, 21)],
  10
);

const right = new Sprite(darkwingDuckRightTexture).setFrames(
  [Bounds.valueOf(87, 130, 30, 21)],
  10
);

export const getDuckingSprite = (direction: Direction) =>
  direction === Direction.West ? left : right;
