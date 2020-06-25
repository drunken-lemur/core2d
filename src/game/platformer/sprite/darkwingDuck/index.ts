import { Bounds, imagesPath, Sprite, Texture } from "core";

export const darkwingDuckTexture = new Texture(
  imagesPath("tilesets/darkwingDuck/darkwingDuck.gif"),
  Bounds.valueOf(),
  texture => texture.removeColor("#a4e0a0")
);

export const greetingFrames = [
  Bounds.valueOf(6, 3, 28, 34),
  Bounds.valueOf(34, 3, 33, 34),
  Bounds.valueOf(66, 3, 32, 34),
  Bounds.valueOf(101, 3, 27, 34),
  Bounds.valueOf(127, 3, 28, 34),
  Bounds.valueOf(156, 3, 24, 34),
  // REPEAT
  Bounds.valueOf(156, 3, 24, 34),
  Bounds.valueOf(156, 3, 24, 34)
];
export const greetingSprite = new Sprite(darkwingDuckTexture).setFrames(
  greetingFrames,
  10
);

export const blockingFrames = [
  Bounds.valueOf(4, 42, 27, 29),
  Bounds.valueOf(37, 42, 28, 29),
  Bounds.valueOf(65, 42, 30, 29),
  Bounds.valueOf(95, 42, 29, 29)
];

export const blockingSprite = new Sprite(darkwingDuckTexture).setFrames(
  blockingFrames,
  10
);

export const runningFrames = [
  Bounds.valueOf(2, 76, 28, 29),
  Bounds.valueOf(31, 76, 34, 29),
  Bounds.valueOf(65, 78, 34, 29),
  Bounds.valueOf(99, 76, 34, 29),
  Bounds.valueOf(133, 76, 34, 29),
  // REPEAT
  Bounds.valueOf(99, 76, 34, 29),
  Bounds.valueOf(65, 78, 34, 29),
  Bounds.valueOf(31, 76, 34, 29)
];
export const runningSprite = new Sprite(darkwingDuckTexture).setFrames(
  runningFrames,
  10
);

export const wellDoneFrames = [
  Bounds.valueOf(4, 298, 56, 56),
  Bounds.valueOf(59, 299, 57, 56),
  Bounds.valueOf(119, 299, 58, 56)
];
export const wellDoneSprite = new Sprite(darkwingDuckTexture).setFrames(
  wellDoneFrames,
  5
);
