# Workflow Execution & Data Transport Design

This document describes how data flows through the workflow, how nodes run (sequentially per node, in parallel across nodes), how to pin data for resuming, and how executions are stored.

---

## 1. Data Transport Model

### 1.1 Payload shape

- **Per edge (or per connection):** Data flows as **arrays of items**.
- Each **source handle** produces one array: `outputs: unknown[]`.
- Each **target handle** receives one array: `inputs: unknown[]`.

So conceptually:
- **Edge** = one array flows from source output handle → target input handle.
- **Node** receives one or more input arrays (one per input handle). It **merges** them according to the node type (e.g. zip, concatenate, or single-array from the only input).
- The node **iterates sequentially** over its effective input list (see below), runs its logic once per item (or per batch), and **appends** results to one or more output arrays (one per output handle).

### 1.2 Per-node semantics

- **Inputs:** For each input handle, the node has an array `input_handle_id → unknown[]`. If multiple edges connect to the same input handle, their arrays are **concatenated** in a defined order (e.g. by edge creation order or by source node id).
- **Processing:** The node runs its logic (e.g. function, switch) **sequentially** over the combined input (e.g. for each item, or for the whole array, depending on node kind). No parallel execution *within* a single node.
- **Outputs:** For each output handle, the node **appends** to an array. So `output_handle_id → unknown[]`. Downstream nodes receive these arrays on their input handles.

### 1.3 Example

- **Start** has no inputs; it produces one array, e.g. `[{ trigger: true }]` or initial payload.
- **Input** (static) produces one array, e.g. `[{ text: "hello" }]` from `actionState.text`.
- **Function** with one input and one output: receives one array on `in-1`, runs `code` for each item (or once with the array), appends results to `out`.
- **Switch** with one input and N outputs: for each input item, evaluates `code` and appends that item to exactly one of the output arrays (e.g. `out-1`, `out-2`, …).

So:
- **Array in → sequential iteration → append to array out** is the core contract.
- Backend execution engine must know each node’s template (e.g. START, INPUT, FUNCTION, SWITCH) and call the right runner that respects this contract.

---

## 2. Parallel Execution (Different Nodes in Parallel)

- The workflow is a **DAG** (directed acyclic graph). Execution is by **levels**:
  - **Level 0:** Nodes with no incoming edges (Start, Input nodes).
  - **Level k:** Nodes whose all predecessors have finished (all their incoming edges have data).
- **Within a level:** run all nodes **in parallel** (e.g. Promise.all / worker pool / queue).
- **Between levels:** wait for the whole level to finish, then pass the output arrays along edges to the next level and start the next level.

So:
- **Frontend:** No change to graph; validation already ensures connections. Optional: show “level” or “layer” in the UI for debugging.
- **Backend:** Before execution, compute a topological order or level assignment from edges. Then execute level-by-level, in parallel within each level.

---

## 3. Pinning Data (Resume From a Checkpoint)

- **Pin** = store the **output arrays** of one or more nodes at a point in time, so a future run can **start from that point** instead of from the graph roots.
- Two possible granularities:
  - **Pin at a node:** Store that node’s outputs (per handle) as the new “initial” data for downstream. When “Run from here”, the engine treats that node as a synthetic root: no need to run any predecessor.
  - **Pin at execution:** Store the full state (all node outputs) at the end of a run, and allow “Resume from this execution” so the next run reuses that state as the starting point (e.g. only re-run from a chosen node onward).

Suggested minimal design:
- **Pinned checkpoint** = workflow id + optional execution id + **node id** + **output payload** (e.g. `{ handleId: unknown[] }`).
- **Run options:** “Run from start” (default) vs “Run from pinned node X” (and optionally “Run from execution E”).
- Backend: when starting a run, if “resume from node N” is set, load pinned data for N and treat N’s outputs as the inputs for all edges that start at N (i.e. downstream nodes get their input arrays from the pin). No need to run N or any of its predecessors.

