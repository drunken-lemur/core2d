import { randomEnum } from "./utils";

enum CompassDirection {
  NORTH = "NORTH",
  NORTHEAST = "NORTHEAST",
  EAST = "EAST",
  SOUTHEAST = "SOUTHEAST",
  SOUTH = "SOUTH",
  SOUTHWEST = "SOUTHWEST",
  WEST = "WEST",
  NORTHWEST = "NORTHWEST"
}

enum SideDirection {
  UP = CompassDirection.NORTH,
  RIGHT = CompassDirection.EAST,
  DOWN = CompassDirection.SOUTH,
  LEFT = CompassDirection.WEST
}

export type Direction = CompassDirection & SideDirection;

export namespace Direction {
  export const NORTH = CompassDirection.NORTH;
  export const NORTHEAST = CompassDirection.NORTHEAST;
  export const EAST = CompassDirection.EAST;
  export const SOUTHEAST = CompassDirection.SOUTHEAST;
  export const SOUTH = CompassDirection.SOUTH;
  export const SOUTHWEST = CompassDirection.SOUTHWEST;
  export const WEST = CompassDirection.WEST;
  export const NORTHWEST = CompassDirection.NORTHWEST;

  export const UP = SideDirection.UP;
  export const RIGHT = SideDirection.RIGHT;
  export const DOWN = SideDirection.DOWN;
  export const LEFT = SideDirection.LEFT;

  export const left = (direction: Direction) => {
    switch (direction) {
      case NORTH:
        return NORTHWEST;
      case NORTHEAST:
        return NORTH;
      case EAST:
        return NORTHEAST;
      case SOUTHEAST:
        return EAST;
      case SOUTH:
        return SOUTHEAST;
      case SOUTHWEST:
        return SOUTH;
      case WEST:
        return SOUTHWEST;
      case NORTHWEST:
        return WEST;
      default:
        return direction;
    }
  };

  export const right = (direction: Direction) => {
    switch (direction) {
      case NORTH:
        return NORTHEAST;
      case NORTHEAST:
        return EAST;
      case EAST:
        return SOUTHEAST;
      case SOUTHEAST:
        return SOUTH;
      case SOUTH:
        return SOUTHWEST;
      case SOUTHWEST:
        return WEST;
      case WEST:
        return NORTHWEST;
      case NORTHWEST:
        return NORTH;
      default:
        return direction;
    }
  };

  export const opposite = (direction: Direction) => {
    switch (direction) {
      case NORTH:
        return SOUTH;
      case NORTHEAST:
        return SOUTHWEST;
      case EAST:
        return WEST;
      case SOUTHEAST:
        return NORTHWEST;
      case SOUTH:
        return NORTH;
      case SOUTHWEST:
        return NORTHEAST;
      case WEST:
        return EAST;
      case NORTHWEST:
        return SOUTHEAST;
      default:
        return direction;
    }
  };

  export const random = (simple = false): Direction => {
    return (simple
      ? randomEnum(SideDirection)
      : randomEnum(CompassDirection)) as Direction;
  };
}

