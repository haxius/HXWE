import { ICoords } from "../../../models/coords";

export enum EUseDraggableContainerType {
  DRAG = "drag",
  RESIZE = "resize",
}

export enum EUseDraggableQuality {
  ECO = 0,
  BALANCED = 1,
  QUALITY = 2,
}

export interface IUseDraggableContainerEventCollection {
  handlePointerDown: (e: PointerEvent) => void;
  handlePointerMove: ((e: PointerEvent) => void) | undefined;
  handlePointerUp: (e: PointerEvent) => void;
}

export interface IUseDraggableCoords {
  boxHeight?: number;
  boxWidth?: number;
  dragOffsetLeft?: number;
  dragOffsetTop?: number;
  resizeOffsetLeft?: number;
  resizeOffsetTop?: number;
}

export interface IUseDraggableProps {
  container: React.MutableRefObject<HTMLElement | null>;
  debounce?: boolean;
  initialCoords?: ICoords | undefined;
  quality?: EUseDraggableQuality;
  restrictBounds?: boolean;
}

export interface IUseDraggableResponse {
  coords: ICoords;
  handlePointerDown: (
    e: PointerEvent,
    ref: React.MutableRefObject<HTMLElement | null>,
    type: EUseDraggableContainerType
  ) => void;
  handlePointerMove: (e: PointerEvent) => void;
  handlePointerUp: (
    e: PointerEvent,
    ref: React.MutableRefObject<HTMLElement | null>,
    type: EUseDraggableContainerType
  ) => void;
}

export type IUseDraggableContainerEvents = Map<
  string,
  IUseDraggableContainerEventCollection
>;

export type IUseDraggableContainers = Map<
  React.MutableRefObject<HTMLElement | null>,
  string
>;
