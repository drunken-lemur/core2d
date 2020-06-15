import { IGame } from "./game";
import { IView, sceneView } from "./view";
import { Entity, IEntity } from "./entity";
import { IBehavior, sceneBehavior } from "./behavior";

export interface IScene extends IEntity {
  game: IGame;
}

export class BaseScene extends Entity implements IScene {
  game: IGame;

  views: IView<IEntity | any>[] = [sceneView];
  behaviors: IBehavior<IEntity | any>[] = [sceneBehavior];

  constructor(game: IGame) {
    super();

    this.game = game;

    this.setSize(game.screen);
  }
}
