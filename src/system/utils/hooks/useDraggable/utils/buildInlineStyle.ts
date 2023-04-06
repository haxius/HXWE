const buildInlineStyle = (styles: Map<string, string>): string =>
  Array.from(styles.entries())
    .map(([property, value]) => `${property}: ${value}`)
    .join("; ");

export default buildInlineStyle;
