import { Bounds, Sprite, Direction } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";

const left = new Sprite(darkwingDuckRightTexture).setFrames(
  [
    Bounds.valueOf(192, 197, 34, 32),
    Bounds.valueOf(225, 198, 34, 32),
    Bounds.valueOf(259, 199, 34, 32)
  ],
  10
);

const right = new Sprite(darkwingDuckLeftTexture).setFrames(
  [
    Bounds.valueOf(-192, 197, 34, 32),
    Bounds.valueOf(-225, 198, 34, 32),
    Bounds.valueOf(-259, 199, 34, 32)
  ],
  10
);

export const getFlingSprite = (direction: Direction) =>
  direction === Direction.West ? left : right;
