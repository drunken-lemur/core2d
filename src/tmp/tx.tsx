import * as React from "react";

export const check = (n: number): boolean => {
  const digits = String(n).split("");
  const sumDigits = digits.reduce((sum, digit) => sum + Number(digit), 0);

  return !(n % sumDigits);
};

export const checkFrom = (from: number, num: number): number[] => {
  let point = from;
  const result: number[] = [];

  while (result.length < num) {
    if (check(point)) {
      result.push(point);
      point++;
    }
  }

  return result;
};

const decorate = <T extends {}>(
  component: React.ComponentType<T>
): React.ComponentType<T> => {
  return component;
};

export interface IProps {
  id: number;
  name: string;
}

const unknownComponent: React.FC<IProps> = props => <div />;

const Component = decorate(unknownComponent);

const rendered = <Component id={0} name="" />;
