import { Color } from "./color";
import { IPointData, Point } from "./point";
import { Bounds, IBoundsData } from "./bounds";
import { ISize, ISizeData, Size } from "./size";

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
    CanvasTextDrawingStyles {
  noTranslate?: boolean;

  setStyle(style: IBrushStyle): this;
}

export interface IBrushStyle extends Partial<IDrawerData> {}

interface ICacheBrush {
  canvas: HTMLCanvasElement;
  getCacheBrush: () => ICacheBrush & IBrush;
  drawCache: (
    cache: ICacheBrush,
    dx?: number,
    dy?: number,
    dw?: number,
    dh?: number,
    sx?: number,
    sy?: number,
    sw?: number,
    sh?: number
  ) => this;
}

interface IFilterBrush {
  removeColor: (hexColor: string) => this;
}

export interface IBrush
  extends IDrawerData,
    ICacheBrush,
    IFilterBrush,
    ISizeData {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean
  ): this;

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this;

  beginPath(): this;

  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ): this;

  clear(): this;

  clearRect(x: number | IBoundsData, y?: number, w?: number, h?: number): this;

  clip(fillRule?: CanvasFillRule | Path2D, fillRule_?: CanvasFillRule): this;

  closePath(): this;

  createImageData(sw: number | ImageData, sh?: number): ImageData;

  createLinearGradient(
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ): CanvasGradient;

  createPattern(
    image:
      | HTMLImageElement
      | SVGImageElement
      | HTMLVideoElement
      | HTMLCanvasElement
      | ImageBitmap
      | OffscreenCanvas,
    repetition: string | null
  ): CanvasPattern | null;

  createRadialGradient(
    x0: number,
    y0: number,
    r0: number,
    x1: number,
    y1: number,
    r1: number
  ): CanvasGradient;

  drawFocusIfNeeded(element: Element | Path2D, element_?: Element): this;

  drawImage(
    image:
      | IBrush
      | HTMLImageElement
      | SVGImageElement
      | HTMLVideoElement
      | HTMLCanvasElement
      | ImageBitmap
      | OffscreenCanvas,
    dx?: number,
    dy?: number,
    dw?: number,
    dh?: number,
    sx?: number,
    sy?: number,
    sw?: number,
    sh?: number
  ): this;

  ellipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean
  ): this;

  fill(fillRule?: CanvasFillRule | Path2D, fillRule_?: CanvasFillRule): this;

  fillRect(x: number, y: number, w: number, h: number): this;

  fillText(text: string, x: number, y: number, maxWidth?: number): this;

  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;

  getLineDash(): number[];

  getTransform(): DOMMatrix;

  isPointInPath(
    x: number | Path2D,
    y: number,
    fillRule?: CanvasFillRule | number,
    fillRule_?: CanvasFillRule
  ): boolean;

  isPointInStroke(x: number | Path2D, y: number, y_?: number): boolean;

  lineTo(x: number, y: number): this;

  measureText(text: string): TextMetrics;

  moveTo(x: number, y: number): this;

  putImageData(
    imagedata: ImageData,
    dx: number,
    dy: number,
    dirtyX?: number,
    dirtyY?: number,
    dirtyWidth?: number,
    dirtyHeight?: number
  ): this;

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): this;

  rect(x: number, y: number, w: number, h: number): this;

  resetTransform(): this;

  restore(): this;

  rotate(angle: number): this;

  save(): this;

  scale(x: number, y: number): this;

  scrollPathIntoView(path?: Path2D): this;

  setLineDash(segments: number[]): this;

  setTransform(
    a?: number | DOMMatrix2DInit,
    b?: number,
    c?: number,
    d?: number,
    e?: number,
    f?: number
  ): this;

  stroke(path?: Path2D): this;

  strokeRect(x: number, y: number, w: number, h: number): this;

  strokeText(text: string, x: number, y: number, maxWidth?: number): this;

  transform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ): this;

  translate(point: IPointData): this;
  translate(x: number, y: number): this;
}

export class Brush implements IBrush {
  static create = (size?: ISizeData) => {
    return new Brush(document.createElement("canvas"), size);
  };

  private readonly size: ISize;
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;

  get w() {
    return this.size.w;
  }

  set w(w: number) {
    this.size.w = w;
    this.canvas.width = w;
  }

  get h() {
    return this.size.h;
  }

  set h(h: number) {
    this.size.h = h;
    this.canvas.height = h;
  }

