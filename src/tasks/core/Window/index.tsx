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

  const [coords, setCoords] = useState<IWindowCoords>({
    height: initialCoords?.height ?? 240,
    width: initialCoords?.width ?? 320,
    left: initialCoords?.left ?? 100,
    top: initialCoords?.top ?? 100,
  });

  useEffect(() => {
    const handle: HTMLElement | null = handleRef?.current;
    const handleClick = () => console.log("Clicked!");

    if (handle && !handle?.getAttribute("data-bound")?.length) {
      handle.addEventListener("click", handleClick);
      handle.setAttribute("data-bound", "true");
    }

    return () => {
      handle?.removeEventListener("click", handleClick);
      handle?.removeAttribute("data-bound");
    };
  }, [handleRef]);

  return <StyledWindow {...coords} ref={handleRef} />;
};

export default Window;
