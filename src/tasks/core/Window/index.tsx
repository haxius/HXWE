import React, { useEffect, useRef, useState } from "react";
import { TTaskPropsWith } from "../../../system/tasks/models";
import { IWindowCoords } from "./models";
import StyledWindow from "./Window.styled";

interface IWindowProps {
  coords?: Partial<IWindowCoords>;
}

const Window: React.FC<TTaskPropsWith<IWindowProps>> = ({
  coords: initialCoords,
}) => {
  const handleRef = useRef<HTMLElement | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [coords, setCoords] = useState<IWindowCoords>({
    height: initialCoords?.height ?? 240,
    width: initialCoords?.width ?? 320,
    left: initialCoords?.left ?? 100,
    top: initialCoords?.top ?? 100,
  });

  console.log("Is dragging:", isDragging);

  useEffect(() => {
    const handle: HTMLElement | null = handleRef?.current;
    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    if (handle && !handle?.getAttribute("data-bound")?.length) {
      handle.addEventListener("mousedown", handleMouseDown);
      handle.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseout", handleMouseUp);
      handle.setAttribute("data-bound", "true");
    }

    return () => {
      handle?.removeEventListener("mousedown", handleMouseDown);
      handle?.removeEventListener("mouseup", handleMouseUp);
      document?.removeEventListener("mouseout", handleMouseUp);
      handle?.removeAttribute("data-bound");
    };
  }, [handleRef]);

  return <StyledWindow {...coords} ref={handleRef} />;
};

export default Window;
