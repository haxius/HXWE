import styled from "@emotion/styled";
import { TPropsWithTheme } from "../../../styles/models";
import { IWindowCoords } from "./models";

interface IStyledWindowProps extends IWindowCoords {}

const StyledWindow = styled.article`
  border: 1px solid red;
  position: absolute;

  ${({ width, height, top, left }: TPropsWithTheme<IStyledWindowProps>) => `
    height: ${height}px;
    width: ${width}px;
    left: ${left}px;
    top: ${top}px;
  `}
`;

export default StyledWindow;
