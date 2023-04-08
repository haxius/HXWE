import { ICoords } from "../../../../models/coords";
import propertyWithDangerouslyRemovedCssUnit from "./propertyWithDangerouslyRemovedCssUnit";

const computeBoxSize = (container: HTMLElement | null): ICoords | undefined => {
  if (!container) {
    return;
  }

  const style = window.getComputedStyle(container);

  if (!style) {
    return;
  }

  return {
    height:
      propertyWithDangerouslyRemovedCssUnit(style, "height") ||
      container.offsetHeight +
        propertyWithDangerouslyRemovedCssUnit(style, "padding-top") +
        propertyWithDangerouslyRemovedCssUnit(style, "padding-bottom") +
        propertyWithDangerouslyRemovedCssUnit(style, "border-top-width") +
        propertyWithDangerouslyRemovedCssUnit(style, "border-bottom-width"),
    width:
      propertyWithDangerouslyRemovedCssUnit(style, "width") ||
      container.offsetWidth +
        propertyWithDangerouslyRemovedCssUnit(style, "padding-left") +
        propertyWithDangerouslyRemovedCssUnit(style, "padding-right") +
        propertyWithDangerouslyRemovedCssUnit(style, "border-left-width") +
        propertyWithDangerouslyRemovedCssUnit(style, "border-right-width"),
    left:
      propertyWithDangerouslyRemovedCssUnit(style, "left") ||
      container.offsetLeft,
    top:
      propertyWithDangerouslyRemovedCssUnit(style, "top") ||
      container.offsetTop,
  };
};

export default computeBoxSize;
