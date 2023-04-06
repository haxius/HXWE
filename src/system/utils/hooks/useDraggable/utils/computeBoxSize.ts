import { ICoords } from "../../../../models/coords";

const computeBoxSize = (container: HTMLElement | null): ICoords | undefined => {
  if (!container) {
    return;
  }

  const style = window.getComputedStyle(container);

  if (!style) {
    return;
  }

  /**
   * This may fail if the unit is any unit other than 'px'.
   */
  const propertyWithDangerouslyRemovedCssUnit = (property: string) =>
    parseFloat(style.getPropertyValue(property).replace(/px$/, ""));

  return {
    height:
      propertyWithDangerouslyRemovedCssUnit("height") ||
      container.offsetHeight +
        propertyWithDangerouslyRemovedCssUnit("padding-top") +
        propertyWithDangerouslyRemovedCssUnit("padding-bottom") +
        propertyWithDangerouslyRemovedCssUnit("border-top-width") +
        propertyWithDangerouslyRemovedCssUnit("border-bottom-width"),
    width:
      propertyWithDangerouslyRemovedCssUnit("width") ||
      container.offsetWidth +
        propertyWithDangerouslyRemovedCssUnit("padding-left") +
        propertyWithDangerouslyRemovedCssUnit("padding-right") +
        propertyWithDangerouslyRemovedCssUnit("border-left-width") +
        propertyWithDangerouslyRemovedCssUnit("border-right-width"),
    left: propertyWithDangerouslyRemovedCssUnit("left") || container.offsetLeft,
    top: propertyWithDangerouslyRemovedCssUnit("top") || container.offsetTop,
  };
};

export default computeBoxSize;
