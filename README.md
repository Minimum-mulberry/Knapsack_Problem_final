# 0/1 Knapsack Problem Visualizer

A web-based interactive visualization tool for understanding and solving the classic **0/1 Knapsack Problem** using Dynamic Programming (DP). 

🌍 **Live Demo:** [https://minimum-mulberry.github.io/Knapsack_Problem_final/](https://minimum-mulberry.github.io/Knapsack_Problem_final/)

## 🌟 Overview

The 0/1 Knapsack Problem involves selecting items with given weights and values to maximize total value without exceeding the bag’s capacity. Each item can either be taken or left (binary choice - 0/1), making it a fundamental optimization problem in computer science.

This project provides an educational platform to visualize how the Dynamic Programming algorithm efficiently solves this problem step-by-step, reducing exponential recursion to polynomial time.

## ✨ Features

- **Interactive Visualizer**: Step-by-step visualization of the DP table being populated.
- **Algorithm Execution Control**: Play, Pause, Next Step, and Reset controls to study the algorithm at your own pace.
- **Side-by-Step Code Tracing**: Real-time highlighting of the pseudocode as the DP table is updated.
- **Result Summary**: Clearly displays the final maximum value, total weight used, and the specific items selected.
- **Backtracking Visualization**: Highlights the path in the DP table to show which items were included in the final optimal solution.
- **Responsive Design**: Built with Bootstrap for a clean and mobile-friendly UI.

## 🛠️ Tech Stack

- **HTML**: Structure and content.
- **CSS** (Custom & Bootstrap 5): Styling, layout, and responsive design.
- **Vanilla JavaScript**: Core logic, DP algorithm implementation, and DOM manipulation for the visualizer.

## 🚀 How to Use

1. Clone or download the repository.
2. Open `index.html` in your preferred web browser. Alternatively, directly open `knapsackk.html` to jump into the visualizer.
3. In the Input Section, enter the **Number of Items**.
4. Input the **Weights** and **Values** arrays for the items (comma or space-separated).
5. Enter the maximum **Capacity** of the knapsack.
6. Click **Visualize** to generate the grid.
7. Use the algorithm execution **Controls** (`Start ▶`, `Pause ⏸`, `Next Step ⏭`, `Reset ⟲`) to study the algorithm at your own pace.
8. Follow along as the exact variables change with highlighted pseudocode.

## 🧩 Understanding the Algorithm

The visualizer illustrates the core DP state equation:

```
dp[i][w] = max( dp[i-1][w], value[i-1] + dp[i-1][w - weight[i-1]] )
```

- Each cell in the table shows the maximum value that can be achieved using the first `i` items with a total knapsack capacity of `w`.
- By tracing back from the final cell `dp[n][capacity]`, the optimal configuration of selected items is reconstructed.
