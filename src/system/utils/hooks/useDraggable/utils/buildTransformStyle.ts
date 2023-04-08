const buildTransformStyle = (
  transforms:
    | Map<string, string | undefined>
    | [string, string | undefined][]
    | { [key: string]: string | undefined }
): string =>
  (transforms instanceof Map
    ? Array.from(transforms.entries())
    : transforms instanceof Array
    ? transforms
    : Object.entries(transforms)
  )
    .filter((entry) => entry?.[1] !== undefined)
    .map(([property, value]) => `${property}(${value})`)
    .join(" ");

export default buildTransformStyle;
