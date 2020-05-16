import { Size } from "../../src/core";

it("valueOf", () => {
  const a = Size.valueOf();
  const b = Size.valueOf(1);
  const c = Size.valueOf(2, 3);
  const d = Size.valueOf({ w: 4, h: 5 });
  const e = Size.valueOf(b);

  expect(a).toMatchObject({ w: 0, h: 0 });
  expect(b).toMatchObject({ w: 1, h: 0 });
  expect(c).toMatchObject({ w: 2, h: 3 });
  expect(d).toMatchObject({ w: 4, h: 5 });
  expect(e).toMatchObject({ w: 1, h: 0 });
});

it("get", () => {
  const a = new Size({ w: 1, h: 2 });

  expect(a.get()).toMatchObject({ w: 1, h: 2 });
});

it("objectOf", () => {
  const a = Size.objectOf();
  const b = Size.objectOf(1);
  const c = Size.objectOf(2, 3);
  const d = Size.objectOf({ w: 4, h: 5 });
  const e = Size.objectOf(b);

  expect(a.get()).toMatchObject({ w: 0, h: 0 });
  expect(b.get()).toMatchObject({ w: 1, h: 0 });
  expect(c.get()).toMatchObject({ w: 2, h: 3 });
  expect(d.get()).toMatchObject({ w: 4, h: 5 });
  expect(e.get()).toMatchObject({ w: 1, h: 0 });
});

it("eq", () => {
  const a = Size.objectOf(1, 2);
  const b = Size.objectOf(1, 2);

  expect(a.eq(b)).toBeTruthy();
});

it("set", () => {
  const a = new Size();

  a.set(Size.valueOf(1, 2));

  expect(a.eq(Size.valueOf(1, 2))).toBeTruthy();
});

it("plus", () => {
  const a = Size.objectOf(1, 2);
  const b = Size.valueOf(3, 4);

  a.plus(b);

  expect(a.eq(Size.valueOf(4, 6))).toBeTruthy();
});

it("minus", () => {
  const a = Size.objectOf(1, 2);
  const b = Size.valueOf(3, 4);

  a.minus(b);

  expect(a.eq(Size.valueOf(-2, -2))).toBeTruthy();
});

it("multiply", () => {
  const a = Size.objectOf(1, 2);
  const b = Size.valueOf(3, 4);

  a.multiply(b);

  expect(a.eq(Size.valueOf(3, 8))).toBeTruthy();
});

it("divide", () => {
  const a = Size.objectOf(1, 2);
  const b = Size.valueOf(2, 4);

  a.divide(b);

  expect(a.eq(Size.valueOf(0.5, 0.5))).toBeTruthy();
});

it("invert", () => {
  const a = Size.objectOf(1, 2);

  a.invert();

  expect(a.eq(Size.valueOf(-1, -2))).toBeTruthy();
});

it("swap", () => {
  const a = Size.objectOf(1, 2);

  a.swap();

  expect(a.eq(Size.valueOf(2, 1))).toBeTruthy();
});

it("clone", () => {
  const a = Size.objectOf(1, 2);
  const b = a.clone();

  a.set(Size.valueOf(5, 5));

  expect(a.eq(Size.valueOf(5, 5))).toBeTruthy();
  expect(b.eq(Size.valueOf(1, 2))).toBeTruthy();
});

it("invertW", () => {
  const a = Size.objectOf(1, 2);

  a.invertW();

  expect(a.eq(Size.valueOf(-1, 2))).toBeTruthy();
});

it("invertH", () => {
  const a = Size.objectOf(1, 2);

  a.invertH();

  expect(a.eq(Size.valueOf(1, -2))).toBeTruthy();
});

it("ceil", () => {
  const a = Size.objectOf(1.5, 2.5);

  a.ceil();

  expect(a.eq(Size.valueOf(2, 3))).toBeTruthy();
});

it("round", () => {
  const a = Size.objectOf(1.6, 2.4);

  a.round();

  expect(a.eq(Size.valueOf(2, 2))).toBeTruthy();
});

it("floor", () => {
  const a = Size.objectOf(1.5, 2.5);

  a.floor();

  expect(a.eq(Size.valueOf(1, 2))).toBeTruthy();
});

it("lessThan", () => {
  const a = Size.objectOf(1, 2);
  const b = Size.objectOf(3, 4);

  expect(a.lessThan(b)).toBeTruthy();
  expect(b.lessThan(a)).toBeFalsy();
  expect(a.lessThan(a, true)).toBeTruthy();
  expect(b.lessThan(a, true)).toBeFalsy();
});
