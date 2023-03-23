import { IGlobalStylesThemeProps, TThemeObject } from "../models";

const commonColors: TThemeObject = {
  almostWhite: "#EFEFEF",
  almostBlack: "#1A1A1A",
};

const Colors = (props: IGlobalStylesThemeProps): TThemeObject => ({
  ...commonColors,
  primary: props.darkModeEnabled
    ? commonColors.almostWhite
    : commonColors.almostBlack,
  background: props.darkModeEnabled
    ? commonColors.almostBlack
    : commonColors.almostWhite,
});

export default Colors;
