export const commonOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#a6adbb" } },
    tooltip: { mode: "index", intersect: false },
  },
  elements: { line: { tension: 0.4 } },
  scales: {
    x: { ticks: { color: "#a6adbb" }, grid: { color: "#374151", drawBorder: false } },
    y: {
      beginAtZero: true,
      ticks: { color: "#a6adbb", stepSize: 1, precision: 0 },
      grid: { color: "#374151", drawBorder: false },
    },
  },
};

export const pieOptions = {
  plugins: { legend: { position: "right", labels: { usePointStyle: true, color: "#a6adbb" } } },
};

export const hBarOptions = {
  indexAxis: "y",
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: commonOptions.scales,
};