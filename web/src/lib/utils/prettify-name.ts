export const PrettifyName = (name: string) => {
  return name
    .replace("( ", "(")
    .replace(" )", ")")
    .replace("(", " (")
    .replace(")", ") ");
};
