# Frontend UI Essentials – What to Build and Where to Show It

This doc answers: (1) Where do we show data flowing? (2) Where do we show execution history? (3) What essential UI is missing so the app works without confusion.

---

## 1. Where to show “data flowing” (so the user can pin)

**You do not show live data on the canvas.** Data appears only **after** a run, in one place: **Execution detail**.

- User runs the workflow → backend creates an execution and stores per-node inputs/outputs.
- User opens **Executions** → clicks one execution → **Execution detail** shows each node that ran with:
  - Node label
  - Status (completed / failed)
  - **Inputs** (per handle) and **Outputs** (per handle) – the actual data that flowed

That view is the only place the user “sees what data is flowing.” From there they can decide what to pin.

**Pin action:** In that same Execution detail, each node row has a **“Pin”** button. Clicking it pins that node’s **outputs** for this workflow. So: “see data” and “pin data” are in the **same screen** (Execution detail). No need to show data on the graph.

---

## 2. Where to show execution history

**One place: an Executions panel in the workflow editor.**

- **Location:** Right side of the editor (or a drawer that slides over the canvas). Not a new route for the basic version.
- **How to open:** A button in the **top bar**: e.g. **“Executions”** (or “Runs”). Click → panel opens.
- **Panel contents:**
  - **List:** Recent executions (e.g. 10–20): id or timestamp, status (Running / Completed / Failed). Click one row → show its **detail** in the same panel (below the list or replacing it).
  - **Detail:** For the selected execution: list of nodes with inputs, outputs, status, and **“Pin”** per node.

So: **Execution history = Executions panel in the editor.** No separate “Executions page” is required for the basic version.

---

## 3. Layout summary (what goes where)

| What | Where |
|------|--------|
| Edit graph, nodes, connections | Canvas (current) |
| Configure a node (action dialog) | Modal on double‑click (current) |
| Run workflow | Top bar **Run** (current) |
| Choose “from start” vs “from pin” | When **Run** is clicked: if pins exist, show small dialog/dropdown before calling API |
| List of past runs | **Executions panel** (open via top bar **Executions**) |
| See data that flowed (inputs/outputs per node) | **Execution detail** inside the Executions panel |
| Pin data at a node | **“Pin”** on that node’s row in **Execution detail** |

---

## 4. Essential things you’re missing (UI perspective)

These are the minimum so the UI doesn’t block or confuse.

### 4.1 Load workflow when opening the editor

- **Problem:** Today the editor starts with empty nodes/edges. If the user navigates to `/workflows/:id`, the backend has the workflow but the frontend never loads it.
- **Needed:** On mount (when `id` exists), call `GET /workflows/:id` (with nodes + edges), then set `setNodes` and `setEdges` from the response. Show a loading state until loaded; handle “not found.”

### 4.2 Save workflow (and tie it to Run)

- **Problem:** Save is TODO. Backend can’t run the graph it doesn’t have.
- **Needed:** **Save** sends current `nodes` and `edges` (including `data.actionState` / config) to the backend (e.g. PUT or PATCH workflow). Optionally: **Run** = save then POST run (so user doesn’t have to remember to save). At least: disable **Run** when the workflow is “dirty” (unsaved) or auto-save on Run.

### 4.3 Executions panel (list + detail)

- **Problem:** There is no place to see past runs or their data.
- **Needed:** One **Executions** panel (drawer or right panel) with:
  - List of executions (workflow id = current workflow).
  - On row click: show **Execution detail** (nodes with inputs, outputs, status, **Pin** button per node).

### 4.4 Run from start vs Run from pin

- **Problem:** If the user can pin but has no way to choose “run from start” vs “run from this pin,” the feature is incomplete.
- **Needed:** When the user clicks **Run**, if the workflow has at least one pin: show a small choice (dialog or dropdown): **“Run from start”** | **“Run from pinned: [Node A]”** (and list other pinned nodes if you support multiple). Then call the run API with or without `resumeFromNodeId`.

### 4.5 After Run: show the result

- **Problem:** User clicks Run and then doesn’t know where to see the result.
- **Needed:** After POST run succeeds, **open the Executions panel** and **select the new execution** (or show its detail). So the user immediately sees the run and can see data and pin.

### 4.6 Execution status and errors

- **Problem:** If a run fails, the user must see that it failed and why.
- **Needed:** In the execution list, show status (e.g. **Completed** / **Failed**). In Execution detail, show per-node status and the **error message** for the node that failed (and for the execution if you have one).

---

## 5. What you can skip for the basic version

- **Live data on the canvas** (e.g. values on edges or inside nodes during run) – not needed; Execution detail is enough.
- **Separate route for executions** (e.g. `/workflows/:id/executions`) – a panel in the editor is enough.
- **“Data preview” on hover** – not required for pinning; user opens an execution and sees data there.
- **Multiple pins per node** – one pin per node (last pin overwrites) is enough for basic.

---

## 6. Suggested order of implementation

1. **Load workflow** by id when opening editor; **Save** workflow (nodes + edges + config).
2. **Executions panel:** button in top bar, list of executions, click → detail (node list with inputs/outputs and status). Use mock or real API.
3. **Run:** call run API; after success open Executions panel and select the new run.
4. **Pin:** in Execution detail, “Pin” button per node → call pin API; show “Run from pinned” in run options when pins exist.
5. **Run from pin:** when Run is clicked and pins exist, show “Run from start” vs “Run from pinned: …” then call run with `resumeFromNodeId` when applicable.

This keeps “see data” and “pin” in one place (Execution detail) and keeps execution history in one place (Executions panel), without extra routes or canvas complexity.
