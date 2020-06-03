import { IUpdated } from "./updated";
import { IVisible } from "./visiable";
import { IDrawable } from "./drawable";
import { IComposite } from "./composite";
import { IToggleable } from "./toggleable";
import { IBrush, IBrushStyle } from "./brush";
import { IBounds, Bounds, IBoundsData } from "./bounds";
import { IView, BaseView, IWithView, IStylable } from "./view";
import { IBehavior, BaseBehavior, IWithBehavior } from "./behavior";

export interface IEntity
  extends IBounds,
    IVisible,
    IDrawable,
    IWithView,
    IUpdated,
    IToggleable,
    IWithBehavior,
    IStylable,
    IComposite<IEntity> {}

export class Entity extends Bounds implements IEntity {
  parent?: IEntity;

  private isEnabledState = true;
  private isVisibleState = true;
  protected readonly children: Set<IEntity>;
  protected view: IView = new BaseView(this);
  protected behavior: IBehavior = new BaseBehavior(this);

  get length() {
    return this.children.size;
  }

  get values() {
    return Array.from(this.children);
  }

  get style() {
    return this.view.style;
  }

  set style(style: IBrushStyle) {
    this.view.style = style;
  }

  constructor(bounds?: IBoundsData) {
    super(bounds);

    this.children = new Set();
  }

  toggle = () => {
    this.isEnabledState = !this.isEnabledState;

    return this;
  };

  enable = () => {
    this.isEnabledState = true;

    return this;
  };

  disable = () => {
    this.isEnabledState = false;

    return this;
  };

  isEnabled = () => this.isEnabledState;

  isDisabled = () => !this.isEnabledState;

  update(deltaTime: number) {
    if (this.isEnabledState) {
      this.behavior.update(deltaTime);
    }

    return this;
  }

  toggleView = () => {
    this.isVisibleState = !this.isVisibleState;

    return this;
  };

  show = () => {
    this.isVisibleState = true;

    return this;
  };

  hide = () => {
    this.isVisibleState = false;

    return this;
  };

  isVisible = () => this.isVisibleState;

  isHidden = () => !this.isVisibleState;

  draw(brush: IBrush, deltaTime: number) {
    if (this.isVisibleState) {
      brush.save();

      brush.setStyle(this.style);
      this.view.draw(brush, deltaTime);

      brush.restore();
    }

    return this;
  }

  add = (...sceneObjects: IEntity[]) => {
    sceneObjects.forEach(sceneObject => {
      sceneObject.parent = this;

      this.children.add(sceneObject);
    });

    return this;
  };

  clear = () => {
    this.children.forEach(sceneObject => (sceneObject.parent = undefined));
    this.children.clear();

    return this;
  };

  delete = (...sceneObjects: IEntity[]) => {
    sceneObjects.forEach(sceneObject => {
      sceneObject.parent = undefined;

      this.children.delete(sceneObject);
    });

    return this;
  };

  remove = () => {
    if (this.parent) {
      this.parent.delete(this);
    }

    return this;
  };

  forEach = (
    callback: (value: IEntity, value2: IEntity, set: Set<IEntity>) => void,
    thisArg?: any
  ) => {
    this.children.forEach(callback, thisArg);

    return this;
  };

  has = (...sceneObjects: IEntity[]) => {
    for (const i in sceneObjects) {
      if (!this.children.has(sceneObjects[i])) {
        return false;
      }
    }

    return true;
  };

  setView = (view: IView) => {
    this.view = view;

    return this;
  };

  setBehavior = (behavior: IBehavior) => {
    this.behavior = behavior;

    return this;
  };

  setStyle = (style: IBrushStyle) => {
    this.view.setStyle(style);

    return this;
  };
}
