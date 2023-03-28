import { useCallback, useState } from "react";
import { ICoords } from "../../models/coords";

interface IUseDraggableResponse {
  coords: ICoords;
  handleBeginMove: (e: PointerEvent) => void;
  handleEndMove: (e: PointerEvent) => void;
  handleMove: ((e: PointerEvent) => void) | undefined;
}

interface IUseDraggableProps {
  initialCoords: Partial<ICoords> | undefined;
  ref: React.MutableRefObject<HTMLElement | null>;
  restrictBounds?: boolean;
  setStyles?: boolean;
}

export const useDraggable = ({
  initialCoords,
  ref,
  restrictBounds,
  setStyles,
}: IUseDraggableProps): IUseDraggableResponse => {
  const [coords, setCoords] = useState<ICoords>({
    left: initialCoords?.left ?? 100,
    top: initialCoords?.top ?? 100,
    height: initialCoords?.height ?? 240,
    width: initialCoords?.width ?? 320,
  });

  const [offsetCoords, setOffsetCoords] = useState<
    { dragOffsetTop?: number; dragOffsetLeft?: number } | undefined
  >();

  const handleMove = useCallback(
    (e: PointerEvent) => {
      const newLeft = e.clientX - (offsetCoords?.dragOffsetLeft ?? 0);
      const newTop = e.clientY - (offsetCoords?.dragOffsetTop ?? 0);

      if (setStyles) {
        ref?.current?.setAttribute(
          "style",
          [`left: ${newLeft.toFixed(3)}px`, `top: ${newTop.toFixed(3)}px`].join(
            "; "
          )
        );
      }

      setCoords({
        ...coords,
        left: restrictBounds
          ? Math.max(
              Math.min(
                newLeft,
                window.innerWidth - (ref?.current?.offsetWidth ?? 0)
              ),
              0
            )
          : newLeft,
        top: restrictBounds
          ? Math.max(
              Math.min(
                newTop,
                window.innerHeight - (ref?.current?.offsetHeight ?? 0)
              ),
              0
            )
          : newTop,
      });
    },
    [coords, offsetCoords, ref, restrictBounds, setStyles]
  );

  const handleBeginMove = useCallback(
    (e: PointerEvent) => {
      ref?.current?.setPointerCapture(e.pointerId);

      setOffsetCoords({
        dragOffsetLeft: e.clientX - (ref?.current?.offsetLeft ?? 0),
        dragOffsetTop: e.clientY - (ref?.current?.offsetTop ?? 0),
      });
    },
    [ref]
  );

  const handleEndMove = useCallback(
    (e: PointerEvent) => {
      ref?.current?.releasePointerCapture(e.pointerId);

      setOffsetCoords(undefined);
    },
    [ref]
  );

  return {
    coords,
    handleBeginMove,
    handleEndMove,
    handleMove: offsetCoords ? handleMove : undefined,
  };
};
