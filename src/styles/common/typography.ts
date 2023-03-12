import { IGlobalStylesThemeProps, TThemeObject } from "../models";
import { num2Unit } from "../utils";

const commonType: TThemeObject = {
  size: [8, 11, 12, 14, 16, 18, 22, 24, 36, 48, 64],
};

const Typography = (props: IGlobalStylesThemeProps): TThemeObject => ({
  fontSize: num2Unit(commonType.size as number[], "px"),
  h1: num2Unit((commonType.size as number[])[8], "px"),
  h2: num2Unit((commonType.size as number[])[7], "px"),
  h3: num2Unit((commonType.size as number[])[6], "px"),
  h4: num2Unit((commonType.size as number[])[5], "px"),
  strong: num2Unit((commonType.size as number[])[4], "px"),
  body: num2Unit((commonType.size as number[])[3], "px"),
  small: num2Unit((commonType.size as number[])[2], "px"),
  tiny: num2Unit((commonType.size as number[])[1], "px"),
  disclaimer: num2Unit((commonType.size as number[])[0], "px"),
});

export default Typography;
