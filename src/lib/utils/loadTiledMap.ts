import { fetchXml } from "./fetchXml";
import { ITiledMap } from "../entity/tiledMap";

export const loadTiledMap = (mapFile: string): Promise<ITiledMap> =>
  fetchXml(`/assets/maps/${mapFile}`)
    .then((xml: Document) => {
      const tilesets = Array.from(xml.querySelectorAll("tileset")).map(
        tileset => ({
          source: tileset.getAttribute("source"),
          firstgid: tileset.getAttribute("firstgid")
        })
      );
      const layers = xml.querySelectorAll("layer");
      const layersData = Array.from(layers).map(layer => {
        const id = layer.getAttribute("id");
        const name = layer.getAttribute("name");
        const width = layer.getAttribute("width");
        const height = layer.getAttribute("height");

        const dataElement = layer.querySelector("data");

        const data: number[][] = [];
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
            .forEach(row => data.push(row));
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
    })
    .then(async ({ tilesets, layers }) => {
      return {
        layers,
        tilesets: await Promise.all(
          tilesets.map(({ firstgid, source }) =>
            fetchXml(`${source}`.replace("../..", "/assets")).then(
              (xml: Document) => {
                const tileset = xml.querySelector("tileset")!;
                const name = tileset.getAttribute("name");
                const tilewidth = tileset.getAttribute("tilewidth");
                const tileheight = tileset.getAttribute("tileheight");
                const tilecount = tileset.getAttribute("tilecount");
                const columns = tileset.getAttribute("columns");

                const image = xml.querySelector("tileset image")!;
                const source = image.getAttribute("source");
                const width = image.getAttribute("width");
                const height = image.getAttribute("height");
                const transparent = image.getAttribute("trans");

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
            )
          )
        )
      };
    }) as any;
