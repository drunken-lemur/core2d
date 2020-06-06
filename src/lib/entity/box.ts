import { Entity, IView, rectView } from "core";

export class Box extends Entity {
  views: IView[] = [rectView];
}