Implementation:
- **Backend:** New table or JSON field to store pins (see schema below). Endpoint to create/update/delete pin for a node; run endpoint accepts `resumeFromNodeId` (and optionally `resumeFromExecutionId`).
- **Frontend:** In the editor, a “Pin data here” on a node (and/or “Use this execution as start”) and a run dialog with “Run from start” / “Run from pinned” / “Run from execution X”.

---

## 4. Storing Each Execution

- **Execution** = one run of a workflow (from start or from a pin).
- Store:
  - Workflow id, status (running / completed / failed), timestamps, who triggered it (if applicable).
  - Optionally: trigger type (manual, from pin, from execution), `resumeFromNodeId`, `resumeFromExecutionId`.
- **Per-node results:** For each node that was run, store:
  - Node id, execution id.
  - **Inputs** (per handle) and **outputs** (per handle) — the arrays that were consumed and produced.
  - Status, error message if failed, duration.

This allows:
- **Execution history list:** List executions for a workflow (backend + frontend).
- **Execution detail:** Inspect inputs/outputs per node for a given run (backend + frontend).
- **Resume from execution:** Use a past execution’s node outputs as pinned data for a new run (optional).

Suggested schema (Prisma) is in the next section.

---

## 5. Backend Implementation Outline

### 5.1 Prisma schema additions

```prisma
// Execution of a workflow (full run or resume)
model WorkflowExecution {
  id              String   @id @default(cuid())
  workflowId      String
  workflow        Workflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  status          String   // RUNNING | COMPLETED | FAILED
  startedAt       DateTime @default(now())
  finishedAt     DateTime?
  triggeredBy     String?  // optional user id
  resumeFromNodeId    String?  // if resuming from a pin
  resumeFromExecutionId String?

  nodeResults     ExecutionNodeResult[]
}

// Per-node result for one execution (inputs + outputs arrays)
model ExecutionNodeResult {
  id             String   @id @default(cuid())
  executionId    String
  execution      WorkflowExecution @relation(fields: [executionId], references: [id], onDelete: Cascade)
  nodeId         String   // workflow node id (from editor)
  status         String   // PENDING | RUNNING | COMPLETED | FAILED | SKIPPED
  inputs         Json     // { "handleId": [ ... ] }
  outputs        Json     // { "handleId": [ ... ] }
  error          String?
  startedAt      DateTime?
  finishedAt     DateTime?
}

// Pinned data at a node (for "run from here")
model PinnedNodeData {
  id             String   @id @default(cuid())
  workflowId     String
  workflow       Workflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  nodeId         String   // which node this pin is for
  outputs        Json     // { "handleId": [ ... ] }
  updatedAt      DateTime @updatedAt
  @@unique([workflowId, nodeId])
}
```

Add to `Workflow`:

```prisma
model Workflow {
  // ... existing fields
  executions     WorkflowExecution[]
  pinnedData     PinnedNodeData[]
}
```

### 5.2 Execution engine (high level)

1. **Load workflow:** nodes + edges from DB (with `config` per node).
2. **Build DAG:** Compute levels (topological sort). Validate no cycles.
3. **Resolve initial inputs:**
   - If “run from start”: roots (no incoming edges) get their initial arrays (Start: one item, Input: from config, etc.).
   - If “run from pin”: load `PinnedNodeData` for the given node; that node’s outputs become the data on all edges leaving that node. Mark that node and all its predecessors as SKIPPED; start execution from the next level (downstream of the pinned node).
4. **Level-by-level execution:**
   - For each level, for each node in that level, gather input arrays from incoming edges (from previous level outputs or from pin).
   - Run each node in the level in parallel (e.g. `Promise.all`). Each node runner:
     - Receives `inputs: Record<handleId, unknown[]>`.
     - Applies node logic (sequential over the combined input), produces `outputs: Record<handleId, unknown[]>`.
     - Persist `ExecutionNodeResult` (inputs, outputs, status).
   - Push output arrays to outgoing edges; continue to next level.
5. **On error:** Mark execution and current node as FAILED, store error, optionally abort rest of run.

### 5.3 API endpoints (suggested)

