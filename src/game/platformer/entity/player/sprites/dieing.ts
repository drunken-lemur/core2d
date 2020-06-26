import { Bounds, Sprite } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";

export const dieingLeftSprite = new Sprite(darkwingDuckLeftTexture).setFrames(
	[Bounds.valueOf(-73, 254, 31, 28)],
  10
);

export const dieingRightSprite = new Sprite(darkwingDuckRightTexture).setFrames(
  [Bounds.valueOf(73, 254, 31, 28)],
  10
);
