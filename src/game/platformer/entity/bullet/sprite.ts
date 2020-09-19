import { Bounds, Sprite, Direction } from "core";

import { darkwingDuckLeftTexture, darkwingDuckRightTexture } from "../texture";

const left = new Sprite(darkwingDuckLeftTexture).setFrames(
	[Bounds.valueOf(-143, 130, 30, 21)],
	10
);

const right = new Sprite(darkwingDuckRightTexture).setFrames(
	[Bounds.valueOf(143, 130, 30, 21)],
	10
);

export const getDuckingShootingSprite = (direction: Direction) =>
	direction === Direction.West ? left : right;
