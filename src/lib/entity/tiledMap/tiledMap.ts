import {
  Color,
  defaultBehavior,
  defaultView,
  Entity,
  floorPositionBehavior,
  foreachBehavior,
  IBehaviors,
  IBrush,
  IPointData,
  IViews,
  Point,
  Size
} from "core";
import { bindMethods, fetchXml, gravityBehavior } from "lib";

import { CollisionManager } from "..";
import { ITile, ITileset, Tileset, MapLoader } from ".";

export interface ITiledMapLayer {
  id: number;
  name: string;
  width: number;
  height: number;
  data: ITile[][];
}

export interface ITiledMap {
  tilesets: ITileset[];
  layers: ITiledMapLayer[];
}

export class TiledMap extends Entity implements ITiledMap {
  private static DefaultGravity = 0.3;

  style = { strokeStyle: Color.Black };

  tilesets: ITileset[];
  layers: ITiledMapLayer[];
  cellSize = Size.valueOf(1);
  views: IViews<TiledMap> = [TiledMap.drawTiles, defaultView];
  behaviors: IBehaviors<TiledMap> = [
    defaultBehavior,
    gravityBehavior(TiledMap.DefaultGravity),
    TiledMap.processCollisions,
    foreachBehavior(floorPositionBehavior)
  ];

  private mainTileset?: ITileset;
  private mainLayer?: ITiledMapLayer;
  private mainTilesetName: string;
  private readonly mainLayerName: string;
  private readonly collisionManager: CollisionManager;

  constructor(mapFile: string, mainLayerName = "", mainTilesetName = "") {
    super();

    this.layers = [];
    this.tilesets = [];
    this.mainLayerName = mainLayerName;
    this.mainTilesetName = mainTilesetName;
    this.collisionManager = new CollisionManager(this);

    bindMethods(this, this.fromCell, this.toCell, this.getTile);

    this.disable().hide();

    // noinspection JSIgnoredPromiseFromCall
    this.load(mapFile, () => this.onLoad().enable().show());
  }

  private static drawTiles(map: TiledMap, brush: IBrush, deltaTime: number) {
    const { layers, tilesets } = map;

    layers.forEach(({ data }) => {
      data.forEach(row =>
        row.forEach(tile => {
          tilesets.forEach(tileset => {
            tileset.drawTile(tile, brush, deltaTime);
          });
        })
      );
    });
  }

  private static processCollisions(map: TiledMap) {
    map.forEach(map.collisionManager.processCollisions);
  }

  toCell(x: number | IPointData, y?: number): IPointData {
    const { w, h } = this.cellSize;
    const point = Point.valueOf(x, y);

    return Point.valueOf(point.x / w, point.y / h);
  }

  fromCell(x: number | IPointData, y?: number): IPointData {
    const { w, h } = this.cellSize;
    const point = Point.valueOf(x, y);

    return Point.valueOf(point.x * w, point.y * h);
  }

  getLayer(layerName?: string): ITiledMapLayer | undefined {
    const { layers } = this;

    if (!layerName) return this.mainLayer || undefined;

    const [layer] = layers.filter(({ name }) => name === layerName);

    return layer || null;
  }

  getTileset(tilesetName?: string): ITileset | undefined {
    const { tilesets } = this;

    if (!tilesetName) return this.mainTileset || undefined;

    const [tileset] = tilesets.filter(({ name }) => name === tilesetName);

    return tileset || null;
  }

  getTile(
    x: number | IPointData,
    y?: number,
    layerName?: string
  ): ITile | undefined {
    const point = Point.floor(this.toCell(Point.valueOf(x, y)));
    const layer = this.getLayer(layerName);

    if (!layer || point.x < 0 || point.y < 0) return undefined;

    return layer.data[point.y] && layer.data[point.y][point.x]
      ? layer.data[point.y][point.x]
      : undefined;
  }

  private load = async (mapFile: string, onLoad: () => void) => {
    const { tilesets, layers } = await MapLoader.loadXml(mapFile);

    layers.forEach(layer => {
      if (layer.name === this.mainLayerName) {
        // set main layer
        this.mainLayer = layer;
      }
    });
    tilesets.forEach(tileset => {
      const tilesetObj = new Tileset(tileset);

      if (!this.mainTilesetName) {
        this.mainTilesetName = tileset.name;
      }

      if (tileset.name === this.mainTilesetName) {
        // set main tileset
        this.mainTileset = tilesetObj;
      }

      this.tilesets.push(tilesetObj);
    });

    this.layers = layers;

    onLoad.apply(this);
  };

  private onLoad() {
    const layer = this.mainLayer;
    const tileset = this.mainTileset;

    if (tileset) {
      this.cellSize = Size.valueOf(tileset.tilewidth, tileset.tileheight);
    }

    if (layer && tileset) {
      this.setSize(
        layer.width * tileset.tilewidth,
        layer.height * tileset.tileheight
      );
    }

    return this;
  }
}
