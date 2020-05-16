import { IGame } from "./game";
import { IDrawer } from "./drawer";
import { ISizeData } from "./size";
import { IEntity, Entity } from "./entity";

export interface IScene extends IEntity {
  game: IGame;
}

export class Scene extends Entity implements IEntity {
  game: IGame;

  constructor(game: IGame, size?: ISizeData) {
    super();

    this.game = game;

    if (size) {
      this.setSize(size);
    }
  }

  draw(drawer: IDrawer, deltaTime: number) {
    this.game.screen.fill();

    super.draw(drawer, deltaTime);

    return this;
  }
}
