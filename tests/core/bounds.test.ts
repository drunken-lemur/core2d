// @ts-ignore
it("", () => void 0);
// import { Size, Point, Bounds } from "core";
//
// it("valueOf", () => {
//   const a = Bounds.valueOf();
//   const b = Bounds.valueOf(1);
//   const c = Bounds.valueOf(2, 3);
//   const d = Bounds.valueOf({ x: 4, y: 5, w: 6, h: 8 });
//   const e = Bounds.valueOf(b);
//
//   expect(a).toMatchObject({ x: 0, y: 0 });
//   expect(b).toMatchObject({ x: 1, y: 0 });
//   expect(c).toMatchObject({ x: 2, y: 3 });
//   expect(d).toMatchObject({ x: 4, y: 5 });
//   expect(e).toMatchObject({ x: 1, y: 0 });
// });
//
// it("getBounds", () => {
//   const a = new Bounds({ x: 1, y: 2, w: 3, h: 4 });
//
//   expect(a.getBounds()).toMatchObject({ x: 1, y: 2, w: 3, h: 4 });
// });
//
// it("objectOf", () => {
//   const a = Bounds.objectOf();
//   const b = Bounds.objectOf(1);
//   const c = Bounds.objectOf(2, 3);
//   const d = Bounds.objectOf(4, 5, 6);
//   const e = Bounds.objectOf(7, 8, 9, 10);
//   const f = Bounds.objectOf({ x: 11, y: 12, w: 13, h: 14 });
//   const g = Bounds.objectOf(b);
//
//   expect(a.getBounds()).toMatchObject({ x: 0, y: 0, w: 0, h: 0 });
//   expect(b.getBounds()).toMatchObject({ x: 1, y: 0, w: 0, h: 0 });
//   expect(c.getBounds()).toMatchObject({ x: 2, y: 3, w: 0, h: 0 });
//   expect(d.getBounds()).toMatchObject({ x: 4, y: 5, w: 6, h: 0 });
//   expect(e.getBounds()).toMatchObject({ x: 7, y: 8, w: 9, h: 10 });
//   expect(f.getBounds()).toMatchObject({ x: 11, y: 12, w: 13, h: 14 });
//   expect(g.getBounds()).toMatchObject({ x: 1, y: 0, w: 0, h: 0 });
// });
//
// it("eqBounds", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = Bounds.objectOf(1, 2, 3, 4);
//
//   expect(a.eqBounds(b)).toBeTruthy();
// });
//
// it("eq", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = Size.valueOf(3, 4);
//
//   expect(a.eq(b)).toBeTruthy();
// });
//
// it("eqPosition", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = Point.valueOf(1, 2);
//
//   expect(a.eqPosition(b)).toBeTruthy();
// });
//
// it("setBounds", () => {
//   const a = new Bounds();
//
//   a.setBounds(Bounds.valueOf(1, 2, 3, 4));
//
//   expect(a.eqBounds(Bounds.valueOf(1, 2, 3, 4))).toBeTruthy();
// });
//
// it("set", () => {
//   const a = new Bounds();
//
//   a.set(Size.valueOf(3, 4));
//
//   expect(a.eq(Size.valueOf(3, 4))).toBeTruthy();
// });
//
// it("setPosition", () => {
//   const a = new Bounds();
//
//   a.setPosition(Point.valueOf(3, 4));
//
//   expect(a.eqPosition(Point.valueOf(3, 4))).toBeTruthy();
// });
//
// it("plusBounds", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = Bounds.valueOf(5, 6, 7, 8);
//
//   a.plusBounds(b);
//
//   expect(a.eqBounds(Bounds.valueOf(6, 8, 10, 12))).toBeTruthy();
// });
//
// it("plus", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = Size.valueOf(5, 6);
//
//   a.plus(b);
//
//   expect(a.eqBounds(Bounds.valueOf(1, 2, 8, 10))).toBeTruthy();
// });
//
// it("plusPosition", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = Point.valueOf(5, 6);
//
//   a.plusPosition(b);
//
//   expect(a.eqBounds(Bounds.valueOf(6, 8, 3, 4))).toBeTruthy();
// });
//
// it("minusBounds", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = Bounds.valueOf(5, 6, 7, 8);
//
//   a.minusBounds(b);
//
//   expect(a.eqBounds(Bounds.valueOf(-4, -4, -4, -4))).toBeTruthy();
// });
//
// it("minus", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = Size.valueOf(5, 6);
//
//   a.minus(b);
//
//   expect(a.eqBounds(Bounds.valueOf(1, 2, -2, -2))).toBeTruthy();
// });
//
// it("minusPosition", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = Point.valueOf(5, 6);
//
//   a.minusPosition(b);
//
//   expect(a.eqBounds(Bounds.valueOf(-4, -4, 3, 4))).toBeTruthy();
// });
//
// it("multiplyBounds", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = Bounds.valueOf(4, 5, 6, 7);
//
//   a.multiplyBounds(b);
//
//   expect(a.eqBounds(Bounds.valueOf(4, 10, 18, 28))).toBeTruthy();
// });
//
// it("multiply", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = Size.valueOf(5, 6);
//
//   a.multiply(b);
//
//   expect(a.eqBounds(Bounds.valueOf(1, 2, 15, 24))).toBeTruthy();
// });
//
// it("multiplyPosition", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = Point.valueOf(5, 6);
//
//   a.multiplyPosition(b);
//
//   expect(a.eqBounds(Bounds.valueOf(5, 12, 3, 4))).toBeTruthy();
// });
//
// it("divideBounds", () => {
//   const a = Bounds.valueOf(1, 2, 4, 8);
//   const b = Bounds.objectOf(16, 32, 64, 128);
//
//   b.divideBounds(a);
//
//   expect(b.eqBounds(Bounds.valueOf(16, 16, 16, 16))).toBeTruthy();
// });
//
// it("divide", () => {
//   const a = Bounds.objectOf(1, 2, 4, 8);
//   const b = Size.valueOf(16, 32);
//
//   a.divide(b);
//
//   expect(a.eqBounds(Bounds.valueOf(1, 2, 0.25, 0.25))).toBeTruthy();
// });
//
// it("dividePosition", () => {
//   const a = Bounds.objectOf(1, 2, 4, 8);
//   const b = Point.valueOf(16, 32);
//
//   a.dividePosition(b);
//
//   expect(a.eqBounds(Bounds.valueOf(0.0625, 0.0625, 4, 8))).toBeTruthy();
// });
//
// it("invertBounds", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//
//   a.invertBounds();
//
//   expect(a.eqBounds(Bounds.valueOf(-1, -2, -3, -4))).toBeTruthy();
// });
//
// it("invert", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//
//   a.invert();
//
//   expect(a.eqBounds(Bounds.valueOf(1, 2, -3, -4))).toBeTruthy();
// });
//
// it("invertPosition", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//
//   a.invertPosition();
//
//   expect(a.eqBounds(Bounds.valueOf(-1, -2, 3, 4))).toBeTruthy();
// });
//
// it("swapBounds", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//
//   a.swapBounds();
//
//   expect(a.eqBounds(Bounds.valueOf(2, 1, 4, 3))).toBeTruthy();
// });
//
// it("swap", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//
//   a.swap();
//
//   expect(a.eqBounds(Bounds.valueOf(1, 2, 4, 3))).toBeTruthy();
// });
//
// it("swapPosition", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//
//   a.swapPosition();
//
//   expect(a.eqBounds(Bounds.valueOf(2, 1, 3, 4))).toBeTruthy();
// });
//
// it("cloneBounds", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = a.cloneBounds();
//
//   a.setBounds(Bounds.valueOf(5, 6, 7, 8));
//
//   expect(a.eqBounds(Bounds.valueOf(5, 6, 7, 8))).toBeTruthy();
//   expect(b.eqBounds(Bounds.valueOf(1, 2, 3, 4))).toBeTruthy();
// });
//
// it("invertW", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//
//   a.invertW();
//
//   expect(a.eqBounds(Bounds.valueOf(-1, 2, 3, 4))).toBeTruthy();
// });
//
// it("invertH", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//
//   a.invertH();
//
//   expect(a.eqBounds(Bounds.valueOf(1, -2, 3, 4))).toBeTruthy();
// });
//
// it("invertW", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//
//   a.invertW();
//
//   expect(a.eqBounds(Bounds.valueOf(1, 2, -3, 4))).toBeTruthy();
// });
//
// it("invertH", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//
//   a.invertH();
//
//   expect(a.eqBounds(Bounds.valueOf(1, 2, 3, -4))).toBeTruthy();
// });
//
// it("ceilBounds", () => {
//   const a = Bounds.objectOf(1.5, 2.5, 3.5, 4.5);
//
//   a.ceilBounds();
//
//   expect(a.eqBounds(Bounds.valueOf(2, 3, 4, 5))).toBeTruthy();
// });
//
// it("ceil", () => {
//   const a = Bounds.objectOf(1.5, 2.5, 3.5, 4.5);
//
//   a.ceil();
//
//   expect(a.eqBounds(Bounds.valueOf(1.5, 2.5, 4, 5))).toBeTruthy();
// });
//
// it("ceilPosition", () => {
//   const a = Bounds.objectOf(1.5, 2.5, 3.5, 4.5);
//
//   a.ceilPosition();
//
//   expect(a.eqBounds(Bounds.valueOf(2, 3, 3.5, 4.5))).toBeTruthy();
// });
//
// it("roundBounds", () => {
//   const a = Bounds.objectOf(1.6, 2.4, 3.6, 4.4);
//
//   a.roundBounds();
//
//   expect(a.eqBounds(Bounds.valueOf(2, 2, 4, 4))).toBeTruthy();
// });
//
// it("round", () => {
//   const a = Bounds.objectOf(1.6, 2.4, 3.6, 4.4);
//
//   a.round();
//
//   expect(a.eqBounds(Bounds.valueOf(1.6, 2.4, 4, 4))).toBeTruthy();
// });
//
// it("roundPosition", () => {
//   const a = Bounds.objectOf(1.6, 2.4, 3.6, 4.4);
//
//   a.roundPosition();
//
//   expect(a.eqBounds(Bounds.valueOf(2, 2, 3.6, 4.4))).toBeTruthy();
// });
//
// it("floorBounds", () => {
//   const a = Bounds.objectOf(1.5, 2.5, 3.5, 4.5);
//
//   a.floorBounds();
//
//   expect(a.eqBounds(Bounds.valueOf(1, 2, 3, 4))).toBeTruthy();
// });
//
// it("floor", () => {
//   const a = Bounds.objectOf(1.5, 2.5, 3.5, 4.5);
//
//   a.floor();
//
//   expect(a.eqBounds(Bounds.valueOf(1.5, 2.5, 3, 4))).toBeTruthy();
// });
//
// it("floorPosition", () => {
//   const a = Bounds.objectOf(1.5, 2.5, 3.5, 4.5);
//
//   a.floorPosition();
//
//   expect(a.eqBounds(Bounds.valueOf(1, 2, 3.5, 4.5))).toBeTruthy();
// });
//
// it("lessThanBounds", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = Bounds.objectOf(5, 6, 7, 8);
//
//   expect(a.lessThanBounds(b)).toBeTruthy();
//   expect(b.lessThanBounds(a)).toBeFalsy();
//   expect(a.lessThanBounds(a, true)).toBeTruthy();
//   expect(b.lessThanBounds(a, true)).toBeFalsy();
// });
//
// it("lessThan", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = Size.objectOf(5, 6);
//
//   expect(a.lessThan(b)).toBeTruthy();
//   expect(b.lessThan(a)).toBeFalsy();
//   expect(a.lessThan(a, true)).toBeTruthy();
//   expect(b.lessThan(a, true)).toBeFalsy();
// });
//
// it("lessThanPosition", () => {
//   const a = Bounds.objectOf(1, 2, 3, 4);
//   const b = Point.objectOf(5, 6);
//
//   expect(a.lessThanPosition(b)).toBeTruthy();
//   expect(b.lessThan(a)).toBeFalsy();
//   expect(a.lessThanPosition(a, true)).toBeTruthy();
//   expect(b.lessThan(a, true)).toBeFalsy();
// });
