import { useCallback, useEffect } from "react";
import { ICoords } from "../../../models/coords";
import { EUseDraggableContainerType, IUseDraggableCoords } from "./models";

interface IUseDraggableResponse {
  handlePointerDown: (
    e: PointerEvent,
    ref: React.MutableRefObject<HTMLElement | null>,
    type: EUseDraggableContainerType
  ) => void;
  handlePointerMove: (
    e: PointerEvent,
    ref: React.MutableRefObject<HTMLElement | null>
  ) => void;
  handlePointerUp: (
    e: PointerEvent,
    ref: React.MutableRefObject<HTMLElement | null>,
    type: EUseDraggableContainerType
  ) => void;
}

interface IUseDraggableProps {
  container: React.MutableRefObject<HTMLElement | null>;
  debounce?: boolean;
  initialCoords: Partial<ICoords> | undefined;
  restrictBounds?: boolean;
  setStyles?: boolean;
}

let offsetCoords:
  | (Partial<ICoords> & Partial<IUseDraggableCoords>)
  | undefined = undefined;

let draggableRect: DOMRectReadOnly | undefined;

const observer = new IntersectionObserver((entries) => {
  draggableRect = entries?.[0]?.boundingClientRect;
  observer.disconnect();
});

const useDraggable = ({
  container,
  initialCoords,
  restrictBounds,
  setStyles,
}: IUseDraggableProps): IUseDraggableResponse => {
  useEffect(() => {
    if (setStyles) {
      container?.current?.setAttribute(
        "style",
        [
          `height: ${initialCoords?.height ?? 240}px`,
          `left: ${initialCoords?.left ?? 100}px`,
          `top: ${initialCoords?.top ?? 100}px`,
          `width: ${initialCoords?.width ?? 320}px`,
        ]
          .filter((f) => f)
          .join("; ")
      );
    }
  }, [container, initialCoords, setStyles]);

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

      const currentStyle =
        container.current && window.getComputedStyle(container.current);

      const boxHeight =
        parseFloat(currentStyle?.paddingTop ?? "") +
        parseFloat(currentStyle?.paddingBottom ?? "") +
        parseFloat(currentStyle?.borderTopWidth ?? "") +
        parseFloat(currentStyle?.borderBottomWidth ?? "");

      const boxWidth =
        parseFloat(currentStyle?.paddingLeft ?? "") +
        parseFloat(currentStyle?.paddingRight ?? "") +
        parseFloat(currentStyle?.borderLeftWidth ?? "") +
        parseFloat(currentStyle?.borderRightWidth ?? "");

      const newOffsetCoords: Partial<ICoords> & Partial<IUseDraggableCoords> = {
        boxHeight,
        boxWidth,
        height: (container?.current?.offsetHeight ?? 0) + boxHeight,
        width: (container?.current?.offsetWidth ?? 0) + boxWidth,
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

      offsetCoords = newOffsetCoords;
    },
    [container]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent, ref: React.MutableRefObject<HTMLElement | null>) => {
      ref?.current?.releasePointerCapture(e.pointerId);

      offsetCoords = undefined;
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent, ref: React.MutableRefObject<HTMLElement | null>) => {
      if (!offsetCoords || !container?.current) {
        return;
      }

      observer.observe(container.current);

      const currentRect = {
        width: draggableRect?.width ?? 0,
        height: draggableRect?.height ?? 0,
        top: draggableRect?.top ?? 0,
        left: draggableRect?.left ?? 0,
      };

      console.log("Draggable Rect:", draggableRect?.x);

      currentRect.width -= offsetCoords.boxWidth ?? 0;
      currentRect.height -= offsetCoords.boxHeight ?? 0;

      const isResizing = offsetCoords.resizeOffsetLeft !== undefined;
      const isDragging = offsetCoords.dragOffsetLeft !== undefined;
      // const currentHeight = container?.current?.clientHeight ?? 0;
      // const currentWidth = container?.current?.clientWidth ?? 0;
      // const currentTop = container?.current?.offsetTop ?? 0;
      // const currentLeft = container?.current?.offsetLeft ?? 0;

      const newLeft = Math.trunc(
        e.clientX - (offsetCoords.dragOffsetLeft ?? 0)
      );
      const newTop = Math.trunc(e.clientY - (offsetCoords.dragOffsetTop ?? 0));

      const newHeight = isResizing
        ? (offsetCoords?.height ?? 0) + newTop - currentRect.top
        : currentRect.height;

      const newWidth = isResizing
        ? (offsetCoords?.width ?? 0) + newLeft - currentRect.left
        : currentRect.width;

      if (setStyles) {
        container?.current?.setAttribute(
          "style",
          [
            `height: ${isResizing ? newHeight : currentRect.height}px`,
            `left: ${isDragging ? newLeft : currentRect.left}px`,
            `top: ${isDragging ? newTop : currentRect.top}px`,
            `width: ${isResizing ? newWidth : currentRect.width}px`,
          ]
            .filter((f) => f)
            .join("; ")
        );
      }

      // let restrictedLeft = restrictBounds
      //   ? Math.max(
      //       Math.min(
      //         newLeft,
      //         window.innerWidth - (ref?.current?.offsetWidth ?? 0)
      //       ),
      //       0
      //     )
      //   : 0;

      // const restrictedTop = restrictBounds
      //   ? Math.max(
      //       Math.min(
      //         newTop,
      //         window.innerHeight - (ref?.current?.offsetHeight ?? 0)
      //       ),
      //       0
      //     )
      //   : 0;
    },
    [container, setStyles]
  );

  return {
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
  };
};

export default useDraggable;
