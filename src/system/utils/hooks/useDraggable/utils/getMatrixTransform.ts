export interface IMatrixTransform {
  scaleX: number;
  skewY: number;
  skewX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
}

const getMatrixTransform = (styles: CSSStyleDeclaration): IMatrixTransform => {
  const values = styles
    .getPropertyValue("transform")
    .replace(/(m.*\()|(\))/g, "")
    .split(",")
    .map((prop) => parseFloat(prop.trim()));

  return {
    scaleX: values?.[0] ?? 1,
    skewY: values?.[1] ?? 0,
    skewX: values?.[2] ?? 0,
    scaleY: values?.[3] ?? 0,
    translateX: values?.[4] ?? 0,
    translateY: values?.[5] ?? 0,
  };
};

export default getMatrixTransform;
