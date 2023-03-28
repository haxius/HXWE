import { useState } from "react";
import { ICoords } from "../../models/coords";

interface IUseResizeableResponse {
  coords: ICoords;
}

interface IUseResizeableProps {
  handleRef: React.MutableRefObject<HTMLElement | null>;
  initialCoords: ICoords;
  maxSize?: Partial<ICoords>;
  minSize?: Partial<ICoords>;
  ref: React.MutableRefObject<HTMLElement | null>;
  restrictBounds?: boolean;
  setStyles?: boolean;
}

export const useResizeable = ({
  handleRef,
  initialCoords,
  maxSize,
  minSize,
  ref,
  restrictBounds,
  setStyles,
}: IUseResizeableProps): IUseResizeableResponse => {
  const [coords, setCoords] = useState<ICoords>({
    left: initialCoords?.left ?? 100,
    top: initialCoords?.top ?? 100,
    height: initialCoords?.height ?? 240,
    width: initialCoords?.width ?? 320,
  });

  const [offsetCoords, setOffsetCoords] = useState<
    { dragOffsetTop?: number; dragOffsetLeft?: number } | undefined
  >();

  // ... maybe pass back the resize events like in useDraggable?

  return {
    coords,
  };
};
