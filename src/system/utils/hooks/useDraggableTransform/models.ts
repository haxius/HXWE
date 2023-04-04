export enum EUseDraggableContainerType {
  DRAG = "drag",
  RESIZE = "resize",
}

export interface IUseDraggableContainerEventCollection {
  handlePointerDown: (e: PointerEvent) => void;
  handlePointerMove: ((e: PointerEvent) => void) | undefined;
  handlePointerUp: (e: PointerEvent) => void;
}

export interface IUseDraggableCoords {
  dragOffsetLeft?: number;
  dragOffsetTop?: number;
  resizeOffsetLeft?: number;
  resizeOffsetTop?: number;
  boxHeight?: number;
  boxWidth?: number;
}

export type IUseDraggableContainerEvents = Map<
  string,
  IUseDraggableContainerEventCollection
>;

export type IUseDraggableContainers = Map<
  React.MutableRefObject<HTMLElement | null>,
  string
>;
