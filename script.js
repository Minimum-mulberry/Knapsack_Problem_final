// ====== GLOBAL CONTROL STATE ======
let playState = "stopped"; // "playing" | "paused" | "stopped"
let nextStep = false;
let stopRequested = false;

// Utility sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Wait function that respects controls
async function waitForControl(ms) {
  const interval = 50;
  let waited = 0;
  while (waited < ms) {
    if (stopRequested) return "stop";
    if (nextStep) {
      nextStep = false;
      return "next";
    }
    if (playState === "paused") {
      await sleep(interval);
      continue;
    }
    await sleep(interval);
    waited += interval;
  }
  return "ok";
}

// ====== BUTTON EVENT HANDLERS ======
document.getElementById("startBtn").onclick = () => {
  playState = "playing";
};
document.getElementById("pauseBtn").onclick = () => {
  playState = "paused";
};
document.getElementById("nextBtn").onclick = () => {
  playState = "paused";
  nextStep = true;
};
document.getElementById("resetBtn").onclick = () => {
  stopRequested = true;
  playState = "stopped";
  document.getElementById("visualizationArea").innerHTML = "";
  document.getElementById("stepBox").innerHTML =
    "💡 Steps will appear here while the algorithm runs.";
  document.getElementById("codeDisplay").innerHTML = "";
};

