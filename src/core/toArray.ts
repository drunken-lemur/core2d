export interface IWithToArray<T extends any = any> {
  toArray: () => T[];
}
