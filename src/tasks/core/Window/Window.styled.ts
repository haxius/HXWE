import styled from "@emotion/styled";
import { TPropsWithTheme } from "../../../styles/models";
import { IWindowCoords } from "./models";

interface IStyledWindowProps extends IWindowCoords {}

const StyledWindow = styled.article`
  position: absolute;
  display: flex;
  flex-direction: column;
  border: 1px solid red;
  padding: 5px;
  transform-origin: top left;
  will-change: transform, left, top, width, height;

  ${({ width, height, top, left }: TPropsWithTheme<IStyledWindowProps>) => `
    height: ${height}px;
    width: ${width}px;
    left: ${left}px;
    top: ${top}px;
  `}
`;

export const StyledWindowWrapper = styled.div`
  border: 1px dashed green;
  flex: 1;
  position: relative;
`;

export const StyledWindowHandle = styled.div`
  border: 1px solid purple;
  height: 32px;
  width: 100%;
  user-select: none;
  cursor: grab;
`;

export const StyledWindowResizeHandle = styled.div`
  border: 1px solid red;
  bottom: 5px;
  height: 32px;
  width: 32px;
  right: 5px;
  position: absolute;
  user-select: none;
  cursor: grab;
`;

export const StyledWindowOverlay = styled(StyledWindow)`
  border: 0;
  will-change: height, left, opacity, top, transform, width;
  background-color: blue;
  opacity: 0;
  pointer-events: none;
`;

export default StyledWindow;
