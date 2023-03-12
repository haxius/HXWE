import { IGlobalStylesThemeProps, TThemeObject } from "../models";
import { num2Unit } from "../utils";

const commonSpacing: TThemeObject = {
  fives: [10, 15, 20, 25, 35, 50, 75, 100, 150],
};

const Spacing = (props: IGlobalStylesThemeProps): TThemeObject => ({
  margin: num2Unit([3, 5, ...(commonSpacing.fives as number[])], "px"),
  padding: num2Unit([3, 5, ...(commonSpacing.fives as number[])], "px"),
  border: num2Unit([1, 2, 3, 4], "px"),
});

export default Spacing;
