export enum EUseDraggableContainerType {
  DRAG = "drag",
  RESIZE = "resize",
}

export enum EUseDraggableQuality {
  ECO = 0, // 30fps Capped Paint Cycle FPS, Hide Window Contents While Resizing
  BALANCED = 1, // Unlimited Paint Cycle FPS, Hide Window Contents While Resizing
  QUALITY = 2, // Unlimited Paint Cycle FPS, Show Window Contents While Resizing
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
