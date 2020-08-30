import {
  BaseBehavior,
  Color,
  Entity,
  IBehavior,
  IView,
  Point,
  Position,
  rectView
} from "core";
import { Score } from "lib/score";

export class BorderBouncingBehavior<
  T extends Entity = Entity
> extends BaseBehavior<T> {
  private speed = new Point(1);
  private deltaSpeed = new Point(1);

  constructor(parent: T) {
    super(parent);

    this.onBorder();
  }

  update = (dt: number) => {
    const corners = this.parent.getCorners();
    const sceneCorners = this.parent.parent?.getCorners();

    if (sceneCorners) {
      if (corners[Position.TopLeft].x < sceneCorners[Position.TopLeft].x) {
        this.deltaSpeed.x = 1;
        this.onBorder();
      }

      if (corners[Position.TopRight].x > sceneCorners[Position.TopRight].x) {
        this.deltaSpeed.x = -1;
        this.onBorder();
      }

      if (
        corners[Position.BottomLeft].y < sceneCorners[Position.BottomLeft].y
      ) {
        this.deltaSpeed.y = 1;
        this.onBorder();
      }

      if (
        corners[Position.BottomRight].y > sceneCorners[Position.BottomRight].y
      ) {
        this.deltaSpeed.y = -1;
        this.onBorder();
      }
    }

    this.parent.plusPosition(this.speed.clone().multiply(this.deltaSpeed));
  };

  private onBorder = () => {
    this.parent.style.fillStyle = Color.random();

    Score.add(100);
  };
}

export class Square extends Entity {
  views: IView<Square>[] = [rectView];
  behaviors: IBehavior<Square>[] = [new BorderBouncingBehavior(this)];
}
