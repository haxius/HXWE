import React, { useRef } from "react";
import { TTaskPropsWith } from "../../../system/tasks/models";
import { useDraggable } from "../../../system/utils/hooks/useDraggable";
import { IWindowCoords } from "./models";
import StyledWindow from "./Window.styled";

interface IWindowProps {
  coords?: Partial<IWindowCoords>;
}

const Window: React.FC<TTaskPropsWith<IWindowProps>> = ({
  coords: initialCoords,
}) => {
  const handleRef = useRef<HTMLElement | null>(null);

  const { coords, handleBeginMove, handleEndMove, handleMove } = useDraggable({
    initialCoords,
    ref: handleRef,
  });

  return (
    <StyledWindow
      {...coords}
      ref={handleRef}
      onPointerDown={handleBeginMove}
      onPointerUp={handleEndMove}
      onPointerMove={handleMove}
    />
  );
};

export default Window;
