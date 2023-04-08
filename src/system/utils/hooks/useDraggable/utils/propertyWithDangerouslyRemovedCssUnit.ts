const propertyWithDangerouslyRemovedCssUnit = (
  style: CSSStyleDeclaration,
  property: string
) => parseFloat(style.getPropertyValue(property).replace(/px$/, ""));

export default propertyWithDangerouslyRemovedCssUnit;
