import { Color } from "./color";
import { ISizeData } from "./size";
import { IUpdated } from "./updated";
import { IPointData } from "./point";
import { IVisible } from "./visiable";
import { IDrawable } from "./drawable";
import { IComposite } from "./composite";
import { IToggleable } from "./toggleable";
import { IBrush, IBrushStyle } from "./brush";
import { Bounds, IBounds, IBoundsData } from "./bounds";
import { defaultView, IStylable, IView, IWithView } from "./view";
import { defaultBehavior, IBehavior, IWithBehavior } from "./behavior";

export interface IInitialized {
  isInitialized: boolean;

  initialize(): this;
}

export interface IEntity
  extends IInitialized,
    IBounds,
    IVisible,
    IDrawable,
    IWithView,
    IUpdated,
    IToggleable,
    IWithBehavior,
    IStylable,
    IComposite<IEntity> {}

export class Entity extends Bounds implements IEntity {
  private static DefaultStyle: IBrushStyle = {
    fillStyle: Color.None,
    strokeStyle: Color.None
  };
  parent?: IEntity;
  views: IView<IEntity | this | any>[] = [defaultView];
  behaviors: IBehavior<IEntity | this | any>[] = [defaultBehavior];
  isInitialized = false;
  protected readonly children: Set<IEntity> = new Set();
  private isEnabledState = true;
  private isVisibleState = true;

  constructor(bounds?: IPointData | ISizeData | IBoundsData) {
    super();

    if (bounds) {
      const { x, y, w, h } = bounds as IBounds;

      if (x || y) this.setPosition(x, y);

      if (w || h) this.setSize(w, h);
    }

    this.setStyle(Entity.DefaultStyle);
  }

  private _style: IBrushStyle = {};

  get style() {
    return this._style;
  }

  set style(style: IBrushStyle) {
    this._style = { ...this._style, ...style };
  }

  get length() {
    return this.children.size;
  }

  get values() {
    return Array.from(this.children);
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
      this.behaviors.forEach(behavior => {
        if (typeof behavior === "function") {
          behavior(this, deltaTime);
        } else {
          behavior.update(deltaTime);
        }
      });
    }
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

      brush.setStyle(this.style); // todo: ? move to BaseView or StyledView

      this.views.forEach(view => {
        this.drawView(view, brush, deltaTime);
      });

      brush.restore();
    }
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

  forEach = <P extends {} = {}>(
    callback: (
      value: IEntity & P,
      value2: IEntity & P,
      set: Set<IEntity & P>
    ) => void,
    thisArg?: any
  ) => {
    this.children.forEach(callback as any, thisArg);

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

  setViews = (...views: IView<IEntity | this | any>[]) => {
    this.views = views;

    return this;
  };

  addViews = (...views: IView<IEntity | this | any>[]) => {
    views.forEach(view => this.views.push(view));

    return this;
  };

  removeViews = (...views: IView<IEntity | this | any>[]) => {
    views.forEach(view => {
      const index = this.views.indexOf(view);
      if (index > -1) {
        this.views.splice(index, 1);
      }
    });

    return this;
  };

  clearViews = () => {
    this.views = [];

    return this;
  };

  setBehaviors = (...behaviors: IBehavior<IEntity | this | any>[]) => {
    this.behaviors = behaviors;

    return this;
  };

  addBehaviors = (...behaviors: IBehavior<IEntity | this | any>[]) => {
    behaviors.forEach(behavior => this.behaviors.push(behavior));

    return this;
  };

  removeBehaviors = (...behaviors: IBehavior<IEntity | this | any>[]) => {
    behaviors.forEach(behavior => {
      const index = this.behaviors.indexOf(behavior);
      if (index > -1) {
        this.behaviors.splice(index, 1);
      }
    });

    return this;
  };

  clearBehaviors = () => {
    this.behaviors = [];

    return this;
  };

  setStyle = (style: IBrushStyle) => {
    this._style = { ...this._style, ...style };

    return this;
  };

  initialize() {
    this.isInitialized = true;

    return this;
  }

  private drawView = (view: IView<IEntity | this | any>, brush: IBrush, deltaTime: number) => {
    if (typeof view === "function") {
      view(this, brush, deltaTime);
    } else {
      brush.setStyle(view.style);

      view.draw(brush, deltaTime);
    }
  };

  // removeStyle = (...rules: (keyof IBrushStyle)[]) => {
  //   rules.forEach(rule => delete this._style[rule]);
  //
  //   return this;
  // };
}
