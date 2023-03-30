import styled from "@emotion/styled";
import { TPropsWithTheme } from "../../../styles/models";
import { IWindowCoords } from "./models";

interface IStyledWindowProps extends IWindowCoords {}

const StyledWindow = styled.article`
  display: flex;
  flex-direction: column;
  border: 1px solid red;
  position: absolute;

  ${({ width, height, top, left }: TPropsWithTheme<IStyledWindowProps>) => `
    height: ${height}px;
    width: ${width}px;
    left: ${left}px;
    top: ${top}px;
    padding: 5px;
  `}
`;

export const StyledWindowWrapper = styled.div`
  border: 1px dashed green;
  flex: 1;
  position: relative;
  width: 100%;
`;

export const StyledWindowHandle = styled.div`
  border: 1px solid purple;
  height: 32px;
  width: 100%;
`;

export const StyledWindowResizeHandle = styled.div`
  border: 1px solid red;
  bottom: 5px;
  height: 32px;
  width: 32px;
  right: 5px;
  position: absolute;
`;

export default StyledWindow;
