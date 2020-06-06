import { randomEnum } from "./utils";
import { IPointData, Point } from "./point";

enum CompassDirection {
  North = "North",
  NorthEast = "NorthEast",
  East = "East",
  SouthEast = "SouthEast",
  South = "South",
  SouthWest = "SouthWest",
  West = "West",
  NorthWest = "NorthWest"
}

enum SimpleDirection {
  North = "North",
  East = "East",
  South = "South",
  West = "West"
}

export type Direction = CompassDirection;

export namespace Direction {
  export const North = CompassDirection.North;
  export const NorthEast = CompassDirection.NorthEast;
  export const East = CompassDirection.East;
  export const SouthEast = CompassDirection.SouthEast;
  export const South = CompassDirection.South;
  export const SouthWest = CompassDirection.SouthWest;
  export const West = CompassDirection.West;
  export const NorthWest = CompassDirection.NorthWest;

  export const left = (direction: CompassDirection) => {
    switch (direction) {
      case CompassDirection.North:
        return CompassDirection.NorthWest;
      case CompassDirection.NorthEast:
        return CompassDirection.North;
      case CompassDirection.East:
        return CompassDirection.NorthEast;
      case CompassDirection.SouthEast:
        return CompassDirection.East;
      case CompassDirection.South:
        return CompassDirection.SouthEast;
      case CompassDirection.SouthWest:
        return CompassDirection.South;
      case CompassDirection.West:
        return CompassDirection.SouthWest;
      case CompassDirection.NorthWest:
        return CompassDirection.West;
      default:
        return direction;
    }
  };

  export const right = (direction: CompassDirection) => {
    switch (direction) {
      case CompassDirection.North:
        return CompassDirection.NorthEast;
      case CompassDirection.NorthEast:
        return CompassDirection.East;
      case CompassDirection.East:
        return CompassDirection.SouthEast;
      case CompassDirection.SouthEast:
        return CompassDirection.South;
      case CompassDirection.South:
        return CompassDirection.SouthWest;
      case CompassDirection.SouthWest:
        return CompassDirection.West;
      case CompassDirection.West:
        return CompassDirection.NorthWest;
      case CompassDirection.NorthWest:
        return CompassDirection.North;
      default:
        return direction;
    }
  };

  export const opposite = (direction: Direction) => {
    switch (direction) {
      case CompassDirection.North:
        return CompassDirection.South;
      case CompassDirection.NorthEast:
        return CompassDirection.SouthWest;
      case CompassDirection.East:
        return CompassDirection.West;
      case CompassDirection.SouthEast:
        return CompassDirection.NorthWest;
      case CompassDirection.South:
        return CompassDirection.North;
      case CompassDirection.SouthWest:
        return CompassDirection.NorthEast;
      case CompassDirection.West:
        return CompassDirection.East;
      case CompassDirection.NorthWest:
        return CompassDirection.SouthEast;
      default:
        return direction;
    }
  };

  export const random = (simple = false) => {
    return simple
      ? ((randomEnum(SimpleDirection) as any) as CompassDirection)
      : randomEnum(CompassDirection);
  };

  export const getDeltaPoint = (direction: Direction): IPointData => {
    switch (direction) {
      case CompassDirection.North:
        return Point.valueOf(0, -1);
      case CompassDirection.NorthEast:
        return Point.valueOf(1, -1);
      case CompassDirection.East:
        return Point.valueOf(1, 0);
      case CompassDirection.SouthEast:
        return Point.valueOf(1, 1);
      case CompassDirection.South:
        return Point.valueOf(0, 1);
      case CompassDirection.SouthWest:
        return Point.valueOf(-1, 1);
      case CompassDirection.West:
        return Point.valueOf(-1, 0);
      case CompassDirection.NorthWest:
        return Point.valueOf(-1, -1);
      default:
        return Point.valueOf(0, 0);
    }
  };
}
