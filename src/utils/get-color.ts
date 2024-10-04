const COLORS = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
];

export const getColor = (index?: number): string => {
  if (index === undefined) {
    return COLORS[Math.floor(Math.random() * COLORS.length)]!;
  }

  return COLORS[index % COLORS.length]!;
};
