import { Bounds, Sprite } from "core";
import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";

export const walkingLeftSprite = new Sprite(darkwingDuckLeftTexture).setFrames(
  [
      Bounds.valueOf(-31, 76, 34, 29),
      Bounds.valueOf(-65, 78, 34, 29),
      Bounds.valueOf(-99, 76, 34, 29),
      Bounds.valueOf(-133, 76, 34, 29)
  ],
  10
);

export const walkingRightSprite = new Sprite(
  darkwingDuckRightTexture
).setFrames(
  [
    Bounds.valueOf(31, 76, 34, 29),
    Bounds.valueOf(65, 78, 34, 29),
    Bounds.valueOf(99, 76, 34, 29),
    Bounds.valueOf(133, 76, 34, 29)
  ],
  10
);
