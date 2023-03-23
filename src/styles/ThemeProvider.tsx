import { Global, ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import React from "react";
import Colors from "./common/colors";
import GlobalStyles from "./common/global";
import Spacing from "./common/spacing";
import Typography from "./common/typography";
import { IGlobalStylesThemeProps } from "./models";

interface IThemeProps extends IGlobalStylesThemeProps {
  children: React.ReactElement;
}

const ThemeProvider: React.FC<IThemeProps> = ({ children, ...props }) => (
  <>
    <Global styles={GlobalStyles(props)} />
    <EmotionThemeProvider
      theme={
        {
          Colors: Colors(props),
          Spacing: Spacing(props),
          Typography: Typography(props),
        } as App.Theme
      }
    >
      {children}
    </EmotionThemeProvider>
  </>
);

export default ThemeProvider;
