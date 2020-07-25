import { Bounds, Direction, Sprite } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";

const left = new Sprite(darkwingDuckLeftTexture).setFrames(
  [Sprite.CreateBoundsFrame(-87, 130, 30, 21, 0, 8)],
  10
);

const right = new Sprite(darkwingDuckRightTexture).setFrames(
  [Sprite.CreateBoundsFrame(87, 130, 30, 21, 0, 8)],
  10
);

export const getDuckingSprite = (direction: Direction) =>
  direction === Direction.West ? left : right;
