import { Bounds, Sprite } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";

export const flingLeftSprite = new Sprite(darkwingDuckRightTexture).setFrames(
	[
		Bounds.valueOf(192, 197, 34, 32),
		Bounds.valueOf(225, 198, 34, 32),
		Bounds.valueOf(259, 199, 34, 32),
	],
	10
);

export const flingRightSprite = new Sprite(darkwingDuckLeftTexture).setFrames(
	[
		Bounds.valueOf(-192, 197, 34, 32),
		Bounds.valueOf(-225, 198, 34, 32),
		Bounds.valueOf(-259, 199, 34, 32),
	],
	10
);
