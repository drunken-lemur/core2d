import { Bounds, Direction, Sprite } from "core";
import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../../texture";

const left = new Sprite(darkwingDuckLeftTexture).setFrames(
  [
    Bounds.valueOf(-6, 3, 28, 34),
    Bounds.valueOf(-34, 3, 33, 34),
    Bounds.valueOf(-66, 3, 32, 34),
    Bounds.valueOf(-101, 3, 27, 34),
    Bounds.valueOf(-127, 3, 28, 34),
    Bounds.valueOf(-156, 3, 24, 34)
  ],
  10
);

const right = new Sprite(darkwingDuckRightTexture).setFrames(
  [
    Bounds.valueOf(6, 3, 28, 34),
    Bounds.valueOf(34, 3, 33, 34),
    Bounds.valueOf(66, 3, 32, 34),
    Bounds.valueOf(101, 3, 27, 34),
    Bounds.valueOf(127, 3, 28, 34),
    Bounds.valueOf(156, 3, 24, 34)
  ],
  10
);

export const getGreetingSprite = (direction: Direction) =>
  direction === Direction.West ? left : right;
