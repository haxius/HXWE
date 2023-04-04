import { useCallback, useMemo, useState } from "react";
import { ICoords } from "../../models/coords";
import { useDebounce } from "./useDebounce";

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

export interface IUseDraggableCoords {
  dragOffsetLeft?: number;
  dragOffsetTop?: number;
  resizeOffsetLeft?: number;
  resizeOffsetTop?: number;
}

interface IUseDraggableResponse {
  coords: ICoords;
  dragEvents: IUseDraggableContainerEvents;
  resizeEvents?: IUseDraggableContainerEvents;
}

interface IUseDraggableProps {
  container: React.MutableRefObject<HTMLElement | null>;
  debounce?: boolean;
  dragHandles: IUseDraggableContainers;
  initialCoords: Partial<ICoords> | undefined;
  resizeHandles?: IUseDraggableContainers;
  restrictBounds?: boolean;
  setStyles?: boolean;
}

export const useDraggable = ({
  container,
  debounce = true,
  dragHandles,
  initialCoords,
  resizeHandles,
  restrictBounds,
  setStyles,
}: IUseDraggableProps): IUseDraggableResponse => {
  const [coords, setCoords] = useState<ICoords>({
    left: initialCoords?.left ?? 100,
    top: initialCoords?.top ?? 100,
    height: initialCoords?.height ?? 240,
    width: initialCoords?.width ?? 320,
  });

  const debouncedCoords = useDebounce(coords, 100);

  const [offsetCoords, setOffsetCoords] = useState<
    (Partial<ICoords> & Partial<IUseDraggableCoords>) | undefined
  >();

  const handlePointerDown = useCallback(
    (
      e: PointerEvent,
      ref: React.MutableRefObject<HTMLElement | null>,
      type: EUseDraggableContainerType
    ) => {
      if (
        (type === EUseDraggableContainerType.DRAG &&
          offsetCoords?.dragOffsetTop !== undefined) ||
        (type === EUseDraggableContainerType.RESIZE &&
          offsetCoords?.resizeOffsetTop !== undefined)
      ) {
        return;
      }

      const newOffsetCoords: Partial<ICoords> & Partial<IUseDraggableCoords> = {
        height: coords.height,
        width: coords.width,
      };

      const offsetLeft = e.clientX - (container?.current?.offsetLeft ?? 0);
      const offsetTop = e.clientY - (container?.current?.offsetTop ?? 0);

      ref?.current?.setPointerCapture(e.pointerId);

      if (type === EUseDraggableContainerType.RESIZE) {
        newOffsetCoords.resizeOffsetLeft = offsetLeft;
        newOffsetCoords.resizeOffsetTop = offsetTop;
      } else {
        newOffsetCoords.dragOffsetLeft = offsetLeft;
        newOffsetCoords.dragOffsetTop = offsetTop;
      }

      setOffsetCoords(newOffsetCoords);
    },
    [
      container,
      coords.height,
      coords.width,
      offsetCoords?.dragOffsetTop,
      offsetCoords?.resizeOffsetTop,
    ]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent, ref: React.MutableRefObject<HTMLElement | null>) => {
      ref?.current?.releasePointerCapture(e.pointerId);

      setOffsetCoords(undefined);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent, ref: React.MutableRefObject<HTMLElement | null>) => {
      if (!offsetCoords) {
        return;
      }
      const isResizing = offsetCoords.resizeOffsetLeft !== undefined;
      const isDragging = offsetCoords.dragOffsetLeft !== undefined;

      const newLeft = Math.trunc(
        e.clientX - (offsetCoords.dragOffsetLeft ?? 0)
      );
      const newTop = Math.trunc(e.clientY - (offsetCoords.dragOffsetTop ?? 0));

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
            isResizing && `height: ${newHeight}px`,
            isDragging && `left: ${newLeft}px`,
            isDragging && `top: ${newTop}px`,
            isResizing && `width: ${newWidth}px`,
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
    [container, coords, offsetCoords, restrictBounds, setStyles]
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
        handlePointerUp: (e) => handlePointerUp(e, ref),
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
        handlePointerUp: (e) => handlePointerUp(e, ref),
        handlePointerMove: (e) => handlePointerMove(e, ref),
      });
    });

    return newResizeHandles;
  }, [handlePointerDown, handlePointerMove, handlePointerUp, resizeHandles]);

  return {
    coords: debounce ? debouncedCoords : coords,
    dragEvents: dragHandlesWithEvents,
    resizeEvents: resizeHandlesWithEvents,
  };
};
