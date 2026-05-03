const counts = new Array(20).fill(0);
let totalRolls = 0;
let autoRunning = false;
let calloutShown = false;
let autoTimer = null;
const ctx = document.getElementById("lln-chart").getContext("2d");
const chart = new Chart(ctx, {
  data: {
    labels: Array.from(
    {
      length: 20 },

    (_, i) => i + 1),

    datasets: [
    {
      type: "bar",
      label: "Observed %",
      data: new Array(20).fill(0),
      backgroundColor: "#39FF14",
      borderWidth: 0,
      borderRadius: 2,
      order: 2 },

    {
      type: "line",
      label: "True 5%",
      data: new Array(20).fill(5),
      borderColor: "#D4A017",
      borderWidth: 1.5,
      borderDash: [5, 4],
      pointRadius: 0,
      fill: false,
      tension: 0,
      order: 1 }] },



  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          font: {
            size: 10 },

          maxRotation: 0,
          color: "#D4A017" },

        grid: {
          display: false },

        border: {
          color: "rgba(212,160,23,0.3)" } },


      y: {
        min: 0,
        max: 30,
        ticks: {
          callback: v => v + "%",
          font: {
            size: 10 },

          stepSize: 5,
          color: "#D4A017" },

        grid: {
          color: "rgba(212,160,23,0.1)" },

        border: {
          color: "rgba(212,160,23,0.3)" } } },



    plugins: {
      legend: {
        display: false },

      tooltip: {
        backgroundColor: "#0D1B2A",
        borderColor: "#D4A017",
        borderWidth: 1,
        titleColor: "#D4A017",
        bodyColor: "#D4A017",
        callbacks: {
          label: item => {
            if (item.datasetIndex === 0) {
              return ` ${item.parsed.y.toFixed(1)}%  (${
              counts[item.dataIndex]
              } rolls)`;
            }
            return ` True probability: 5%`;
          } } } } } });






function rollOnce() {
  const face = Math.floor(Math.random() * 20);
  counts[face]++;
  totalRolls++;
}

function updateChart() {
  const pcts = counts.map((c) =>
  totalRolls > 0 ? parseFloat((c / totalRolls * 100).toFixed(2)) : 0);

  chart.data.datasets[0].data = pcts;
  const maxPct = Math.max(...pcts, 10);
  chart.options.scales.y.max = Math.ceil((maxPct + 3) / 5) * 5;
  chart.update("none");
  document.getElementById("n-count").textContent = totalRolls.toLocaleString();
  if (totalRolls > 0) {
    const maxVal = Math.max(...counts);
    const minVal = Math.min(...counts);
    document.getElementById("most-rolled").textContent =
    counts.indexOf(maxVal) + 1;
    document.getElementById("least-rolled").textContent =
    counts.indexOf(minVal) + 1;
  }
  document.getElementById("face-pcts").innerHTML = pcts.
  map(p => `<div>${p.toFixed(1)}</div>`).
  join("");
  if (totalRolls >= 100 && !calloutShown) {
    document.getElementById("callout-100").style.display = "block";
    calloutShown = true;
  }
}

function rollN(n) {
  for (let i = 0; i < n; i++) rollOnce();
  updateChart();
}

function toggleAuto() {
  autoRunning = !autoRunning;
  var btn = document.getElementById("btn-auto");
  if (autoRunning) {
    btn.textContent = "Auto [pause]";
    autoStep();
  } else {
    btn.textContent = "Auto [play]";
    if (autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
    }
  }
}

function autoStep() {
  if (!autoRunning) return;
  const batch =
  totalRolls < 30 ? 1 : totalRolls < 100 ? 3 : totalRolls < 500 ? 10 : 50;
  const delay = totalRolls < 30 ? 180 : totalRolls < 100 ? 80 : 30;
  for (let i = 0; i < batch; i++) rollOnce();
  updateChart();
  autoTimer = setTimeout(autoStep, delay);
}

function resetAll() {
  counts.fill(0);
  totalRolls = 0;
  calloutShown = false;
  autoRunning = false;
  if (autoTimer) {
    clearTimeout(autoTimer);
    autoTimer = null;
  }
  document.getElementById("btn-auto").textContent = "Auto [play]";
  document.getElementById("callout-100").style.display = "none";
  document.getElementById("n-count").textContent = "0";
  document.getElementById("most-rolled").textContent = "—";
  document.getElementById("least-rolled").textContent = "—";
  document.getElementById("face-pcts").innerHTML = "";
  chart.data.datasets[0].data = new Array(20).fill(0);
  chart.options.scales.y.max = 30;
  chart.update("none");
}