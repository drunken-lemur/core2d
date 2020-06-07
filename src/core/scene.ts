import { IGame } from "./game";
import { sceneView } from "./view";
import { sceneBehavior } from "./behavior";
import { Entity, IEntity } from "./entity";

export interface IScene extends IEntity {
  game: IGame;
}

export class BaseScene extends Entity implements IScene {
  game: IGame;

  views = [sceneView];
  behaviors = [sceneBehavior];

  constructor(game: IGame) {
    super();

    this.game = game;

    this.setSize(game.screen);
  }
}
