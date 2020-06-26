import { Bounds, Sprite } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";

export const duckingBlockingLeftSprite = new Sprite(darkwingDuckLeftTexture).setFrames(
	[Bounds.valueOf(-116, 130, 26, 21)],
	10
);

export const duckingBlockingRightSprite = new Sprite(darkwingDuckRightTexture).setFrames(
	[Bounds.valueOf(116, 130, 26, 21)],
	10
);
