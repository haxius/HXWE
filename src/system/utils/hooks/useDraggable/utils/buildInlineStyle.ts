const buildInlineStyle = (
  styles:
    | Map<string, string | undefined>
    | [string, string | undefined][]
    | { [key: string]: string | undefined }
): string =>
  (styles instanceof Map
    ? Array.from(styles.entries())
    : styles instanceof Array
    ? styles
    : Object.entries(styles)
  )
    .filter((entry) => entry?.[1] !== undefined)
    .map(([property, value]) => `${property}: ${value}`)
    .join("; ");

export default buildInlineStyle;
