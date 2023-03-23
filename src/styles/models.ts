export interface IGlobalStylesThemeProps {
  darkModeEnabled?: boolean;
}

export type TThemeObject = {
  [key: string]: string | number | (string | number)[];
};

export type TPropsWithTheme<T = {}> = T & { theme: App.Theme };
