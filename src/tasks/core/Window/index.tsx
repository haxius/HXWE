import React, { useCallback, useEffect, useRef, useState } from "react";
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

  const [offsetCoords, setOffsetCoords] = useState<
    { dragOffsetTop?: number; dragOffsetLeft?: number } | undefined
  >();

  const handleBeginMove = (e: PointerEvent) => {
    const handle: HTMLElement | null = handleRef?.current;

    handle?.setAttribute("data-bound", "true");
    handle?.addEventListener("pointermove", handleMove);
    handle?.setPointerCapture(e.pointerId);

    setOffsetCoords({
      dragOffsetLeft: e.clientX - (handle?.offsetLeft ?? 0),
      dragOffsetTop: e.clientY - (handle?.offsetTop ?? 0),
    });

    setIsDragging(true);
  };

  const handleEndMove = (e: PointerEvent) => {
    const handle: HTMLElement | null = handleRef?.current;

    handle?.removeAttribute("data-bound");
    handle?.removeEventListener("pointermove", handleMove);
    handle?.releasePointerCapture(e.pointerId);

    setIsDragging(false);
    setOffsetCoords(undefined);
  };

  const handleMove = (e: PointerEvent) => {
    const handle: HTMLElement | null = handleRef?.current;

    if (handle && handle?.getAttribute("data-bound")?.length) {
      setCoords({
        ...coords,
        left: e.clientX - (offsetCoords?.dragOffsetLeft ?? 0),
        top: e.clientY - (offsetCoords?.dragOffsetTop ?? 0),
      });
    }
  };

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
