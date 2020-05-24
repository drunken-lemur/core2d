export const randomEnum = <T>(anEnum: T): T[keyof T] => {
  const values = (Object.values(anEnum) as unknown) as T[keyof T][];

  return values[Math.floor(Math.random() * values.length)];
};
