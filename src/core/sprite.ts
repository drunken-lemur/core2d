// import { Color } from "./color";
// import { Entity } from "./entity";
// import { ISizeData } from "./size";
// import { IPointData } from "./point";
// import { IBehavior } from "./behavior";
// import { cacheView, IView, rectView } from "./view";
// import { ITexture, Texture } from "./texture";
// import { IBounds, IBoundsData } from "./bounds";
//
// export interface ISprite {
//   setTexture: (texture: ITexture) => this;
//   setFrames: (frames: number, speed?: number) => this;
// }
//
// export class Sprite extends Entity implements ISprite {
//   ticksPerFrame: number = 1;
//   numberOfFrames: number = 1;
//
//   behaviors: IBehavior<Sprite>[] = [
//     sprite => {
//       sprite.tickCount++;
//
//       if (sprite.tickCount > sprite.ticksPerFrame) {
//         sprite.tickCount = 0;
//
//         if (sprite.frameIndex < sprite.numberOfFrames - 1) {
//           sprite.frameIndex++;
//         } else {
//           sprite.frameIndex = 0;
//         }
//       }
//     }
//   ];
//   private tickCount = 0;
//   private frameIndex = 0;
//   private texture?: ITexture;
//   views: IView<Sprite>[] = [
//     cacheView<Sprite>(0)((sprite, brush, deltaTime) => {
//       if (this.texture?.loaded) {
//         const { x, y, w, h, frameIndex } = sprite;
//
//         const scale = { x: 1, y: 1 };
//
//         brush.save();
//
//         if (scale.x !== 1 || scale.y !== 1) {
//           const translate = { x: 0, y: 0 };
//
//           if (scale.x < 0) translate.x = -scale.x * w;
//           if (scale.y < 0) translate.y = -scale.y * h;
//
//           brush.translate(translate.x, translate.y).scale(scale.x, scale.y);
//         }
//
//         brush.drawImage(
//           this.texture.image,
//           w * frameIndex,
//           0,
//           w,
//           h,
//           x * scale.x,
//           y * scale.y,
//           w,
//           h
//         );
//
//         brush.restore();
//       }
//     })
//   ];
//
//   constructor(
//     texture?: string | ITexture,
//     bounds?: IPointData | ISizeData | IBoundsData
//   ) {
//     super(bounds);
//
//     if (texture) this.setTexture(texture, bounds);
//   }
//
//   setTexture = (
//     texture: string | ITexture,
//     bounds?: IPointData | ISizeData | IBoundsData
//   ) => {
//     if (typeof texture === "string") {
//       this.texture = new Texture(texture);
//     } else {
//       this.texture = texture;
//     }
//
//     if (bounds) {
//       const { x, y, w, h } = bounds as IBounds;
//
//       if (x || y) this.setPosition(x, y);
//       if (w || h) this.setSize(w, h);
//     } else {
//       const { width, height } = this.texture?.image!;
//
//       this.setSize(width, height);
//     }
//
//     return this;
//   };
//
//   setFrames = (numberOfFrames: number, ticksPerFrame?: number) => {
//     this.numberOfFrames = numberOfFrames;
//
//     if (ticksPerFrame) this.ticksPerFrame = ticksPerFrame;
//
//     return this;
//   };
//
//   scaleMe = (x: number, y: number) => {
//     // todo:
//   };
// }

export default null;