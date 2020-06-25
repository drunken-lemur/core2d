import { assetsDir, imagesDir, mapsDir, tilesetsDir } from "config";

export const assetsPath = (path: string) => assetsDir + path;

export const imagesPath = (path: string) => imagesDir + path;

export const mapsPath = (path: string) => mapsDir + path;

export const tilesetsPath = (path: string) => tilesetsDir + path;
