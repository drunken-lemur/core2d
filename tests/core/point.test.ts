import { Point } from "../../src/core";

it("valueOf", () => {
  const a = Point.valueOf();
  const b = Point.valueOf(1);
  const c = Point.valueOf(2, 3);
  const d = Point.valueOf({ x: 4, y: 5 });
  const e = Point.valueOf(b);

  expect(a).toMatchObject({ x: 0, y: 0 });
  expect(b).toMatchObject({ x: 1, y: 0 });
  expect(c).toMatchObject({ x: 2, y: 3 });
  expect(d).toMatchObject({ x: 4, y: 5 });
  expect(e).toMatchObject({ x: 1, y: 0 });
});

it("get", () => {
  const a = new Point({ x: 1, y: 2 });

  expect(a.get()).toMatchObject({ x: 1, y: 2 });
});

it("objectOf", () => {
  const a = Point.objectOf();
  const b = Point.objectOf(1);
  const c = Point.objectOf(2, 3);
  const d = Point.objectOf({ x: 4, y: 5 });
  const e = Point.objectOf(b);

  expect(a.get()).toMatchObject({ x: 0, y: 0 });
  expect(b.get()).toMatchObject({ x: 1, y: 0 });
  expect(c.get()).toMatchObject({ x: 2, y: 3 });
  expect(d.get()).toMatchObject({ x: 4, y: 5 });
  expect(e.get()).toMatchObject({ x: 1, y: 0 });
});

it("eq", () => {
  const a = Point.objectOf(1, 2);
  const b = Point.objectOf(1, 2);

  expect(a.eq(b)).toBeTruthy();
});

it("set", () => {
  const a = new Point();

  a.set(Point.valueOf(1, 2));

  expect(a.eq(Point.valueOf(1, 2))).toBeTruthy();
});

it("plus", () => {
  const a = Point.objectOf(1, 2);
  const b = Point.valueOf(3, 4);

  a.plus(b);

  expect(a.eq(Point.valueOf(4, 6))).toBeTruthy();
});

it("minus", () => {
  const a = Point.objectOf(1, 2);
  const b = Point.valueOf(3, 4);

  a.minus(b);

  expect(a.eq(Point.valueOf(-2, -2))).toBeTruthy();
});

it("multiply", () => {
  const a = Point.objectOf(1, 2);
  const b = Point.valueOf(3, 4);

  a.multiply(b);

  expect(a.eq(Point.valueOf(3, 8))).toBeTruthy();
});

it("divide", () => {
  const a = Point.objectOf(1, 2);
  const b = Point.valueOf(2, 4);

  a.divide(b);

  expect(a.eq(Point.valueOf(0.5, 0.5))).toBeTruthy();
});

it("invert", () => {
  const a = Point.objectOf(1, 2);

  a.invert();

  expect(a.eq(Point.valueOf(-1, -2))).toBeTruthy();
});

it("swap", () => {
  const a = Point.objectOf(1, 2);

  a.swap();

  expect(a.eq(Point.valueOf(2, 1))).toBeTruthy();
});

it("clone", () => {
  const a = Point.objectOf(1, 2);
  const b = a.clone();

  a.set(Point.valueOf(5, 5));

  expect(a.eq(Point.valueOf(5, 5))).toBeTruthy();
  expect(b.eq(Point.valueOf(1, 2))).toBeTruthy();
});

it("invertX", () => {
  const a = Point.objectOf(1, 2);

  a.invertX();

  expect(a.eq(Point.valueOf(-1, 2))).toBeTruthy();
});

it("invertY", () => {
  const a = Point.objectOf(1, 2);

  a.invertY();

  expect(a.eq(Point.valueOf(1, -2))).toBeTruthy();
});

it("ceil", () => {
  const a = Point.objectOf(1.5, 2.5);

  a.ceil();

  expect(a.eq(Point.valueOf(2, 3))).toBeTruthy();
});

it("round", () => {
  const a = Point.objectOf(1.6, 2.4);

  a.round();

  expect(a.eq(Point.valueOf(2, 2))).toBeTruthy();
});

it("floor", () => {
  const a = Point.objectOf(1.5, 2.5);

  a.floor();

  expect(a.eq(Point.valueOf(1, 2))).toBeTruthy();
});

it("lessThan", () => {
  const a = Point.objectOf(1, 2);
  const b = Point.objectOf(3, 4);

  expect(a.lessThan(b)).toBeTruthy();
  expect(b.lessThan(a)).toBeFalsy();
  expect(a.lessThan(a, true)).toBeTruthy();
  expect(b.lessThan(a, true)).toBeFalsy();
});

it("min", () => {
  const a = Point.objectOf(1, 2);
  const b = Point.valueOf(3, 4);

  a.min(b);

  expect(a.eq(Point.valueOf(1, 2))).toBeTruthy();
});

it("max", () => {
  const a = Point.objectOf(1, 2);
  const b = Point.valueOf(3, 4);

  a.max(b);

  expect(a.eq(Point.valueOf(3, 4))).toBeTruthy();
});
