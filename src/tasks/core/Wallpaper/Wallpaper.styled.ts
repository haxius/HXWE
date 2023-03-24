import styled from "@emotion/styled";
import { TPropsWithTheme } from "../../../styles/models";

const StyledWallpaper = styled.section`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  background: ${(props: TPropsWithTheme) => props.theme.Colors.background};
`;

export default StyledWallpaper;
