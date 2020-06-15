import { BaseBehavior, Color, Entity, Point, rectView } from "core";
import { Score } from "lib/score";

export class BorderBouncingBehavior extends BaseBehavior<Square> {
  private speed = new Point(1);
  private deltaSpeed = new Point(1);


  constructor(parent: Square) {
    super(parent);

    this.onBorder();
  }

  update = (dt: number) => {
    const corners = this.parent.getCorners();
    const sceneCorners = this.parent.parent?.getCorners();

    if (sceneCorners) {
      if (corners.TOP_LEFT.x < sceneCorners.TOP_LEFT.x) {
        this.deltaSpeed.x = 1;
        this.onBorder();
      }

      if (corners.TOP_RIGHT.x > sceneCorners.TOP_RIGHT.x) {
        this.deltaSpeed.x = -1;
        this.onBorder();
      }

      if (corners.TOP_LEFT.y < sceneCorners.TOP_LEFT.y) {
        this.deltaSpeed.y = 1;
        this.onBorder();
      }

      if (corners.BOTTOM_RIGHT.y > sceneCorners.BOTTOM_RIGHT.y) {
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
  views = [rectView];
  behaviors = [new BorderBouncingBehavior(this)];
}
