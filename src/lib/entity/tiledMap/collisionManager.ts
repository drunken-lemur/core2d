import { IEntity, ISides, IVelocity, Position } from "core";
import { bindMethods } from "lib/utils";

import { InfoLabel } from "..";
import { ITile, TiledMap } from ".";

export class CollisionManager {
  private readonly map: TiledMap;

  constructor(map: TiledMap) {
    this.map = map;

    bindMethods(
      this,
      this.processCollisions,
      this.processCollisions2,
      this.getTile,
      this.isWall,
      this.getWalls,
      this.getWalls2
    );
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

  processCollisions2(entity: IEntity & IVelocity): void {
    const { velocity } = entity;

    const walls = this.getWalls2(entity);
    const top = walls[Position.Top];
    const bottom = walls[Position.Bottom];
    const left = walls[Position.Left];
    const right = walls[Position.Right];

    // InfoLabel.getInstance(
    //   JSON.stringify({
    //     Top: +!!top,
    //     Bottom: +!!bottom,
    //     Left: +!!left,
    //     Right: +!!right
    //   })
    // );

    if (velocity) {
      if (top || bottom) velocity.y = 0;
      if (left || right) velocity.x = 0;
    }

    if (top && bottom && left && right) return;
    if (top) {
      // entity.y = (top.y + 1) * this.map.cellSize.h;
    }
    if (bottom) {
      // entity.y = bottom.y * this.map.cellSize.h - entity.h;
    }

    if (left) {
      // entity.x = left.x * this.map.cellSize.w + this.map.cellSize.w;
    }
    if (right) {
      // entity.x = right.x * this.map.cellSize.w - entity.w;
    }
  }

  // noinspection JSMethodCanBeStatic
  private isWall(tile?: ITile): boolean {
    return !!tile?.id;
  }

  private getTile(x: number, y: number): ITile | undefined {
    const layer = this.map.getLayer();

    if (!layer || x < 0 || y < 0) return undefined;

    return layer.data[y] && layer.data[y][x] ? layer.data[y][x] : undefined;
  }

  private getWalls(
    entity: IEntity & IVelocity
  ): Partial<Record<keyof ISides, ITile>> {
    const { cellSize, getTile } = this.map;

    // correction
    const cor = 1;

    const stepX = cellSize.w / 2;
    const stepY = cellSize.h / 2;

    const minX = entity.x + cor;
    const minY = entity.y + cor;
    const maxX = entity.x + entity.w - cor * 2;
    const maxY = entity.y + entity.h - cor * 2;

    const walls: Partial<Record<keyof ISides, ITile>> = {
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

    InfoLabel.getInstance(
      JSON.stringify({
        Top: +!!walls[Position.Top],
        Bottom: +!!walls[Position.Bottom],
        Left: +!!walls[Position.Left],
        Right: +!!walls[Position.Right]
      })
    );

    return walls;
  }

  private getWalls2(
    entity: IEntity & IVelocity
  ): Partial<Record<keyof ISides, ITile>> {
    const { cellSize } = this.map;

    const entityX = (entity.x / cellSize.w) | 0;
    const entityY = (entity.y / cellSize.h) | 0;
    const entityW = (entity.w / cellSize.w) | 0;
    const entityH = (entity.h / cellSize.h) | 0;

    const minX = entityX;
    const minY = entityY;
    const maxX = entityX + entityW;
    const maxY = entityY + entityH;

    // InfoLabel.getInstance(
    //   JSON.stringify({
    //     entityX,
    //     entityY,
    //     entityW,
    //     entityH,
    //   })
    // );

    const walls: Partial<Record<keyof ISides, ITile>> = {
      [Position.Top]: undefined,
      [Position.Right]: undefined,
      [Position.Bottom]: undefined,
      [Position.Left]: undefined
    };

    // top wall
    for (let x = minX; x < maxX; x++) {
      const tile = this.getTile(x, minY);
      if (this.isWall(tile)) walls[Position.Top] = tile;
    }

    // bottom wall
    for (let x = minX; x < maxX; x++) {
      const tile = this.getTile(x, maxY);
      if (this.isWall(tile)) walls[Position.Bottom] = tile;
    }

    // left wall
    for (let y = minY; y < maxY; y++) {
      const tile = this.getTile(minX, y);
      if (this.isWall(tile)) walls[Position.Left] = tile;
    }

    // right wall
    for (let y = minY; y < maxY; y++) {
      const tile = this.getTile(maxX, y);
      if (this.isWall(tile)) walls[Position.Right] = tile;
    }

    InfoLabel.getInstance(
      JSON.stringify({
        Top: +!!walls[Position.Top],
        Bottom: +!!walls[Position.Bottom],
        Left: +!!walls[Position.Left],
        Right: +!!walls[Position.Right]
      })
    );

    return walls;
  }
}
