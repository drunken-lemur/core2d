import { Bounds, Direction, Sprite } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../../texture";

const left = new Sprite(darkwingDuckRightTexture).setFrames(
  [Bounds.valueOf(190, 157, 48, 36), Bounds.valueOf(237, 156, 48, 36)],
  10
);

const right = new Sprite(darkwingDuckLeftTexture).setFrames(
  [Bounds.valueOf(-190, 157, 48, 36), Bounds.valueOf(-237, 156, 48, 36)],
  10
);

export const getRidingSprite = (direction: Direction) =>
  direction === Direction.West ? left : right;
