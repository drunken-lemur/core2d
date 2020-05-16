interface CanvasFillStrokeStylesData {
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
}

interface CanvasPathDrawingStylesData {
  lineCap: CanvasLineCap;
  lineDashOffset: number;
  lineJoin: CanvasLineJoin;
  lineWidth: number;
  miterLimit: number;
}

export interface IDrawerData
  extends CanvasCompositing,
    CanvasFillStrokeStylesData,
    CanvasFilters,
    CanvasImageSmoothing,
    CanvasPathDrawingStylesData,
    CanvasShadowStyles,
    CanvasTextDrawingStyles {}

export interface IDrawer extends CanvasRenderingContext2D {}
