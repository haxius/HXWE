import React, { useEffect, useRef } from "react";
import { TTaskPropsWith } from "../../../system/tasks/models";
import { useDebounce } from "../../../system/utils/hooks/useDebounce";
import {
  IUseDraggableCoords,
  useDraggable,
} from "../../../system/utils/hooks/useDraggable";
import { IWindowCoords } from "./models";
import StyledWindow from "./Window.styled";

interface IWindowProps {
  coords?: Partial<IWindowCoords>;
}

const Window: React.FC<TTaskPropsWith<IWindowProps>> = ({
  coords: initialCoords,
}) => {
  const handleRef = useRef<HTMLElement | null>(null);

  const {
    coords: draggableCoords,
    handleBeginMove,
    handleEndMove,
    handleMove,
  } = useDraggable({
    initialCoords,
    ref: handleRef,
    restrictBounds: true,
    setStyles: true,
  });

  const debouncedCoords = useDebounce<IUseDraggableCoords>(
    draggableCoords,
    100
  );

  useEffect(
    () => handleRef?.current?.setAttribute("style", ""),
    [debouncedCoords]
  );

  return (
    <StyledWindow
      {...initialCoords}
      {...debouncedCoords}
      ref={handleRef}
      onPointerDown={handleBeginMove}
      onPointerUp={handleEndMove}
      onPointerMove={handleMove}
    />
  );
};

export default Window;
