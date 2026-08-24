export function computeBins(values: number[], nBins = 40) {
  if (values.length === 0) return { labels: [] as string[], counts: [] as number[], min: undefined as number | undefined, binWidth: undefined as number | undefined };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binWidth = (max - min) / nBins || 1;
  const counts = new Array<number>(nBins).fill(0);
  values.forEach((v) => {
    const idx = Math.min(nBins - 1, Math.floor((v - min) / binWidth));
    counts[idx]++;
  });
  const labels = counts.map((_, i) => ((min + (i + 0.5) * binWidth) * 100).toFixed(1) + "%");
  return { labels, counts, min, binWidth };
}
