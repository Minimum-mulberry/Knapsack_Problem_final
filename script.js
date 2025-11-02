
function visualizeKnapsack() {
    
    alert("JS connected! ✅");
  
    // Get inputs
    const numItems = parseInt(document.getElementById("numItems").value);
    const weightsInput = document.getElementById("weights").value;
    const valuesInput = document.getElementById("values").value;
    const capacity = parseInt(document.getElementById("capacity").value);
  
    // Convert comma-separated (or space-separated) input to arrays
    const weights = weightsInput.split(/[ ,]+/).map(Number);
    const values = valuesInput.split(/[ ,]+/).map(Number);
  
    // Validate input lengths
    if (weights.length !== values.length || isNaN(numItems) || isNaN(capacity)) {
      alert("⚠️ Please enter valid inputs (matching weights & values, valid numbers)");
      return;
    }
  
    
    let dp = Array(numItems + 1)
      .fill(0)
      .map(() => Array(capacity + 1).fill(0));
  
    // Create and display empty DP table visually
    const table = document.createElement("table");
    table.className = "table table-bordered table-hover text-center align-middle";
    for (let i = 0; i <= numItems; i++) {
      const row = document.createElement("tr");
      for (let w = 0; w <= capacity; w++) {
        const cell = document.createElement("td");
        cell.textContent = dp[i][w];
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
  
    // Show table on page
    const vizArea = document.getElementById("visualizationArea");
    vizArea.innerHTML = "";
    vizArea.appendChild(table);

    // Fill the DP table using 0/1 Knapsack logic
async function fillDP() {
    for (let i = 1; i <= numItems; i++) {
      for (let w = 1; w <= capacity; w++) {
        // highlight current cell
        table.rows[i].cells[w].style.backgroundColor = "#ffeb99"; // light yellow
        
        await new Promise(resolve => setTimeout(resolve, 150)); // small delay
  
        if (weights[i - 1] <= w) {
          dp[i][w] = Math.max(
            values[i - 1] + dp[i - 1][w - weights[i - 1]],
            dp[i - 1][w]
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
  
        // update cell value
        table.rows[i].cells[w].textContent = dp[i][w];
  
        // reset color after short delay
        await new Promise(resolve => setTimeout(resolve, 100));
        table.rows[i].cells[w].style.backgroundColor = "";
      }
    }
  
    // Show final result
    const resultDiv = document.createElement("div");
    resultDiv.className = "alert alert-success mt-3 text-center";
    resultDiv.textContent = `✅ Maximum Value = ${dp[numItems][capacity]}`;
    document.getElementById("visualizationArea").appendChild(resultDiv);

    // 🟩 Highlight selected cells (backtracking)
let w = capacity;
for (let i = numItems; i > 0; i--) {
  if (dp[i][w] !== dp[i - 1][w]) {
    // Item i was included
    table.rows[i].cells[w].style.backgroundColor = "#b0f2b4"; // light green
    table.rows[i].cells[w].style.transition = "background-color 0.4s ease";
    w -= weights[i - 1];
  }
}
  }
  
// start animation
fillDP().then(() => {
  // find selected items
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

  // summary card
  const summaryCard = document.createElement("div");
  summaryCard.className = "card text-white bg-dark mb-3 mt-4 shadow-lg container";
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