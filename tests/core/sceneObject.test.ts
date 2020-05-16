// @ts-ignore
it("", () => void 0);
// import { Entity, BaseView, BaseBehavior, Size } from "core";
//
// class TestBaseView extends BaseView {
//   draws = 0;
//
//   draw = () => {
//     this.draws++;
//
//     return this;
//   };
// }
//
// class TestBaseBehavior extends BaseBehavior {
//   updates = 0;
//
//   update = () => {
//     this.updates++;
//
//     return this;
//   };
// }
//
// it("isEnabled", () => {
//   const a = new Entity();
//
//   expect(a.isEnabled()).toBeTruthy();
// });
//
// it("isDisabled", () => {
//   const a = new Entity();
//
//   expect(a.isDisabled()).toBeFalsy();
// });
//
// it("enable", () => {
//   const view = new TestBaseView();
//   const behavior = new TestBaseBehavior();
//   const object = new Entity(view, behavior);
//
//   object.disable();
//
//   expect(object.isDisabled()).toBeTruthy();
//
//   object.update();
//
//   expect(behavior.updates).toBe(0);
//
//   object.enable();
//
//   expect(object.isDisabled()).toBeFalsy();
//
//   object.update();
//
//   expect(behavior.updates).toBe(1);
// });
//
// it("disable", () => {
//   const view = new TestBaseView();
//   const behavior = new TestBaseBehavior();
//   const object = new Entity(view, behavior);
//
//   object.disable();
//
//   expect(object.isDisabled()).toBeTruthy();
//
//   object.enable();
//
//   expect(object.isDisabled()).toBeFalsy();
//
//   object.disable();
//
//   expect(object.isDisabled()).toBeTruthy();
//
//   object.update();
//
//   expect(behavior.updates).toBe(0);
// });
//
// it("isVisible", () => {
//   const a = new Entity();
//
//   expect(a.isVisible()).toBeTruthy();
// });
//
// it("isHidden", () => {
//   const a = new Entity();
//
//   a.hide();
//
//   expect(a.isHidden()).toBeTruthy();
// });
//
// it("show", () => {
//   const view = new TestBaseView();
//   const behavior = new TestBaseBehavior();
//   const object = new Entity(view, behavior);
//
//   object.hide();
//
//   expect(object.isHidden()).toBeTruthy();
//
//   object.draw(void 0);
//
//   expect(view.draws).toBe(0);
//
//   object.show();
//
//   expect(object.isHidden()).toBeFalsy();
//
//   object.draw(void 0);
//
//   expect(view.draws).toBe(1);
// });
//
// it("hide", () => {
//   const view = new TestBaseView();
//   const behavior = new TestBaseBehavior();
//   const object = new Entity(view, behavior);
//
//   expect(object.isHidden()).toBeFalsy();
//
//   object.hide();
//
//   expect(object.isHidden()).toBeTruthy();
//
//   object.draw(void 0);
//
//   expect(view.draws).toBe(0);
// });
//
// it("toggle", () => {
//   const object = new Entity();
//
//   expect(object.isDisabled()).toBeFalsy();
//
//   object.toggle();
//
//   expect(object.isDisabled()).toBeTruthy();
//
//   object.toggle();
//
//   expect(object.isDisabled()).toBeFalsy();
// });
//
// it("toggleBaseView", () => {
//   const object = new Entity();
//
//   expect(object.isVisible()).toBeTruthy();
//
//   object.toggleBaseView();
//
//   expect(object.isVisible()).toBeFalsy();
//
//   object.toggleBaseView();
//
//   expect(object.isVisible()).toBeTruthy();
// });
//
// it("has", () => {
//   const parent = new Entity();
//   const children = new Entity();
//
//   expect(parent.has(children)).toBeFalsy();
//
//   parent.add(children);
//
//   expect(parent.has(children)).toBeTruthy();
// });
//
// it("add", () => {
//   const parent = new Entity();
//   const children = new Entity();
//
//   expect(parent.length).toBe(0);
//
//   parent.add(children);
//
//   expect(parent.length).toBe(1);
// });
//
// it("length", () => {
//   const object = new Entity();
//
//   expect(object.length).toBe(0);
//
//   object.add(new Entity());
//
//   expect(object.length).toBe(1);
// });
//
// it("clear", () => {
//   const parent = new Entity();
//   const children = new Entity();
//
//   expect(parent.has(children)).toBeFalsy();
//
//   parent.add(children);
//
//   expect(parent.has(children)).toBeTruthy();
//
//   expect(parent.length).toBe(1);
//
//   parent.clear();
//
//   expect(parent.length).toBe(1);
// });
//
// it("delete", () => {
//   const parent = new Entity();
//   const children = new Entity();
//
//   expect(parent.has(children)).toBeFalsy();
//
//   parent.add(children);
//
//   expect(parent.has(children)).toBeTruthy();
//
//   parent.delete(children);
//
//   expect(parent.has(children)).toBeFalsy();
// });
//
// it("forEach", () => {});
//
// it("toArray", () => {
//   const parent = new Entity();
//   const children = new Entity();
//
//   expect(parent.has(children)).toBeFalsy();
//
//   parent.add(children);
//
//   expect(parent.has(children)).toBeTruthy();
//
//   expect(parent.toArray().includes(children)).toBeTruthy();
// });
//
// it("update", () => {
//   const view = new TestBaseView();
//   const behavior = new TestBaseBehavior();
//   const a = new Entity(view, behavior);
//   const b = new Entity(view, behavior);
//   const c = new Entity(view, behavior);
//   const group = new Entity();
//
//   group
//     .add(a)
//     .add(b)
//     .add(c)
//     .update()
//     .update();
//
//   expect(behavior.updates).toBe(6);
// });
//
// it("draw", () => {
//   const view = new TestBaseView();
//   const behavior = new TestBaseBehavior();
//   const a = new Entity(view, behavior);
//   const b = new Entity(view, behavior);
//   const c = new Entity(view, behavior);
//   const group = new Entity();
//
//   group
//     .add(a)
//     .add(b)
//     .add(c)
//     .draw()
//     .draw()
//     .draw();
//
//   expect(view.draws).toBe(9);
// });
//
// it("remove", () => {
//   const view = new TestBaseView();
//   const behavior = new TestBaseBehavior();
//   const a = new Entity(view, behavior);
//   const b = new Entity(view, behavior);
//   const c = new Entity(view, behavior);
//   const group = new Entity();
//
//   a.setSize(Size.valueOf(1, 2));
//   b.setSize(Size.valueOf(3, 4));
//   c.setSize(Size.valueOf(5, 6));
//
//   group
//     .add(a)
//     .add(b)
//     .add(c)
//     .update();
//
//   group.update();
//
//   b.remove();
//
//   group.update();
//
//   expect(behavior.updates).toBe(8);
// });
