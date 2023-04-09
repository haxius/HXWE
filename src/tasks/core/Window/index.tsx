import React, { useCallback, useEffect, useRef } from "react";
import { TTaskPropsWith } from "../../../system/tasks/models";
import useDraggable from "../../../system/utils/hooks/useDraggable";
import { EUseDraggableContainerType } from "../../../system/utils/hooks/useDraggable/models";
import { IWindowCoords } from "./models";
import StyledWindow, {
  StyledWindowOverlay,
  StyledWindowHandle,
  StyledWindowResizeHandle,
  StyledWindowWrapper,
} from "./Window.styled";

interface IWindowProps {
  contain?: boolean;
  coords: IWindowCoords;
}

const Window: React.FC<TTaskPropsWith<IWindowProps>> = ({
  children,
  contain = true,
  coords: initialCoords,
  name,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const moveRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLElement | null>(null);
  const resizeRef = useRef<HTMLElement | null>(null);

  console.log("Rendered", name);

  const { coords, handlePointerDown, handlePointerMove, handlePointerUp } =
    useDraggable({
      container: containerRef,
      initialCoords,
      overlay: overlayRef,
      restrictBounds: contain,
      // quality: 2,
    });

  const onDragHandlePointerDown = useCallback(
    (e: PointerEvent) =>
      handlePointerDown(e, moveRef, EUseDraggableContainerType.DRAG),
    [handlePointerDown]
  );
  const onDragHandlePointerUp = useCallback(
    (e: PointerEvent) =>
      handlePointerUp(e, moveRef, EUseDraggableContainerType.DRAG),
    [handlePointerUp]
  );
  const onDragHandlePointerMove = useCallback(
    (e: PointerEvent) => handlePointerMove(e),
    [handlePointerMove]
  );

  const onResizeHandlePointerDown = useCallback(
    (e: PointerEvent) =>
      handlePointerDown(e, moveRef, EUseDraggableContainerType.RESIZE),
    [handlePointerDown]
  );
  const onResizeHandlePointerUp = useCallback(
    (e: PointerEvent) =>
      handlePointerUp(e, moveRef, EUseDraggableContainerType.RESIZE),
    [handlePointerUp]
  );
  const onResizeHandlePointerMove = useCallback(
    (e: PointerEvent) => handlePointerMove(e),
    [handlePointerMove]
  );

  useEffect(() => {
    containerRef.current?.removeAttribute("style");
  }, [coords]);

  return (
    <>
      <StyledWindow {...coords} ref={containerRef}>
        <StyledWindowHandle
          ref={moveRef}
          onPointerDown={onDragHandlePointerDown}
          onPointerUp={onDragHandlePointerUp}
          onPointerMove={onDragHandlePointerMove}
        />
        <StyledWindowWrapper>
          <StyledWindowResizeHandle
            ref={resizeRef}
            onPointerDown={onResizeHandlePointerDown}
            onPointerUp={onResizeHandlePointerUp}
            onPointerMove={onResizeHandlePointerMove}
          />
          {children}
        </StyledWindowWrapper>
      </StyledWindow>
      <StyledWindowOverlay {...coords} ref={overlayRef} />
    </>
  );
};

export default Window;
