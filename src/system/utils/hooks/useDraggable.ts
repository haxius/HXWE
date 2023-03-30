import { useCallback, useMemo, useState } from "react";
import { ICoords } from "../../models/coords";

enum EUseDraggableContainerType {
  DRAG = "drag",
  RESIZE = "resize",
}

export type IUseDraggableContainers = Map<
  string,
  React.MutableRefObject<HTMLElement | null>
>;

export interface IUseDraggableContainerEventCollection {
  handlePointerDown: (e: PointerEvent) => void;
  handlePointerUp: (e: PointerEvent) => void;
  handlePointerMove: ((e: PointerEvent) => void) | undefined;
}

export type IUseDraggableContainerEvents = Map<
  string,
  IUseDraggableContainerEventCollection
>;

interface IUseDraggableResponse {
  coords: ICoords;
  dragEvents: IUseDraggableContainerEvents;
  resizeEvents?: IUseDraggableContainerEvents;
}

interface IUseDraggableProps {
  container: React.MutableRefObject<HTMLElement | null>;
  dragHandles: IUseDraggableContainers;
  initialCoords: Partial<ICoords> | undefined;
  resizeHandles?: IUseDraggableContainers;
  restrictBounds?: boolean;
  setStyles?: boolean;
}

export const useDraggable = ({
  container,
  dragHandles,
  initialCoords,
  resizeHandles,
  restrictBounds,
  setStyles,
}: IUseDraggableProps): IUseDraggableResponse => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const [coords, setCoords] = useState<ICoords>({
    left: initialCoords?.left ?? 100,
    top: initialCoords?.top ?? 100,
    height: initialCoords?.height ?? 240,
    width: initialCoords?.width ?? 320,
  });

  const [offsetCoords, setOffsetCoords] = useState<
    | (Partial<ICoords> & { dragOffsetTop?: number; dragOffsetLeft?: number })
    | undefined
  >();

  const handlePointerDown = useCallback(
    (
      e: PointerEvent,
      ref: React.MutableRefObject<HTMLElement | null>,
      type: EUseDraggableContainerType
    ) => {
      if (
        (type === EUseDraggableContainerType.DRAG && isDragging) ||
        (type === EUseDraggableContainerType.RESIZE && isResizing)
      ) {
        return;
      }

      ref?.current?.setPointerCapture(e.pointerId);

      setOffsetCoords({
        dragOffsetLeft: e.clientX - (container?.current?.offsetLeft ?? 0),
        dragOffsetTop: e.clientY - (container?.current?.offsetTop ?? 0),
        height: coords.height,
        width: coords.width,
      });

      if (type === EUseDraggableContainerType.DRAG) {
        setIsDragging(true);
      } else {
        setIsResizing(true);
      }
    },
    [container, isDragging, isResizing]
  );

  const handlePointerUp = useCallback(
    (
      e: PointerEvent,
      ref: React.MutableRefObject<HTMLElement | null>,
      type: EUseDraggableContainerType
    ) => {
      ref?.current?.releasePointerCapture(e.pointerId);

      setOffsetCoords(undefined);

      if (type === EUseDraggableContainerType.DRAG) {
        setIsDragging(false);
      } else {
        setIsResizing(false);
      }
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent, ref: React.MutableRefObject<HTMLElement | null>) => {
      if ((!isDragging && !isResizing) || !offsetCoords) {
        return;
      }

      const newLeft = e.clientX - (offsetCoords.dragOffsetLeft ?? 0);
      const newTop = e.clientY - (offsetCoords.dragOffsetTop ?? 0);

      const newHeight = isResizing
        ? (offsetCoords?.height ?? 0) + newTop - coords.top
        : coords.height;

      const newWidth = isResizing
        ? (offsetCoords?.width ?? 0) + newLeft - coords.left
        : coords.width;

      if (setStyles) {
        container?.current?.setAttribute(
          "style",
          [
            isResizing && `height: ${newHeight.toFixed(3)}px`,
            isDragging && `left: ${newLeft.toFixed(3)}px`,
            isDragging && `top: ${newTop.toFixed(3)}px`,
            isResizing && `width: ${newWidth.toFixed(3)}px`,
          ]
            .filter((f) => f)
            .join("; ")
        );
      }

      let restrictedLeft = restrictBounds
        ? Math.max(
            Math.min(
              newLeft,
              window.innerWidth - (ref?.current?.offsetWidth ?? 0)
            ),
            0
          )
        : 0;

      const restrictedTop = restrictBounds
        ? Math.max(
            Math.min(
              newTop,
              window.innerHeight - (ref?.current?.offsetHeight ?? 0)
            ),
            0
          )
        : 0;

      setCoords({
        height: isResizing ? newHeight : coords.height,
        left: isDragging
          ? restrictBounds
            ? restrictedLeft
            : newLeft
          : coords.left,
        top: isDragging
          ? restrictBounds
            ? restrictedTop
            : newTop
          : coords.top,
        width: isResizing ? newWidth : coords.width,
      });
    },
    [
      container,
      coords,
      isDragging,
      isResizing,
      offsetCoords,
      restrictBounds,
      setStyles,
    ]
  );

  const dragHandlesWithEvents: IUseDraggableContainerEvents = useMemo(() => {
    const newDragHandles = new Map<
      string,
      IUseDraggableContainerEventCollection
    >();

    dragHandles.forEach((ref, title) => {
      newDragHandles.set(title, {
        handlePointerDown: (e) =>
          handlePointerDown(e, ref, EUseDraggableContainerType.DRAG),
        handlePointerUp: (e) =>
          handlePointerUp(e, ref, EUseDraggableContainerType.DRAG),
        handlePointerMove: (e) => handlePointerMove(e, ref),
      });
    });

    return newDragHandles;
  }, [dragHandles, handlePointerDown, handlePointerUp, handlePointerMove]);

  const resizeHandlesWithEvents: IUseDraggableContainerEvents = useMemo(() => {
    const newResizeHandles = new Map<
      string,
      IUseDraggableContainerEventCollection
    >();

    resizeHandles?.forEach((ref, title) => {
      newResizeHandles.set(title, {
        handlePointerDown: (e) =>
          handlePointerDown(e, ref, EUseDraggableContainerType.RESIZE),
        handlePointerUp: (e) =>
          handlePointerUp(e, ref, EUseDraggableContainerType.RESIZE),
        handlePointerMove: (e) => handlePointerMove(e, ref),
      });
    });

    return newResizeHandles;
  }, [handlePointerDown, handlePointerMove, handlePointerUp, resizeHandles]);

  return {
    coords,
    dragEvents: dragHandlesWithEvents,
    resizeEvents: resizeHandlesWithEvents,
  };
};
