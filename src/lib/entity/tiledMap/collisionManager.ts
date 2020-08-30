import { IEntity, ISides, IVelocity, Position } from "core";
import { bindMethods } from "lib/utils";

import { Tile, TiledMap } from ".";

export class CollisionManager {
  private readonly map: TiledMap;

  constructor(map: TiledMap) {
    this.map = map;

    bindMethods(this, this.processCollisions, this.isWall, this.getWalls);
  }

  processCollisions(entity: IEntity & IVelocity): void {
    const { velocity } = entity;

    const walls = this.getWalls(entity);
    const top = walls[Position.Top];
    const bottom = walls[Position.Bottom];
    const left = walls[Position.Left];
    const right = walls[Position.Right];

    if (velocity) {
      if (top || bottom) velocity.y = 0;
      if (left || right) velocity.x = 0;
    }

    if (top && bottom && left && right) return;
    if (top) {
      entity.y = top.y * this.map.cellSize.h + this.map.cellSize.h;
    }
    if (bottom) {
      entity.y = bottom.y * this.map.cellSize.h - entity.h;
    }

    if (left) {
      entity.x = left.x * this.map.cellSize.w + this.map.cellSize.w;
    }
    if (right) {
      entity.x = right.x * this.map.cellSize.w - entity.w;
    }
  }

  // noinspection JSMethodCanBeStatic
  private isWall(tile?: Tile): boolean {
    return !!tile?.id;
  }

  private getWalls(
    entity: IEntity & IVelocity
  ): Partial<Record<keyof ISides, Tile>> {
    const { cellSize, getTile } = this.map;

    // correction
    const cor = 1;

    const stepX = cellSize.w / 2;
    const stepY = cellSize.h / 2;

    const minX = entity.x + cor;
    const minY = entity.y + cor;
    const maxX = entity.x + entity.w - cor * 2;
    const maxY = entity.y + entity.h - cor * 2;

    const walls: Partial<Record<keyof ISides, Tile>> = {
      [Position.Top]: undefined,
      [Position.Right]: undefined,
      [Position.Bottom]: undefined,
      [Position.Left]: undefined
    };

    // top wall
    for (let x = minX; x < maxX + stepX; x += stepX) {
      if (x >= maxX) x = maxX;
      const tile = getTile(x, minY - cor);
      if (this.isWall(tile)) walls[Position.Top] = tile;
      if (x >= maxX) break;
    }

    // bottom wall
    for (let x = minX; x < maxX + stepX; x += stepX) {
      if (x >= maxX) x = maxX;
      const tile = getTile(x, maxY + cor);
      if (this.isWall(tile)) walls[Position.Bottom] = tile;
      if (x >= maxX) break;
    }

    // left wall
    for (let y = minY; y < maxY + stepY; y += stepY) {
      if (y >= maxY) y = maxY;
      const tile = getTile(minX - cor, y);
      if (this.isWall(tile)) walls[Position.Left] = tile;
      if (y >= maxY) break;
    }

    // right wall
    for (let y = minY; y < maxY + stepY; y += stepY) {
      if (y >= maxY) y = maxY;
      const tile = getTile(maxX + cor, y);
      if (this.isWall(tile)) walls[Position.Right] = tile;
      if (y >= maxY) break;
    }

    return walls;
  }
}
