import React, { useCallback, useEffect, useRef } from "react";
import { ICoords } from "../../../system/models/coords";
import { TTaskPropsWith } from "../../../system/tasks/models";
import { useDebounce } from "../../../system/utils/hooks/useDebounce";
import { useDraggable } from "../../../system/utils/hooks/useDraggable";
import { IWindowCoords } from "./models";
import StyledWindow, {
  StyledWindowHandle,
  StyledWindowResizeHandle,
  StyledWindowWrapper,
} from "./Window.styled";

interface IWindowProps {
  coords?: Partial<IWindowCoords>;
}

const Window: React.FC<TTaskPropsWith<IWindowProps>> = ({
  coords: initialCoords,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const moveRef = useRef<HTMLElement | null>(null);
  const resizeRef = useRef<HTMLElement | null>(null);

  const {
    coords: draggableCoords,
    dragEvents,
    resizeEvents,
  } = useDraggable({
    container: containerRef,
    dragHandles: new Map([["main", moveRef]]),
    initialCoords,
    resizeHandles: new Map([["main", resizeRef]]),
    restrictBounds: true,
    setStyles: true,
  });

  const debouncedCoords = useDebounce<ICoords>(draggableCoords, 100);

  useEffect(
    () => containerRef?.current?.setAttribute("style", ""),
    [debouncedCoords]
  );

  console.log("Rendered.");

  return (
    <StyledWindow {...initialCoords} {...debouncedCoords} ref={containerRef}>
      <StyledWindowHandle
        ref={moveRef}
        onPointerDown={useCallback(
          (e: PointerEvent) => dragEvents.get("main")?.handlePointerDown?.(e),
          [dragEvents]
        )}
        onPointerUp={useCallback(
          (e: PointerEvent) => dragEvents.get("main")?.handlePointerUp?.(e),
          [dragEvents]
        )}
        onPointerMove={useCallback(
          (e: PointerEvent) => dragEvents.get("main")?.handlePointerMove?.(e),
          [dragEvents]
        )}
      />
      <StyledWindowWrapper>
        <StyledWindowResizeHandle
          ref={resizeRef}
          onPointerDown={useCallback(
            (e: PointerEvent) =>
              resizeEvents?.get("main")?.handlePointerDown?.(e),
            [resizeEvents]
          )}
          onPointerUp={useCallback(
            (e: PointerEvent) =>
              resizeEvents?.get("main")?.handlePointerUp?.(e),
            [resizeEvents]
          )}
          onPointerMove={useCallback(
            (e: PointerEvent) =>
              resizeEvents?.get("main")?.handlePointerMove?.(e),
            [resizeEvents]
          )}
        />
      </StyledWindowWrapper>
    </StyledWindow>
  );
};

export default Window;