  constructor(canvas: HTMLCanvasElement, size?: ISizeData) {
    this.canvas = canvas;

    if (size) {
      this.size = new Size(size);
      this.canvas.width = size.w;
      this.canvas.height = size.h;
    } else {
      this.size = new Size(canvas.width, canvas.height);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No Context!");

    this.ctx = ctx;
  }

  get direction() {
    return this.ctx.direction;
  }

  set direction(direction: CanvasDirection) {
    this.ctx.direction = direction;
  }

  get fillStyle() {
    return this.ctx.fillStyle;
  }

  set fillStyle(fillStyle: string | CanvasGradient | CanvasPattern) {
    this.ctx.fillStyle = fillStyle;
  }

  get filter() {
    return this.ctx.filter;
  }

  set filter(filter: string) {
    this.ctx.filter = filter;
  }

  get font() {
    return this.ctx.font;
  }

  set font(font: string) {
    this.ctx.font = font;
  }

  get globalAlpha() {
    return this.ctx.globalAlpha;
  }

  set globalAlpha(globalAlpha: number) {
    this.ctx.globalAlpha = globalAlpha;
  }

  get globalCompositeOperation() {
    return this.ctx.globalCompositeOperation;
  }

  set globalCompositeOperation(globalCompositeOperation: string) {
    this.ctx.globalCompositeOperation = globalCompositeOperation;
  }

  get imageSmoothingEnabled() {
    return this.ctx.imageSmoothingEnabled;
  }

  set imageSmoothingEnabled(imageSmoothingEnabled: boolean) {
    this.ctx.imageSmoothingEnabled = imageSmoothingEnabled;
  }

  get imageSmoothingQuality() {
    return this.ctx.imageSmoothingQuality;
  }

  set imageSmoothingQuality(imageSmoothingQuality: ImageSmoothingQuality) {
    this.ctx.imageSmoothingQuality = imageSmoothingQuality;
  }

  get lineCap() {
    return this.ctx.lineCap;
  }

  set lineCap(lineCap: CanvasLineCap) {
    this.ctx.lineCap = lineCap;
  }

  get lineDashOffset() {
    return this.ctx.lineDashOffset;
  }

  set lineDashOffset(lineDashOffset: number) {
    this.ctx.lineDashOffset = lineDashOffset;
  }

  get lineJoin() {
    return this.ctx.lineJoin;
  }

  set lineJoin(lineJoin: CanvasLineJoin) {
    this.ctx.lineJoin = lineJoin;
  }

  get lineWidth() {
    return this.ctx.lineWidth;
  }

  set lineWidth(lineWidth: number) {
    this.ctx.lineWidth = lineWidth;
  }

  get miterLimit() {
    return this.ctx.miterLimit;
  }

  set miterLimit(miterLimit: number) {
    this.ctx.miterLimit = miterLimit;
  }

  get shadowBlur() {
    return this.ctx.shadowBlur;
  }

  set shadowBlur(shadowBlur: number) {
    this.ctx.shadowBlur = shadowBlur;
  }

  get shadowColor() {
    return this.ctx.shadowColor;
  }

  set shadowColor(shadowColor: string) {
    this.ctx.shadowColor = shadowColor;
  }

  get shadowOffsetX() {
    return this.ctx.shadowOffsetX;
  }

  set shadowOffsetX(shadowOffsetX: number) {
    this.ctx.shadowOffsetX = shadowOffsetX;
  }

  get shadowOffsetY() {
    return this.ctx.shadowOffsetY;
  }

  set shadowOffsetY(shadowOffsetY: number) {
    this.ctx.shadowOffsetY = shadowOffsetY;
  }

  get strokeStyle() {
    return this.ctx.strokeStyle;
  }

  set strokeStyle(strokeStyle: string | CanvasGradient | CanvasPattern) {
    this.ctx.strokeStyle = strokeStyle;
  }

  get textAlign() {
    return this.ctx.textAlign;
  }

  set textAlign(textAlign: CanvasTextAlign) {
    this.ctx.textAlign = textAlign;
  }

  get textBaseline() {
    return this.ctx.textBaseline;
  }

  set textBaseline(textBaseline: CanvasTextBaseline) {
    this.ctx.textBaseline = textBaseline;
  }

  get context2D() {
    return this.ctx;
  }

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean
  ) {
    this.ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

    return this;
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    this.ctx.arcTo(x1, y1, x2, y2, radius);

    return this;
  }

