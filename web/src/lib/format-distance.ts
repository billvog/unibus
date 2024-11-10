const formatter = new Intl.NumberFormat("el-GR", {
  style: "unit",
  unit: "kilometer",
  unitDisplay: "short",
  maximumFractionDigits: 1,
});

export function formatDistance(meters: number): string {
  return formatter.format(meters / 1000);
}