// ====== MAIN FUNCTION ======
function visualizeKnapsack() {
  // Reset state
  stopRequested = false;
  nextStep = false;
  playState = "paused";

  // Get inputs
  const numItems = parseInt(document.getElementById("numItems").value);
  const weightsInput = document.getElementById("weights").value;
  const valuesInput = document.getElementById("values").value;
  const capacity = parseInt(document.getElementById("capacity").value);

  const weights = weightsInput.split(/[ ,]+/).map(Number);
  const values = valuesInput.split(/[ ,]+/).map(Number);

  if (weights.length !== values.length || isNaN(numItems) || isNaN(capacity)) {
    alert("⚠️ Please enter valid inputs (matching weights & values, valid numbers)");
    return;
  }

  let dp = Array(numItems + 1)
    .fill(0)
    .map(() => Array(capacity + 1).fill(0));

  // 🧩 Create DP Table
  const table = document.createElement("table");
  table.className =
    "table table-sm table-bordered text-center align-middle w-auto rounded-table";

  // Header
  const headerRow = document.createElement("tr");
  const cornerCell = document.createElement("th");
  cornerCell.textContent = "No. of Items";
  cornerCell.style.backgroundColor = "#f1f3f5";
  headerRow.appendChild(cornerCell);
  for (let w = 0; w <= capacity; w++) {
    const th = document.createElement("th");
    th.textContent = w;
    th.style.backgroundColor = "#dee2e6";
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  // Rows
  for (let i = 0; i <= numItems; i++) {
    const row = document.createElement("tr");
    const th = document.createElement("th");
    th.style.backgroundColor = "#f8f9fa";
    th.textContent =
      i === 0 ? "0 (no items)" : `Item ${i} (w=${weights[i - 1]}, v=${values[i - 1]})`;
    row.appendChild(th);

    for (let w = 0; w <= capacity; w++) {
      const cell = document.createElement("td");
      cell.textContent = dp[i][w];
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  const vizArea = document.getElementById("visualizationArea");
  vizArea.innerHTML = "";
  vizArea.appendChild(table);

  // 💻 Code display
  const codeLines = [
    "for i = 1 to n:",
    "    for w = 1 to capacity:",
    "        if weight[i-1] <= w:",
    "            include = value[i-1] + dp[i-1][w - weight[i-1]]",
    "            exclude = dp[i-1][w]",
    "            dp[i][w] = max(include, exclude)",
    "        else:",
    "            dp[i][w] = dp[i-1][w]",
    "return dp[n][capacity]"
  ];
  const codeDisplay = document.getElementById("codeDisplay");
  codeDisplay.innerHTML = codeLines.map(line => `<div>${line}</div>`).join("");
  function highlightCode(lineIndex) {
    const lines = codeDisplay.querySelectorAll("div");
    lines.forEach((line, index) =>
      line.classList.toggle("highlight-line", index === lineIndex)
    );
  }

  // === MAIN DP LOOP WITH CONTROL ===
  async function fillDP() {
    const stepBox = document.getElementById("stepBox");

    for (let i = 1; i <= numItems; i++) {
      highlightCode(0);
      if ((await waitForControl(300)) === "stop") return;

      for (let w = 1; w <= capacity; w++) {
        highlightCode(1);
        table.rows[i + 1].cells[w + 1].style.backgroundColor = "#ffeb99";
        stepBox.innerHTML = `🔹 <b>Processing Item ${i}</b> (w=${weights[i - 1]}, v=${values[i - 1]}) for Capacity = <b>${w}</b>`;
        if ((await waitForControl(700)) === "stop") return;

        if (weights[i - 1] <= w) {
          highlightCode(2);
          const include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
          highlightCode(3);
          const exclude = dp[i - 1][w];
          highlightCode(4);

          stepBox.innerHTML += `<br>💡 Compare Include (${include}) vs Exclude (${exclude})`;
          if ((await waitForControl(800)) === "stop") return;

          highlightCode(5);
          dp[i][w] = Math.max(include, exclude);

          if (include > exclude) {
            stepBox.innerHTML += `<br>✅ Include chosen → dp[${i}][${w}] = ${dp[i][w]}`;
          } else {
            stepBox.innerHTML += `<br>🚫 Exclude chosen → dp[${i}][${w}] = ${dp[i][w]}`;
          }
        } else {
          highlightCode(6);
          dp[i][w] = dp[i - 1][w];
          stepBox.innerHTML = `❌ Item ${i} too heavy (w=${weights[i - 1]}) for Capacity = ${w}, copy from above → dp[${i}][${w}] = ${dp[i][w]}`;
          if ((await waitForControl(800)) === "stop") return;
        }

        table.rows[i + 1].cells[w + 1].textContent = dp[i][w];
        if ((await waitForControl(600)) === "stop") return;
        table.rows[i + 1].cells[w + 1].style.backgroundColor = "";
      }
    }

    // ✅ Done
    highlightCode(8);
    stepBox.innerHTML = `🏁 <b>Done!</b> Max value = <b>${dp[numItems][capacity]}</b>`;
    if ((await waitForControl(1000)) === "stop") return;

    const resultDiv = document.createElement("div");
    resultDiv.className = "alert alert-success mt-3 text-center";
    resultDiv.textContent = `✅ Maximum Value = ${dp[numItems][capacity]}`;
    document.getElementById("visualizationArea").appendChild(resultDiv);

    // Backtrack highlight
    let w = capacity;
    for (let i = numItems; i > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        table.rows[i + 1].cells[w + 1].style.backgroundColor = "#b0f2b4";
        table.rows[i + 1].cells[w + 1].style.transition =
          "background-color 0.6s ease";
        w -= weights[i - 1];
        if ((await waitForControl(500)) === "stop") return;
      }
    }
  }

  fillDP().then(() => {
    // ✅ Show summary
    let selectedItems = [];
    let totalWeight = 0;
    let totalValue = dp[numItems][capacity];
    let w = capacity;

    for (let i = numItems; i > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selectedItems.push(i);
        totalWeight += weights[i - 1];
        w -= weights[i - 1];
      }
    }
    selectedItems.reverse();

    const summaryCard = document.createElement("div");
    summaryCard.className =
      "card text-white bg-dark mb-3 mt-4 shadow-lg container";
    summaryCard.style.maxWidth = "22rem";
    summaryCard.innerHTML = `
      <div class="card-header text-center fw-bold fs-5">Result Summary</div>
      <div class="card-body">
        <p class="card-text"><strong>Total Value:</strong> ${totalValue}</p>
        <p class="card-text"><strong>Total Weight Used:</strong> ${totalWeight}</p>
        <p class="card-text"><strong>Items Selected:</strong> ${
          selectedItems.length > 0 ? selectedItems.join(", ") : "None"
        }</p>
      </div>
    `;
    document.getElementById("visualizationArea").appendChild(summaryCard);
  });
}