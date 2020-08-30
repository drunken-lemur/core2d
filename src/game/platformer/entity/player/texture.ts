import { imagesPath, removeColorOnLoad, scaleOnLoad, Texture } from "core";

export const darkwingDuckLeftTexture = new Texture(
  imagesPath("tilesets/darkwingDuck/darkwingDuck.gif")
).addOnLoad(scaleOnLoad(-1, 1), removeColorOnLoad("#a4e0a0"));

export const darkwingDuckRightTexture = new Texture(
  imagesPath("tilesets/darkwingDuck/darkwingDuck.gif")
).addOnLoad(removeColorOnLoad("#a4e0a0"));
