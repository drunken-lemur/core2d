export abstract class Score {
  private static value = 0;

  static add = (value: number) => {
    Score.value += value;

    return Score;
  };

  static reset = () => {
    Score.value = 0;

    return Score;
  };

  static get = () => Score.value;
}