  beginPath() {
    this.ctx.beginPath();
    return this;
  }

  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ) {
    this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);

    return this;
  }

  clear() {
    return this.clearRect(0, 0, this.w, this.h);
  }

  clearRect(x: number | IBoundsData, y?: number, w?: number, h?: number) {
    const bounds = Bounds.valueOf(x, y, w, h);

    this.ctx.clearRect(bounds.x, bounds.y, bounds.w, bounds.h);

    return this;
  }

  clip(path?: CanvasFillRule | Path2D, fillRule?: CanvasFillRule) {
    if (path && fillRule) {
      this.ctx.clip(path as Path2D, fillRule);
    } else if (path) {
      this.ctx.clip(path as CanvasFillRule);
    } else {
      this.ctx.clip();
    }

    return this;
  }

  closePath() {
    this.ctx.closePath();

    return this;
  }

  createImageData(sw: number | ImageData, sh?: number): ImageData {
    if (typeof sw === "number") {
      return this.ctx.createImageData(sw, sh!);
    }

    return this.ctx.createImageData(sw);
  }

  createLinearGradient(
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ): CanvasGradient {
    return this.ctx.createLinearGradient(x0, y0, x1, y1);
  }

  createPattern(
    image:
      | HTMLImageElement
      | SVGImageElement
      | HTMLVideoElement
      | HTMLCanvasElement
      | ImageBitmap
      | OffscreenCanvas,
    repetition: string | null
  ): CanvasPattern | null {
    return this.ctx.createPattern(image, repetition);
  }

  createRadialGradient(
    x0: number,
    y0: number,
    r0: number,
    x1: number,
    y1: number,
    r1: number
  ): CanvasGradient {
    return this.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  }

  drawFocusIfNeeded(path: Element | Path2D, element?: Element) {
    if (element) {
      this.ctx.drawFocusIfNeeded(path as Path2D, element);
    } else {
      this.ctx.drawFocusIfNeeded(path as Element);
    }

    return this;
  }

  drawImage(
    image:
      | Brush
      | HTMLImageElement
      | SVGImageElement
      | HTMLVideoElement
      | HTMLCanvasElement
      | ImageBitmap
      | OffscreenCanvas,
    dx = 0,
    dy = 0,
    dw?: number,
    dh?: number,
    sx?: number,
    sy?: number,
    sw?: number,
    sh?: number
  ) {
    const i = image as any;
    const toDraw = i.ctx && i.canvas ? i.canvas : i;

    if (dw !== undefined && dh !== undefined) {
      if (
        sx !== undefined &&
        sy !== undefined &&
        sw !== undefined &&
        sh !== undefined
      ) {
        this.ctx.drawImage(toDraw, sx, sy, sw, sh, dx, dy, dw, dh);
      } else {
        this.ctx.drawImage(toDraw, dx, dy, dw, dh);
      }
    } else {
      this.ctx.drawImage(toDraw, dx, dy);
    }

    return this;
  }

  ellipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean
  ) {
    this.ctx.ellipse(
      x,
      y,
      radiusX,
      radiusY,
      rotation,
      startAngle,
      endAngle,
      anticlockwise
    );

    return this;
  }

  fill(path?: CanvasFillRule | Path2D, fillRule?: CanvasFillRule) {
    if (path && fillRule) {
      this.ctx.fill(path as Path2D, fillRule);
    } else if (path) {
      this.ctx.fill(path as CanvasFillRule);
    } else {
      this.ctx.fill();
    }

    return this;
  }

  fillRect(x: number, y: number, w: number, h: number) {
    this.ctx.fillRect(x, y, w, h);

    return this;
  }

  fillText(text: string, x: number, y: number, maxWidth?: number) {
    this.ctx.fillText(text, x, y, maxWidth);

    return this;
  }

  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {
    return this.ctx.getImageData(sx, sy, sw, sh);
  }

  getLineDash(): number[] {
    return this.ctx.getLineDash();
  }

  getTransform(): DOMMatrix {
    return this.ctx.getTransform();
  }

  isPointInPath(
    path: number | Path2D,
    x: number,
    y: number | CanvasFillRule,
    fillRule?: CanvasFillRule
  ): boolean {
    if (fillRule) {
      return this.ctx.isPointInPath(path as Path2D, x, y as number, fillRule);
    } else {
      // noinspection JSSuspiciousNameCombination
      return this.ctx.isPointInPath(path as number, x, y as CanvasFillRule);
    }
  }

  isPointInStroke(path: number | Path2D, x: number, y?: number): boolean {
    if (y) {
      return this.ctx.isPointInStroke(path as Path2D, x, y);
    } else {
      // noinspection JSSuspiciousNameCombination
      return this.ctx.isPointInStroke(path as number, x);
    }
  }

  lineTo(x: number, y: number) {
    this.ctx.lineTo(x, y);

    return this;
  }

  measureText(text: string): TextMetrics {
    return this.ctx.measureText(text);
  }

  moveTo(x: number, y: number) {
    this.ctx.moveTo(x, y);

    return this;
  }

  putImageData(
    imageData: ImageData,
    dx: number,
    dy: number,
    dirtyX?: number,
    dirtyY?: number,
    dirtyWidth?: number,
    dirtyHeight?: number
  ) {
    this.ctx.putImageData(
      imageData,
      dx,
      dy,
      dirtyX!,
      dirtyY!,
      dirtyWidth!,
      dirtyHeight!
    );

    return this;
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    this.ctx.quadraticCurveTo(cpx, cpy, x, y);

    return this;
  }

  rect(x: number, y: number, w: number, h: number) {
    this.ctx.rect(x, y, w, h);

    return this;
  }

  resetTransform() {
    this.ctx.resetTransform();

    return this;
  }

  restore() {
    this.ctx.restore();

    return this;
  }

  rotate(angle: number) {
    this.ctx.rotate(angle);

    return this;
  }

  save() {
    this.ctx.save();

    return this;
  }

  scale(x: number, y: number) {
    this.ctx.scale(x, y);

    return this;
  }

  scrollPathIntoView(path?: Path2D) {
    const { scrollPathIntoView } = this.ctx;

    path ? scrollPathIntoView(path) : scrollPathIntoView();

    return this;
  }

  setLineDash(segments: number[]) {
    this.ctx.setLineDash(segments);

    return this;
  }

  setStyle(style: IBrushStyle) {
    Object.assign(this, style);

    return this;
  }

  setTransform(
    a: number | DOMMatrix2DInit,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) {
    if (typeof a === "number") {
      this.ctx.setTransform(a, b, c, d, e, f);
    } else {
      this.ctx.setTransform(a);
    }

    return this;
  }

  stroke(path?: Path2D) {
    path ? this.ctx.stroke(path) : this.ctx.stroke();

    return this;
  }

  strokeRect(x: number, y: number, w: number, h: number) {
    this.ctx.strokeRect(x, y, w, h);

    return this;
  }

  strokeText(text: string, x: number, y: number, maxWidth?: number) {
    this.ctx.strokeText(text, x, y, maxWidth);

    return this;
  }

  transform(a: number, b: number, c: number, d: number, e: number, f: number) {
    this.ctx.transform(a, b, c, d, e, f);

    return this;
  }

  translate(x: number | IPointData, y?: number) {
    if (typeof x === "number" && typeof y === "number") {
      this.ctx.translate(x, y);
    } else {
      const point = Point.valueOf(x, y);
      this.ctx.translate(point.x, point.y);
    }

    return this;
  }

  getCacheBrush = () => {
    // todo: copy style to CacheBrush

    return new Brush(document.createElement("canvas"), this);
  };

  drawCache = (
    cache: ICacheBrush,
    dx = 0,
    dy = 0,
    dw?: number,
    dh?: number,
    sx?: number,
    sy?: number,
    sw?: number,
    sh?: number
  ) => {
    if (dw !== undefined && dh !== undefined) {
      if (
        sx !== undefined &&
        sy !== undefined &&
        sw !== undefined &&
        sh !== undefined
      ) {
        this.ctx.drawImage(cache.canvas, dx, dy, dw, dh, sx, sy, sw, sh);
      } else {
        this.ctx.drawImage(cache.canvas, dx, dy, dw, dh);
      }
    } else {
      this.ctx.drawImage(cache.canvas, dx, dy);
    }

    return this;
  };

  removeColor = (hexColor: string) => {
    const { w, h } = this;
    const color = Color.hexToRgb(hexColor);
    const imageData = this.ctx.getImageData(0, 0, w, h);

    if (color) {
      const { data } = imageData;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (
          r === color.r &&
          g === color.g &&
          b === color.b &&
          (!color.a || a === color.a)
        ) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;
        }
      }

      this.ctx.clearRect(0, 0, w, h);
      this.ctx.putImageData(imageData, 0, 0);
    }

    return this;
  };
}
