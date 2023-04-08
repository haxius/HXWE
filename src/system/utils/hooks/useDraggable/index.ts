import { useCallback, useEffect, useRef, useState } from "react";
import { ICoords } from "../../../models/coords";
import {
  EUseDraggableContainerType,
  EUseDraggableQuality,
  IUseDraggableCoords,
  IUseDraggableProps,
  IUseDraggableResponse,
} from "./models";
import buildInlineStyle from "./utils/buildInlineStyle";
import buildTransformStyle from "./utils/buildTransformStyle";
import cancelPendingAnimationFrames from "./utils/cancelPendingAnimationFrames";
import computeBoxSize from "./utils/computeBoxSize";
import propertyWithDangerouslyRemovedCssUnit from "./utils/propertyWithDangerouslyRemovedCssUnit";

const useDraggable = ({
  container,
  initialCoords = {
    height: 240,
    left: 100,
    top: 100,
    width: 320,
  },
  quality = EUseDraggableQuality.BALANCED,
  restrictBounds = true,
}: IUseDraggableProps): IUseDraggableResponse => {
  const [coords, setCoords] = useState<ICoords>(initialCoords);

  useEffect(() => {
    container.current?.setAttribute(
      "style",
      buildInlineStyle({
        height: `${initialCoords.height}px`,
        left: `${initialCoords.left}px`,
        top: `${initialCoords.top}px`,
        width: `${initialCoords.width}px`,
      })
    );
  }, [container, initialCoords]);

  const startCoords = useRef<ICoords | undefined>();
  const offsetCoords = useRef<Partial<IUseDraggableCoords> | undefined>();
  const requestedAnimationFrame = useRef<number | undefined>();

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

      cancelPendingAnimationFrames(requestedAnimationFrame.current);

      startCoords.current = computeBoxSize(container.current);

      if (type === EUseDraggableContainerType.RESIZE) {
        offsetCoords.current = {
          resizeOffsetLeft: e.clientX,
          resizeOffsetTop: e.clientY,
        };
      } else {
        offsetCoords.current = {
          dragOffsetLeft: e.clientX - (startCoords.current?.left ?? 0),
          dragOffsetTop: e.clientY - (startCoords.current?.top ?? 0),
        };
      }

      ref?.current?.setPointerCapture(e.pointerId);
    },
    [container]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent, ref: React.MutableRefObject<HTMLElement | null>) => {
      ref?.current?.releasePointerCapture(e.pointerId);

      cancelPendingAnimationFrames(requestedAnimationFrame.current);

      requestAnimationFrame(() => {
        const currentStyle =
          container.current && window.getComputedStyle(container.current);
        const isResizing = offsetCoords.current?.resizeOffsetLeft !== undefined;

        let newLeft = isResizing
          ? startCoords.current?.left ?? 0
          : e.clientX - (offsetCoords.current?.dragOffsetLeft ?? 0);

        let newTop = isResizing
          ? startCoords.current?.top ?? 0
          : e.clientY - (offsetCoords.current?.dragOffsetTop ?? 0);

        if (restrictBounds) {
          newLeft = Math.max(
            Math.min(
              newLeft,
              window.innerWidth - (container.current?.offsetWidth ?? 0)
            ),
            0
          );
          newTop = Math.max(
            Math.min(
              newTop,
              window.innerHeight - (container.current?.offsetHeight ?? 0)
            ),
            0
          );
        }

        container.current?.setAttribute(
          "style",
          buildInlineStyle({
            height: `${
              currentStyle?.height ?? `${initialCoords?.height?.toFixed(0)}px`
            }`,
            width: `${
              currentStyle?.width ?? `${initialCoords?.width?.toFixed(0)}px`
            }`,
            left: `${newLeft.toFixed(0)}px`,
            top: `${newTop.toFixed(0)}px`,
          })
        );

        cancelPendingAnimationFrames(requestedAnimationFrame.current);

        setCoords({
          height: Math.trunc(
            currentStyle
              ? propertyWithDangerouslyRemovedCssUnit(currentStyle, "height")
              : initialCoords.height
          ),
          width: Math.trunc(
            currentStyle
              ? propertyWithDangerouslyRemovedCssUnit(currentStyle, "width")
              : initialCoords.width
          ),
          left: Math.trunc(newLeft),
          top: Math.trunc(newTop),
        });

        offsetCoords.current = undefined;
        startCoords.current = undefined;
        requestedAnimationFrame.current = undefined;
      });
    },
    [container, initialCoords?.height, initialCoords?.width, restrictBounds]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (
        !container.current ||
        !offsetCoords.current ||
        !startCoords.current ||
        requestedAnimationFrame.current !== undefined
      ) {
        return;
      }

      const isResizing = offsetCoords.current?.resizeOffsetLeft !== undefined;
      const isDragging = offsetCoords.current?.dragOffsetLeft !== undefined;

      requestedAnimationFrame.current = requestAnimationFrame(() => {
        let newLeft = isDragging
          ? e.clientX -
            (offsetCoords.current?.dragOffsetLeft ?? 0) -
            (startCoords.current?.left ?? 0)
          : startCoords.current?.left ?? 0;

        let newTop = isDragging
          ? e.clientY -
            (offsetCoords.current?.dragOffsetTop ?? 0) -
            (startCoords.current?.top ?? 0)
          : startCoords.current?.top ?? 0;

        const newWidth =
          (e.clientX -
            (offsetCoords.current?.resizeOffsetLeft ?? 0) +
            (startCoords.current?.width ?? 0)) /
          (startCoords.current?.width ?? 1);

        const newHeight =
          (e.clientY -
            (offsetCoords.current?.resizeOffsetTop ?? 0) +
            (startCoords.current?.height ?? 0)) /
          (startCoords.current?.height ?? 1);

        if (restrictBounds) {
          newLeft = Math.max(
            Math.min(
              newLeft,
              window.innerWidth -
                (container.current?.offsetWidth ?? 0) -
                (startCoords.current?.left ?? 0)
            ),
            -1 * (startCoords.current?.left ?? 0)
          );
          newTop = Math.max(
            Math.min(
              newTop,
              window.innerHeight -
                (container.current?.offsetHeight ?? 0) -
                (startCoords.current?.top ?? 0)
            ),
            -1 * (startCoords.current?.top ?? 0)
          );
        }

        container?.current?.setAttribute(
          "style",
          buildInlineStyle([
            [
              "transform",
              buildTransformStyle({
                scale: isResizing
                  ? `${newWidth.toFixed(3)}, ${newHeight.toFixed(3)}`
                  : undefined,
                translateX: isDragging ? `${newLeft.toFixed(0)}px` : undefined,
                translateY: isDragging ? `${newTop.toFixed(0)}px` : undefined,
              }),
            ],
            ["height", `${startCoords.current?.height}px`],
            ["width", `${startCoords.current?.width}px`],
            ["top", isResizing ? `${startCoords.current?.top}px` : undefined],
            ["left", isResizing ? `${startCoords.current?.left}px` : undefined],
          ])
        );

        requestedAnimationFrame.current = undefined;
      });
    },
    [container, restrictBounds]
  );

  return {
    coords,
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
  };
};

export default useDraggable;
