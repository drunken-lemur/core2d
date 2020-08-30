import {
  Color,
  defaultBehavior,
  defaultView,
  Entity,
  floorPositionBehavior,
  foreachBehavior,
  IBehaviors,
  IBrush,
  IEntity,
  IPointData,
  ISides,
  IVelocity,
  IViews,
  Point,
  Position,
  Size
} from "core";
import { bindMethods, fetchXml, gravityBehavior } from "lib";

import { ITile } from "./tile";
import { ITileset, Tileset } from "./tileset";
import { CollisionChecker, InfoLabel } from "..";

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
  private readonly collisionChecker: CollisionChecker;

  private infoLabel = new InfoLabel("Info Label");

  constructor(mapFile: string, mainLayerName = "", mainTilesetName = "") {
    super();

    this.layers = [];
    this.tilesets = [];
    this.mainLayerName = mainLayerName;
    this.mainTilesetName = mainTilesetName;
    this.collisionChecker = new CollisionChecker(this);

    bindMethods(this, this.fromCell, this.toCell, this.getTile);

    this.disable().hide();
    // noinspection JSIgnoredPromiseFromCall
    this.load(mapFile, () => {
      this.onLoad()
        .enable()
        .show();

      this.infoLabel.align(this, Position.CenterLeft);
    });
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

    map.infoLabel.draw(brush, deltaTime);
  }

  private static processCollisions(map: TiledMap) {
    map.forEach<IVelocity>(children => {
      let walls = map.collisionChecker.getWalls(children);

      map.collisionChecker.correctCollision(children);

      const info = JSON.stringify({
        TOP: +!!walls[Position.Top],
        BOTTOM: +!!walls[Position.Bottom],
        LEFT: +!!walls[Position.Left],
        RIGHT: +!!walls[Position.Right]
      });

      map.infoLabel.text = info + "\n" + JSON.stringify(children.getPosition());
    });
  }

  private static async load(mapFile: string) {
    const mapXml = await fetchXml(`/assets/maps/${mapFile}`);
    const map = TiledMap.parseMapXml(mapXml);

    const layers = map.layers;

    const tilesets = await Promise.all(
      map.tilesets.map(async tileset => {
        const { firstgid, source } = tileset;
        const tilesetFile = `${source}`.replace("../..", "/assets");
        const tilesetXml = await fetchXml(tilesetFile);

        return TiledMap.parseTilesetXml(tilesetXml, firstgid);
      })
    );

    return { layers, tilesets };
  }

  private static parseMapXml(mapXml: Document) {
    const tilesets = Array.from(mapXml.querySelectorAll("tileset")).map(
      tileset => ({
        source: tileset.getAttribute("source") || "",
        firstgid: tileset.getAttribute("firstgid") || ""
      })
    );
    const layers = mapXml.querySelectorAll("layer");
    const layersData = Array.from(layers).map(layer => {
      const id = layer.getAttribute("id") || "";
      const name = layer.getAttribute("name") || "";
      const width = layer.getAttribute("width") || "";
      const height = layer.getAttribute("height") || "";

      const dataElement = layer.querySelector("data") || "";

      const data: ITile[][] = [];
      if (dataElement) {
        dataElement.innerHTML
          .trim()
          .split("\n")
          .map(row =>
            row
              .replace(/,$/, "")
              .split(",")
              .map(Number)
          )
          .forEach((row, y) => {
            data.push(row.map((id, x) => ({ id, x, y })));
          });
      }

      return {
        name,
        data,
        id: parseInt(`${id}`),
        width: parseInt(`${width}`),
        height: parseInt(`${height}`)
      };
    });

    return { tilesets, layers: layersData };
  }

  private static parseTilesetXml(tilesetXml: Document, firstgid: string) {
    const tileset = tilesetXml.querySelector("tileset")!;
    const name = tileset.getAttribute("name") || "";
    const tilewidth = tileset.getAttribute("tilewidth") || "";
    const tileheight = tileset.getAttribute("tileheight") || "";
    const tilecount = tileset.getAttribute("tilecount") || "";
    const columns = tileset.getAttribute("columns") || "";

    const image = tilesetXml.querySelector("tileset image")!;
    const source = image.getAttribute("source") || "";
    const width = image.getAttribute("width") || "";
    const height = image.getAttribute("height") || "";
    const transparent = image.getAttribute("trans") || "";

    return {
      name,
      tilewidth: parseInt(`${tilewidth}`),
      tileheight: parseInt(`${tileheight}`),
      tilecount: parseInt(`${tilecount}`),
      firstgid: parseInt(`${firstgid}`),
      columns: parseInt(`${columns}`),
      image: {
        transparent,
        width: parseInt(`${width}`),
        height: parseInt(`${height}`),
        source: `${source}`.replace("../..", "")
      }
    };
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
    const { tilesets, layers } = await TiledMap.load(mapFile);

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
