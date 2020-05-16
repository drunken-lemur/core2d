import {
  Color,
  Point,
  Entity,
  IDrawer,
  BaseView,
  ISizeData,
  randomColor,
  BaseBehavior
} from "core";

class View extends BaseView<Square> {
  draw = (drawer?: IDrawer, deltaTime?: number) => {
    if (this.parent && drawer) {
      const { x, y, w, h } = this.parent.getBounds();

      drawer.fillStyle = this.parent.color;

      drawer.fillRect(x, y, w, h);
    }

    return this;
  };
}

class Behavior extends BaseBehavior<Square> {
  private speed = Point.objectOf(1, 1);
  private deltaSpeed = Point.objectOf(1, 1);

  constructor(parent: Square) {
    super(parent);

    this.changeColor();
  }

  update = (deltaTime?: number) => {
    if (this.parent) {
      const corners = this.parent.getCorners();
      const sceneCorners = this.parent.parent?.getCorners();

      if (sceneCorners) {
        if (corners.TOP_LEFT.x < sceneCorners.TOP_LEFT.x) {
          this.deltaSpeed.x = 1;
          this.changeColor();
        }

        if (corners.TOP_RIGHT.x > sceneCorners.TOP_RIGHT.x) {
          this.deltaSpeed.x = -1;
          this.changeColor();
        }

        if (corners.TOP_LEFT.y < sceneCorners.TOP_LEFT.y) {
          this.deltaSpeed.y = 1;
          this.changeColor();
        }

        if (corners.BOTTOM_RIGHT.y > sceneCorners.BOTTOM_RIGHT.y) {
          this.deltaSpeed.y = -1;
          this.changeColor();
        }
      }

      this.parent.plusPosition(this.speed.clone().multiply(this.deltaSpeed));
    }

    return this;
  };

  changeColor = () => {
    this.parent.color = randomColor();
  };
}

export class Square extends Entity {
  color: Color | string = Color.Black;

  constructor(size: ISizeData, color?: Color) {
    super();

    this.setSize(size);
    this.setView(new View(this));
    this.setBehavior(new Behavior(this));

    if (color) {
      this.color = color;
    }
  }
}
