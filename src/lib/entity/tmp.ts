import { IPointData, ISizeData } from "core";

export enum Source {
  Api = "Api",
  Code = "Code"
}

export interface ITile extends IPointData, ISizeData {
  x: number;
  y: number;
  w: number;
  h: number;
  id: number;
  tileset: ITileset<Source.Code>;
}

export interface ITilesetImage {
  width: number;
  height: number;
  source: string;
  transparent?: string;
}

export interface ITileset<S extends Source> {
  name: string;
  columns: number;
  tileCount: number;
  firstId: S extends Source.Code ? number : never;
  firstgid: S extends Source.Code ? never : number;
  tilewidth: S extends Source.Code ? never : number;
  tileheight: S extends Source.Code ? never : number;
  tileSize: S extends Source.Code ? ISizeData : never;
  image: S extends Source.Code ? HTMLImageElement : ITilesetImage;
}

export interface ITilesetMapLayer<S extends Source> extends ISizeData {
  w: S extends Source.Code ? number : never;
  h: S extends Source.Code ? number : never;
  id: number;
  name: string;
  data: ITile[][];
}

export interface ITilesetMap {}

const tilesetApi: ITileset<Source.Api> = 0 as any;
const tilesetCode: ITileset<Source.Code> = 0 as any;

// tilesetApi.tileSize.w;
// tilesetCode.tileSize.w;