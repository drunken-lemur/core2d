export interface IApp {
  run: (...args: any[]) => void;
}

export abstract class BaseApp implements IApp {
  abstract run: (...args: any[]) => void;
}
