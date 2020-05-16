import { IBoundsData } from "./bounds";

export enum Position {
  TOP = "TOP",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  BOTTOM = "BOTTOM",

  TOP_LEFT = "TOP_LEFT",
  TOP_CENTER = "TOP",
  TOP_RIGHT = "TOP_RIGHT",

  CENTER_LEFT = "LEFT",
  CENTER = "CENTER",
  CENTER_RIGHT = "RIGHT",

  BOTTOM_LEFT = "BOTTOM_LEFT",
  BOTTOM_CENTER = "BOTTOM",
  BOTTOM_RIGHT = "BOTTOM_RIGHT"
}

export const align = (
  bounds: IBoundsData,
  borderBounds: IBoundsData,
  position: Position
) => {
  switch (position) {
    case Position.TOP_LEFT: {
      bounds.x = 0;
      bounds.y = 0;

      break;
    }
    case Position.TOP:
    case Position.TOP_CENTER: {
      bounds.x = borderBounds.x + (borderBounds.w - bounds.w) / 2;
      bounds.y = 0;

      break;
    }
    case Position.TOP_RIGHT: {
      bounds.x = borderBounds.x + borderBounds.w - bounds.w;
      bounds.y = 0;

      break;
    }
    case Position.LEFT:
    case Position.CENTER_LEFT: {
      bounds.x = 0;
      bounds.y = borderBounds.y + (borderBounds.h - bounds.h) / 2;

      break;
    }
    case Position.CENTER: {
      bounds.x = borderBounds.x + (borderBounds.w - bounds.w) / 2;
      bounds.y = borderBounds.y + (borderBounds.h - bounds.h) / 2;

      break;
    }
    case Position.RIGHT:
    case Position.CENTER_RIGHT: {
      bounds.x = borderBounds.x + borderBounds.w - bounds.w;
      bounds.y = borderBounds.y + (borderBounds.h - bounds.h) / 2;

      break;
    }
    case Position.BOTTOM_LEFT: {
      bounds.x = 0;
      bounds.y = borderBounds.y + borderBounds.h - bounds.h;

      break;
    }
    case Position.BOTTOM:
    case Position.BOTTOM_CENTER: {
      bounds.x = borderBounds.x + (borderBounds.w - bounds.w) / 2;
      bounds.y = borderBounds.y + borderBounds.h - bounds.h;

      break;
    }
    case Position.BOTTOM_RIGHT: {
      bounds.x = borderBounds.x + borderBounds.w - bounds.w;
      bounds.y = borderBounds.y + borderBounds.h - bounds.h;

      break;
    }
    default: {
      return bounds;
    }
  }
};
