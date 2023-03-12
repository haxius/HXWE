export const num2Unit = (
  num: number | number[],
  unit: string
): string | string[] =>
  num instanceof Array ? num.map((num) => `${num}${unit}`) : `${num}${unit}`;
