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
  setStyle(style: IDrawerStyle): this;
}

export interface IDrawer extends IDrawerData {
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
  clearRect(x: number, y: number, w: number, h: number): this;
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
      | HTMLImageElement
      | SVGImageElement
      | HTMLVideoElement
      | HTMLCanvasElement
      | ImageBitmap
      | OffscreenCanvas,
    dx: number,
    dy: number,
    dw?: number,
    dh?: number,
    dx_?: number,
    dy_?: number,
    dw_?: number,
    dh_?: number
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
  translate(x: number, y: number): this;
}

export interface IDrawerStyle extends Partial<IDrawerData> {}

export class Drawer implements IDrawer {
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

  private readonly ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
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

  clearRect(x: number, y: number, w: number, h: number) {
    this.ctx.clearRect(x, y, w, h);

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
      | HTMLImageElement
      | SVGImageElement
      | HTMLVideoElement
      | HTMLCanvasElement
      | ImageBitmap
      | OffscreenCanvas,
    dx: number,
    dy: number,
    dw?: number,
    dh?: number,
    dx_?: number,
    dy_?: number,
    dw_?: number,
    dh_?: number
  ) {
    this.ctx.drawImage(image, dx, dy, dw!, dh!, dx_!, dy_!, dw_!, dh_!);

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

  setStyle(style: IDrawerStyle) {
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

  translate(x: number, y: number) {
    this.ctx.translate(x, y);

    return this;
  }
}
