/// <reference types="react-scripts" />

declare module App {
  type Theme = {
    Colors: TThemeObject;
    Spacing: TThemeObject;
    Typography: TThemeObject;
  };
}

declare module "@emotion/styled" {
  import { CreateStyled } from "@emotion/styled/types/index";

  export * from "@emotion/styled/types/index";
  const customStyled: CreateStyled<App.Theme>;
  export default customStyled;
}
