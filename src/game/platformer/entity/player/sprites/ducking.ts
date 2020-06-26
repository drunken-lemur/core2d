import { Bounds, Sprite } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";

export const duckingLeftSprite = new Sprite(darkwingDuckLeftTexture).setFrames(
	[Bounds.valueOf(-87, 130, 30, 21)],
	10
);

export const duckingRightSprite = new Sprite(darkwingDuckRightTexture).setFrames(
	[Bounds.valueOf(87, 130, 30, 21)],
	10
);
