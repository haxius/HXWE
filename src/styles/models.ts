export interface IGlobalStylesThemeProps {
  darkModeEnabled?: boolean;
}

export type TThemeObject = {
  [key: string]: string | number | (string | number)[];
};
