import { Bounds, imagesPath, Texture } from "core";

export const darkwingDuckLeftTexture = new Texture(
  imagesPath("tilesets/darkwingDuck/darkwingDuck.gif"),
  Bounds.valueOf(),
  texture => texture.scale(-1, 1).removeColor("#a4e0a0")
);

export const darkwingDuckRightTexture = new Texture(
  imagesPath("tilesets/darkwingDuck/darkwingDuck.gif"),
  Bounds.valueOf(),
  texture => texture.removeColor("#a4e0a0")
);
