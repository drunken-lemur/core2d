import { fetchXml } from "lib/utils";

import { ITile } from ".";

export class MapLoader {
  static async loadXml(mapFile: string) {
    const mapXml = await fetchXml(`/assets/maps/${mapFile}`);
    const map = MapLoader.parseMapXml(mapXml);

    const layers = map.layers;

    const tilesets = await Promise.all(
      map.tilesets.map(async tileset => {
        const { firstgid, source } = tileset;
        const tilesetFile = `${source}`.replace("../..", "/assets");
        const tilesetXml = await fetchXml(tilesetFile);

        return MapLoader.parseTilesetXml(tilesetXml, firstgid);
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
}