| Method | Path | Purpose |
|--------|------|--------|
| POST | `/workflows/:id/run` | Start execution (body: `{ resumeFromNodeId?, resumeFromExecutionId? }`). Return execution id. Optionally use SSE or polling for status. |
| GET | `/workflows/:id/executions` | List executions (paginated). |
| GET | `/executions/:id` | Get execution + node results (inputs/outputs). |
| POST | `/workflows/:id/pin/:nodeId` | Create/update pinned data for node (body: `{ outputs }`). |
| GET | `/workflows/:id/pins` | List pins for workflow. |
| DELETE | `/workflows/:id/pin/:nodeId` | Remove pin for node. |

### 5.4 Node runners

- **START:** Output `[{ type: 'start', ... }]` or from config.
- **INPUT:** Output `[{ text: actionState.text }]` (or similar).
- **FUNCTION:** Run user `code` in a sandbox (e.g. vm2, isolated-vm, or subprocess). Contract: receive array, return array (append per item or transform whole array). Must define a clear protocol (e.g. `(inputItem) => outputItem` or `(inputArray) => outputArray`).
- **SWITCH:** For each input item, evaluate `code` (e.g. return case index or key); append item to the corresponding output handle array.
- **DO_NOTHING / IF:** Same idea: define input/output contract and implement.

Backend needs a small **runner registry** by `nodeTypeId` and the actual execution function that respects the array-in / sequential / array-out contract.

---

## 6. Frontend Implementation Outline

### 6.1 Run workflow

- **Editor:** “Run” button already exists; wire it to `POST /workflows/:id/run` (with workflow id from route). Send current graph (or rely on saved graph in DB). If save is required before run, enforce “Save then Run”.
- **Run options (optional):** Dialog or dropdown: “Run from start” | “Run from pinned: [node label]” | “Run from execution: [list]”. Pass `resumeFromNodeId` or `resumeFromExecutionId` in the body.
- **Progress:** Poll `GET /executions/:id` or use SSE to show status (running / completed / failed) and which nodes have finished.

### 6.2 Execution history

- New view or drawer: “Executions” for this workflow. Call `GET /workflows/:id/executions`. Show table: id, status, startedAt, finishedAt, duration.
- Click an execution → “Execution detail”: list of nodes with their inputs/outputs (collapsible JSON or table). Option to “Resume from this execution” (choose which node to resume from).

### 6.3 Pinning

- On a node (e.g. context menu or toolbar): “Pin data here”. Only enabled when there is at least one completed execution that includes this node. Frontend calls backend to get that execution’s outputs for this node (or the user runs once, then “Pin current outputs here”).
- Alternatively: after a run, show “Pin” next to each node in the execution detail; clicking sends that node’s outputs to `POST /workflows/:id/pin/:nodeId`.
- “Run from pinned” uses the pin when starting the next run.

### 6.4 Data transport (no change to graph)

- Data transport is **backend-only** (arrays on edges, sequential per node, parallel by level). The frontend only:
  - Saves/loads the graph (nodes + edges + `actionState`/config).
  - Triggers run with options (from start / from pin / from execution).
  - Displays execution list and per-node inputs/outputs.

No need to change React Flow or node shapes for the basic data model; only optional UI for levels, pins, and run options.

---

## 7. Summary

| Requirement | Implementation |
|-------------|----------------|
| Array in, sequential iteration, append to array out | Backend node runners: each node gets `Record<handleId, unknown[]>`, runs logic sequentially, returns `Record<handleId, unknown[]>`; engine wires outputs to downstream inputs. |
| Different nodes in parallel | DAG levels; run all nodes in the same level in parallel; wait for level to finish before next level. |
| Pin data to avoid starting from scratch | `PinnedNodeData` table; “Run from node X” uses pinned outputs as initial data for downstream; skip upstream nodes. |
| Store each execution | `WorkflowExecution` + `ExecutionNodeResult`; list/detail APIs; optional “Resume from execution”. |

Next steps: implement Prisma migration, execution engine (level computation + node runners), run/pin/execution endpoints, then frontend run button, execution list/detail, and pin UI.
