import { Bounds, Direction, Sprite } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";

const left = new Sprite(darkwingDuckLeftTexture).setFrames(
  [
    Bounds.valueOf(-31, 76, 34, 29),
    Bounds.valueOf(-65, 78, 34, 29),
    Bounds.valueOf(-99, 76, 34, 29),
    Bounds.valueOf(-133, 76, 34, 29)
  ],
  10
);

const right = new Sprite(darkwingDuckRightTexture).setFrames(
  [
    Bounds.valueOf(31, 76, 34, 29),
    Bounds.valueOf(65, 78, 34, 29),
    Bounds.valueOf(99, 76, 34, 29),
    Bounds.valueOf(133, 76, 34, 29)
  ],
  10
);

export const getWalkingSprite = (direction: Direction) =>
  direction === Direction.West ? left : right;
