import { useCallback, useEffect, useRef } from "react";
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

// let draggableRect: DOMRectReadOnly | undefined;

// const observer = new IntersectionObserver((entries) => {
//   draggableRect = entries?.[0]?.boundingClientRect;
//   observer.disconnect();
// });

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

  const startCoords = useRef<ICoords | undefined>();
  const offsetCoords = useRef<Partial<IUseDraggableCoords> | undefined>();

  const handlePointerDown = useCallback(
    (
      e: PointerEvent,
      ref: React.MutableRefObject<HTMLElement | null>,
      type: EUseDraggableContainerType
    ) => {
      if (
        (type === EUseDraggableContainerType.DRAG &&
          offsetCoords.current?.dragOffsetTop !== undefined) ||
        (type === EUseDraggableContainerType.RESIZE &&
          offsetCoords.current?.resizeOffsetTop !== undefined)
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

      startCoords.current = {
        height:
          parseFloat(currentStyle?.height?.replace(/px^/, "") ?? "") ||
          (container?.current?.offsetHeight ?? 0 + boxHeight),
        width:
          parseFloat(currentStyle?.width?.replace(/px^/, "") ?? "") ||
          (container?.current?.offsetWidth ?? 0 + boxWidth),
        left:
          parseFloat(currentStyle?.left?.replace(/px^/, "") ?? "") ||
          (container?.current?.offsetLeft ?? 0),
        top:
          parseFloat(currentStyle?.top?.replace(/px^/, "") ?? "") ||
          (container?.current?.offsetTop ?? 0),
      };

      if (type === EUseDraggableContainerType.RESIZE) {
        offsetCoords.current = {
          resizeOffsetLeft: e.clientX - startCoords.current.left,
          resizeOffsetTop: e.clientY - startCoords.current.top,
        };
      } else {
        offsetCoords.current = {
          dragOffsetLeft: e.clientX - startCoords.current.left,
          dragOffsetTop: e.clientY - startCoords.current.top,
        };
      }

      ref?.current?.setPointerCapture(e.pointerId);
    },
    [container]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent, ref: React.MutableRefObject<HTMLElement | null>) => {
      ref?.current?.releasePointerCapture(e.pointerId);

      const currentStyle =
        container.current && window.getComputedStyle(container.current);

      if (setStyles) {
        container?.current?.setAttribute(
          "style",
          [
            `height: ${
              currentStyle?.height ?? `${initialCoords?.height?.toFixed(0)}px`
            }`,
            `width: ${
              currentStyle?.width ?? `${initialCoords?.width?.toFixed(0)}px`
            }`,
            // `height: ${isResizing ? newHeight : currentRect.height}px`,
            `left: ${
              //container?.current?.offsetLeft + (currentCoords?.left ?? 0)
              (e.clientX - (offsetCoords.current?.dragOffsetLeft ?? 0)).toFixed(
                0
              )
            }px`,
            `top: ${
              //container?.current?.offsetTop + (currentCoords?.top ?? 0)
              (e.clientY - (offsetCoords.current?.dragOffsetTop ?? 0)).toFixed(
                0
              )
            }px`,
            // `width: ${isResizing ? newWidth : currentRect.width}px`,
          ]
            .filter((f) => f)
            .join("; ")
        );
      }

      offsetCoords.current = undefined;
      startCoords.current = undefined;
      // currentCoords = undefined;

      // PUT CODE HERE TO UPDATE STATE SO NEW OFFSET IS SET IN STYLES
      // WILL MAKE NEXT TRANSFORM RELATIVE AGAIN <---
    },
    [container, setStyles]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent, ref: React.MutableRefObject<HTMLElement | null>) => {
      if (!offsetCoords?.current || !container?.current) {
        return;
      }

      // observer.observe(container.current);

      // const currentRect = {
      //   width: draggableRect?.width ?? 0,
      //   height: draggableRect?.height ?? 0,
      //   top: draggableRect?.top ?? 0,
      //   left: draggableRect?.left ?? 0,
      // };

      // console.log("Draggable Rect:", draggableRect?.x);

      // currentRect.width -= offsetCoords.boxWidth ?? 0;
      // currentRect.height -= offsetCoords.boxHeight ?? 0;

      const isResizing = offsetCoords.current?.resizeOffsetLeft !== undefined;
      const isDragging = offsetCoords.current?.dragOffsetLeft !== undefined;

      // const currentHeight = container?.current?.clientHeight ?? 0;
      // const currentWidth = container?.current?.clientWidth ?? 0;
      // const currentTop = container?.current?.offsetTop ?? 0;
      // const currentLeft = container?.current?.offsetLeft ?? 0;

      // const newLeft = Math.trunc(
      //   e.clientX -
      //     (offsetCoords.dragOffsetLeft ?? 0) -
      //     (startCoords?.left ?? 0)
      // );
      // const newTop = Math.trunc(
      //   e.clientY - (offsetCoords.dragOffsetTop ?? 0) - (startCoords?.top ?? 0)
      // );

      // currentCoords = {
      //   top: newTop,
      //   left: newLeft,
      //   width: 0,
      //   height: 0,
      // };

      // const newHeight = isResizing
      //   ? (offsetCoords?.height ?? 0) + newTop - currentRect.top
      //   : currentRect.height;

      // const newWidth = isResizing
      //   ? (offsetCoords?.width ?? 0) + newLeft - currentRect.left
      //   : currentRect.width;

      const newLeft = isDragging
        ? e.clientX - (offsetCoords.current?.dragOffsetLeft ?? 0)
        : startCoords.current?.left ?? 0;

      const newTop = isDragging
        ? e.clientY - (offsetCoords.current?.dragOffsetTop ?? 0)
        : startCoords.current?.top ?? 0;

      // Calculate this.
      const newWidth = isResizing
        ? (startCoords.current?.left ?? 0) -
          (startCoords.current?.width ?? 0) +
          e.clientX +
          (offsetCoords.current?.resizeOffsetLeft ?? 0)
        : startCoords.current?.width ?? 0;

      const newHeight = isResizing
        ? (startCoords.current?.top ?? 0) -
          (startCoords.current?.height ?? 0) +
          e.clientY +
          (offsetCoords.current?.resizeOffsetTop ?? 0)
        : startCoords.current?.height ?? 0;

      //const newLeft = e.clientX - (offsetCoords.current?.dragOffsetLeft ?? 0); //+
      //(startCoords?.current?.left ?? 0);
      //const newTop = e.clientY - (offsetCoords.current?.dragOffsetTop ?? 0); //+
      //(startCoords?.current?.top ?? 0);

      if (setStyles) {
        container?.current?.setAttribute(
          "style",
          [
            `transform: translateX(${newLeft.toFixed(
              0
            )}px) translateY(${newTop.toFixed(0)}px)`,
            `height: ${newHeight.toFixed(0)}px`,
            `width: ${newWidth.toFixed(0)}px`,
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
