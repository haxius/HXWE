import { useCallback, useEffect, useRef } from "react";
import { ICoords } from "../../../models/coords";
import {
  EUseDraggableContainerType,
  EUseDraggableQuality,
  IUseDraggableCoords,
  IUseDraggableProps,
  IUseDraggableResponse,
} from "./models";
import buildInlineStyle from "./utils/buildInlineStyle";
import cancelPendingAnimationFrames from "./utils/cancelPendingAnimationFrames";
import computeBoxSize from "./utils/computeBoxSize";

const useDraggable = ({
  container,
  initialCoords,
  quality = EUseDraggableQuality.BALANCED,
  restrictBounds = true,
}: IUseDraggableProps): IUseDraggableResponse => {
  useEffect(() => {
    /**
     * Set Initial Window Size and Position
     */
    container.current?.setAttribute(
      "style",
      buildInlineStyle(
        new Map([
          ["height", `${initialCoords?.height ?? 240}px`],
          ["left", `${initialCoords?.left ?? 100}px`],
          ["top", `${initialCoords?.top ?? 100}px`],
          ["width", `${initialCoords?.width ?? 320}px`],
        ])
      )
    );
  }, [container, initialCoords]);

  /**
   * A few pieces of information we want to persist between function
   * calls but do not want to cause react state renders.
   */
  const startCoords = useRef<ICoords | undefined>();
  const offsetCoords = useRef<Partial<IUseDraggableCoords> | undefined>();
  const deltaT = useRef<number>(0);
  const requestedAnimationFrame = useRef<number | undefined>();

  const handlePointerDown = useCallback(
    (
      e: PointerEvent,
      ref: React.MutableRefObject<HTMLElement | null>,
      type: EUseDraggableContainerType
    ) => {
      /**
       * Ignore multi-touch pointer down events.
       */
      if (
        (type === EUseDraggableContainerType.DRAG &&
          offsetCoords.current?.dragOffsetTop !== undefined) ||
        (type === EUseDraggableContainerType.RESIZE &&
          offsetCoords.current?.resizeOffsetTop !== undefined)
      ) {
        return;
      }

      /**
       * Cancel pending animation frames
       */
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

      /**
       * Cancel pending animation frames
       */
      cancelPendingAnimationFrames(requestedAnimationFrame.current);

      requestAnimationFrame(() => {
        const currentStyle =
          container.current && window.getComputedStyle(container.current);
        const isResizing = offsetCoords.current?.resizeOffsetLeft !== undefined;

        container.current?.setAttribute(
          "style",
          buildInlineStyle(
            new Map([
              [
                "height",
                `${
                  currentStyle?.height ??
                  `${initialCoords?.height?.toFixed(0)}px`
                }`,
              ],
              [
                "width",
                `${
                  currentStyle?.width ?? `${initialCoords?.width?.toFixed(0)}px`
                }`,
              ],
              [
                "left",
                `${
                  isResizing
                    ? (startCoords.current?.left ?? 0).toFixed(0)
                    : (
                        e.clientX - (offsetCoords.current?.dragOffsetLeft ?? 0)
                      ).toFixed(0)
                }px`,
              ],
              [
                "top",
                `${
                  isResizing
                    ? (startCoords.current?.top ?? 0).toFixed(0)
                    : (
                        e.clientY - (offsetCoords.current?.dragOffsetTop ?? 0)
                      ).toFixed(0)
                }px`,
              ],
            ])
          )
        );

        /**
         * Cancel pending animation frames
         */
        cancelPendingAnimationFrames(requestedAnimationFrame.current);

        offsetCoords.current = undefined;
        startCoords.current = undefined;
        requestedAnimationFrame.current = undefined;
      });
    },
    [container, initialCoords?.height, initialCoords?.width]
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
        const lastDeltaT = deltaT.current;
        const currentDeltaT = new Date().getTime();

        if (
          quality === EUseDraggableQuality.ECO &&
          currentDeltaT - lastDeltaT < 33
        ) {
          requestedAnimationFrame.current = undefined;
          return;
        }

        deltaT.current = currentDeltaT;

        const newLeft = isDragging
          ? e.clientX - (offsetCoords.current?.dragOffsetLeft ?? 0)
          : startCoords.current?.left ?? 0;

        const newTop = isDragging
          ? e.clientY - (offsetCoords.current?.dragOffsetTop ?? 0)
          : startCoords.current?.top ?? 0;

        const newWidth =
          (e.clientX -
            (offsetCoords?.current?.resizeOffsetLeft ?? 0) +
            (startCoords?.current?.width ?? 0)) /
          (startCoords.current?.width ?? 1);

        const newHeight =
          (e.clientY -
            (offsetCoords?.current?.resizeOffsetTop ?? 0) +
            (startCoords?.current?.height ?? 0)) /
          (startCoords.current?.height ?? 1);

        const transform = [];
        const styles = [];

        if (isResizing) {
          transform.push(
            `scale(${newWidth.toFixed(3)}, ${newHeight.toFixed(3)})`
          );
        } else {
          transform.push(`translateX(${newLeft.toFixed(0)}px)`);
          transform.push(`translateY(${newTop.toFixed(0)}px)`);
        }

        styles.push(`transform: ${transform.join(" ")}`);
        styles.push(`height: ${startCoords.current?.height}px`);
        styles.push(`width: ${startCoords.current?.width}px`);

        if (isResizing) {
          styles.push(`top: ${startCoords.current?.top}px`);
          styles.push(`left: ${startCoords.current?.left}px`);
        }

        container?.current?.setAttribute(
          "style",
          styles.filter((f) => f).join("; ")
        );

        requestedAnimationFrame.current = undefined;
      });

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
    [container, quality]
  );

  return {
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
  };
};

export default useDraggable;
