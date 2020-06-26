import { Bounds, Sprite } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";

export const duckingShootingLeftSprite = new Sprite(darkwingDuckLeftTexture).setFrames(
	[Bounds.valueOf(-143, 130, 30, 21)],
	10
);

export const duckingShootingRightSprite = new Sprite(darkwingDuckRightTexture).setFrames(
	[Bounds.valueOf(143, 130, 30, 21)],
	10
);
