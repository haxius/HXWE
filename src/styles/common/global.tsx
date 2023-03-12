import { css, SerializedStyles } from "@emotion/react";
import { IGlobalStylesThemeProps } from "../models";

const GlobalStyles = (props: IGlobalStylesThemeProps): SerializedStyles => css`
  body {
    box-sizing: border-box;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    background-color: ${props.darkModeEnabled ? "black" : "white"};
    color: ${props.darkModeEnabled ? "white" : "black"};
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New";
  }
`;

export default GlobalStyles;
