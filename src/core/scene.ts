import { IGame } from "./game";
import { IDrawer } from "./drawer";
import { IEntity, Entity } from "./entity";
import { BaseView } from "core/view";

export interface IScene extends IEntity {
  game: IGame;
}

export class BaseScene extends Entity implements IScene {
  static View = class extends BaseView<BaseScene> {
    draw(drawer: IDrawer, deltaTime: number) {
      const { x, y, w, h } = this.parent;

      drawer.fillRect(x, y, w, h);

      return this;
    }
  };

  game: IGame;

  constructor(game: IGame) {
    super();

    this.game = game;
    this.setSize(game.screen).setView(new BaseScene.View(this));
  }
}
