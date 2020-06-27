import { Bounds, Sprite } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";

export const ridingRightSprite = new Sprite(darkwingDuckLeftTexture).setFrames(
	[
		Bounds.valueOf(-190, 157, 48, 36),
		Bounds.valueOf(-237, 156, 48, 36),
	],
	10
);

export const ridingLeftSprite = new Sprite(
	darkwingDuckRightTexture
).setFrames(
	[
		Bounds.valueOf(190, 157, 48, 36),
		Bounds.valueOf(237, 156, 48, 36),
	],
	10
);
