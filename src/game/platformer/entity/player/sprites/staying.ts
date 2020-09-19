import { Bounds, Direction, Sprite } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../../texture";

export const left = new Sprite(darkwingDuckLeftTexture).setFrames(
  [Bounds.valueOf(-2, 76, 28, 29)],
  10
);

export const right = new Sprite(darkwingDuckRightTexture).setFrames(
  [Bounds.valueOf(2, 76, 28, 29)],
  10
);

export const getStayingSprite = (direction: Direction) =>
  direction === Direction.West ? left : right;
