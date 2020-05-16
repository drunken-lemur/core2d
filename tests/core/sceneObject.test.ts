import { SceneObject, View, Behavior, Size } from "../../src/core";

class TestView extends View {
  drawes = 0;

  draw = () => {
    this.drawes++;

    return this;
  };
}

class TestBehavior extends Behavior {
  updates = 0;

  update = () => {
    this.updates++;

    return this;
  };
}

it("isEnabled", () => {
  const a = new SceneObject();

  expect(a.isEnabled()).toBeTruthy();
});

it("isDisabled", () => {
  const a = new SceneObject();

  expect(a.isDisabled()).toBeFalsy();
});

it("enable", () => {
  const view = new TestView();
  const behavior = new TestBehavior();
  const object = new SceneObject(view, behavior);

  object.disable();

  expect(object.isDisabled()).toBeTruthy();

  object.update();

  expect(behavior.updates).toBe(0);

  object.enable();

  expect(object.isDisabled()).toBeFalsy();

  object.update();

  expect(behavior.updates).toBe(1);
});

it("disable", () => {
  const view = new TestView();
  const behavior = new TestBehavior();
  const object = new SceneObject(view, behavior);

  object.disable();

  expect(object.isDisabled()).toBeTruthy();

  object.enable();

  expect(object.isDisabled()).toBeFalsy();

  object.disable();

  expect(object.isDisabled()).toBeTruthy();

  object.update();

  expect(behavior.updates).toBe(0);
});

it("isVisible", () => {
  const a = new SceneObject();

  expect(a.isVisible()).toBeTruthy();
});

it("isHidden", () => {
  const a = new SceneObject();

  a.hide();

  expect(a.isHidden()).toBeTruthy();
});

it("show", () => {
  const view = new TestView();
  const behavior = new TestBehavior();
  const object = new SceneObject(view, behavior);

  object.hide();

  expect(object.isHidden()).toBeTruthy();

  object.draw(void 0);

  expect(view.drawes).toBe(0);

  object.show();

  expect(object.isHidden()).toBeFalsy();

  object.draw(void 0);

  expect(view.drawes).toBe(1);
});

it("hide", () => {
  const view = new TestView();
  const behavior = new TestBehavior();
  const object = new SceneObject(view, behavior);

  expect(object.isHidden()).toBeFalsy();

  object.hide();

  expect(object.isHidden()).toBeTruthy();

  object.draw(void 0);

  expect(view.drawes).toBe(0);
});

it("toggle", () => {
  const object = new SceneObject();

  expect(object.isDisabled()).toBeFalsy();

  object.toggle();

  expect(object.isDisabled()).toBeTruthy();

  object.toggle();

  expect(object.isDisabled()).toBeFalsy();
});

it("toggleView", () => {
  const object = new SceneObject();

  expect(object.isVisible()).toBeTruthy();

  object.toggleView();

  expect(object.isVisible()).toBeFalsy();

  object.toggleView();

  expect(object.isVisible()).toBeTruthy();
});

it("has", () => {
  const parent = new SceneObject();
  const children = new SceneObject();

  expect(parent.has(children)).toBeFalsy();

  parent.add(children);

  expect(parent.has(children)).toBeTruthy();
});

it("add", () => {
  const parent = new SceneObject();
  const children = new SceneObject();

  expect(parent.length).toBe(0);

  parent.add(children);

  expect(parent.length).toBe(1);
});

it("length", () => {
  const object = new SceneObject();

  expect(object.length).toBe(0);

  object.add(new SceneObject());

  expect(object.length).toBe(1);
});

it("clear", () => {
  const parent = new SceneObject();
  const children = new SceneObject();

  expect(parent.has(children)).toBeFalsy();

  parent.add(children);

  expect(parent.has(children)).toBeTruthy();

  expect(parent.length).toBe(1);

  parent.clear();

  expect(parent.length).toBe(1);
});

it("delete", () => {
  const parent = new SceneObject();
  const children = new SceneObject();

  expect(parent.has(children)).toBeFalsy();

  parent.add(children);

  expect(parent.has(children)).toBeTruthy();

  parent.delete(children);

  expect(parent.has(children)).toBeFalsy();
});

it("forEach", () => {});

it("toArray", () => {
  const parent = new SceneObject();
  const children = new SceneObject();

  expect(parent.has(children)).toBeFalsy();

  parent.add(children);

  expect(parent.has(children)).toBeTruthy();

  expect(parent.toArray().includes(children)).toBeTruthy();
});

it("update", () => {
  const view = new TestView();
  const behavior = new TestBehavior();
  const a = new SceneObject(view, behavior);
  const b = new SceneObject(view, behavior);
  const c = new SceneObject(view, behavior);
  const group = new SceneObject();

  group
    .add(a)
    .add(b)
    .add(c)
    .update()
    .update();

  expect(behavior.updates).toBe(6);
});

it("draw", () => {
  const view = new TestView();
  const behavior = new TestBehavior();
  const a = new SceneObject(view, behavior);
  const b = new SceneObject(view, behavior);
  const c = new SceneObject(view, behavior);
  const group = new SceneObject();

  group
    .add(a)
    .add(b)
    .add(c)
    .draw()
    .draw()
    .draw();

  expect(view.drawes).toBe(9);
});

it("remove", () => {
  const view = new TestView();
  const behavior = new TestBehavior();
  const a = new SceneObject(view, behavior);
  const b = new SceneObject(view, behavior);
  const c = new SceneObject(view, behavior);
  const group = new SceneObject();

  a.setSize(Size.valueOf(1, 2));
  b.setSize(Size.valueOf(3, 4));
  c.setSize(Size.valueOf(5, 6));

  group
    .add(a)
    .add(b)
    .add(c)
    .update();

  group.update();

  b.remove();

  group.update();

  expect(behavior.updates).toBe(8);
});
