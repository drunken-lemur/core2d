export interface IWithParent<T> {
  parent?: T;
}

export interface IWithChildren<T> {
  length: number;
  values: Array<T>;
  add: (...sceneObjects: T[]) => this;
  clear: () => this;
  delete: (...sceneObjects: T[]) => this;
  forEach: <P extends {} = {}>(
    callback: (value: T & P, value2: T & P, set: Set<T & P>) => void,
    thisArg?: any
  ) => this;
  has: (...sceneObjects: T[]) => boolean;
}

export interface IRemoved {
  remove: () => this;
}

export interface IComposite<T>
  extends IWithParent<T>,
    IWithChildren<T>,
    IRemoved {}
