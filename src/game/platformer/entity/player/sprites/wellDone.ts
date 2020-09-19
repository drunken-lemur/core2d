import { Bounds, Direction, Sprite } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../../texture";

const left = new Sprite(darkwingDuckLeftTexture).setFrames(
  [
    Bounds.valueOf(-4, 298, 56, 56),
    Bounds.valueOf(-59, 299, 57, 56),
    Bounds.valueOf(-119, 299, 58, 56)
  ],
  5
);

const right = new Sprite(darkwingDuckRightTexture).setFrames(
  [
    Bounds.valueOf(4, 298, 56, 56),
    Bounds.valueOf(59, 299, 57, 56),
    Bounds.valueOf(119, 299, 58, 56)
  ],
  5
);

export const getWellDoneSprite = (direction: Direction) =>
  direction === Direction.West ? left : right;
