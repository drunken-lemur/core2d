import { Bounds, Sprite } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";

export const wellDoneLeftSprite = new Sprite(darkwingDuckLeftTexture).setFrames(
  [
    // todo:
  ],
  5
);

export const wellDoneRightSprite = new Sprite(
  darkwingDuckRightTexture
).setFrames(
  [
    Bounds.valueOf(4, 298, 56, 56),
    Bounds.valueOf(59, 299, 57, 56),
    Bounds.valueOf(119, 299, 58, 56)
  ],
  5
);
