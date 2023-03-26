import { useCallback, useState } from "react";
import { IWindowCoords } from "../../../tasks/core/Window/models";

interface IUseDraggableResponse {
  coords: IWindowCoords;
  handleBeginMove: (e: PointerEvent) => void;
  handleEndMove: (e: PointerEvent) => void;
  handleMove: ((e: PointerEvent) => void) | undefined;
}

interface IUseDraggableProps {
  initialCoords: Partial<IWindowCoords> | undefined;
  ref: React.MutableRefObject<HTMLElement | null>;
}

export const useDraggable = ({
  initialCoords,
  ref,
}: IUseDraggableProps): IUseDraggableResponse => {
  const [coords, setCoords] = useState<IWindowCoords>({
    height: initialCoords?.height ?? 240,
    width: initialCoords?.width ?? 320,
    left: initialCoords?.left ?? 100,
    top: initialCoords?.top ?? 100,
  });

  const [offsetCoords, setOffsetCoords] = useState<
    { dragOffsetTop?: number; dragOffsetLeft?: number } | undefined
  >();

  const handleMove = useCallback(
    (e: PointerEvent) => {
      setCoords({
        ...coords,
        left: e.clientX - (offsetCoords?.dragOffsetLeft ?? 0),
        top: e.clientY - (offsetCoords?.dragOffsetTop ?? 0),
      });
    },
    [coords, offsetCoords, ref]
  );

  const handleBeginMove = useCallback(
    (e: PointerEvent) => {
      ref?.current?.setPointerCapture(e.pointerId);

      setOffsetCoords({
        dragOffsetLeft: e.clientX - (ref?.current?.offsetLeft ?? 0),
        dragOffsetTop: e.clientY - (ref?.current?.offsetTop ?? 0),
      });
    },
    [handleMove, ref]
  );

  const handleEndMove = useCallback(
    (e: PointerEvent) => {
      ref?.current?.releasePointerCapture(e.pointerId);

      setOffsetCoords(undefined);
    },
    [handleMove, ref]
  );

  return {
    coords,
    handleBeginMove,
    handleEndMove,
    handleMove: offsetCoords ? handleMove : undefined,
  };
};
