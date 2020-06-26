import { Bounds, Sprite } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";


export const stayingLeftSprite = new Sprite(darkwingDuckLeftTexture).setFrames(
  [Bounds.valueOf(-2, 76, 28, 29)],
  10
);

export const stayingRightSprite = new Sprite(
  darkwingDuckRightTexture
).setFrames([Bounds.valueOf(2, 76, 28, 29)], 10);
