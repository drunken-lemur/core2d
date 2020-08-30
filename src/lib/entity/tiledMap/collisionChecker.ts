import { Tile, TiledMap } from ".";
import { IEntity, ISides, Position } from "core";

export class CollisionChecker {
  private readonly map: TiledMap;

  constructor(map: TiledMap) {
    this.map = map;
  }

  isWall(tile?: Tile): boolean {
    return !!tile?.id;
  }

  getWalls(entity: IEntity): Partial<Record<keyof ISides, Tile>> {
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

  correctCollision(entity: IEntity): void {
    const walls = this.getWalls(entity);
    const top = walls[Position.Top];
    const bottom = walls[Position.Bottom];
    const left = walls[Position.Left];
    const right = walls[Position.Right];

    if (top) this.alignByTop(entity, top);
    if (bottom) this.alignByBottom(entity, bottom);
    if (left) this.alignByLeft(entity, left);
    if (right) this.alignByRight(entity, right);
  }

  alignByTop(entity: IEntity, top: Tile): void {
    entity.y = top.y * this.map.cellSize.h + this.map.cellSize.h;
  }

  alignByBottom(entity: IEntity, bottom: Tile): void {
    entity.y = bottom.y * this.map.cellSize.h - entity.h;
  }

  alignByLeft(entity: IEntity, left: Tile): void {
    entity.x = left.x * this.map.cellSize.w + this.map.cellSize.w;
  }

  alignByRight(entity: IEntity, right: Tile): void {
    entity.x = right.x * this.map.cellSize.w - entity.w;
  }
}
