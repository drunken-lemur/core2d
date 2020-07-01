import { Bounds, imagesPath, Sprite, SpritePlayMode, Texture } from "core";

const numbersTexture = new Texture(imagesPath("tilesets/other/numbers.png"))
  .removeColor("#FFFFFF")
  .removeColor("#ff0700")
  .removeColor("#ffa500")
  .removeColor("#008000")
  .removeColor("#42aaff")
  .removeColor("#0000ff")
  .removeColor("#8b00ff")
  .removeColor("#ffc0cb");

export const numbersSprite = new Sprite(numbersTexture).setFrames(
  [
    sprite => sprite.remove(),
    Bounds.valueOf(0, 0, 64, 64),
    Bounds.valueOf(64, 0, 64, 64),
    Bounds.valueOf(128, 0, 64, 64),
    Bounds.valueOf(0, 64, 64, 64),
    Bounds.valueOf(64, 64, 64, 64),
    Bounds.valueOf(128, 64, 64, 64),
    Bounds.valueOf(0, 128, 64, 64),
    Bounds.valueOf(64, 128, 64, 64),
    Bounds.valueOf(128, 128, 64, 64)
  ],
  60,
  SpritePlayMode.Backward
);
