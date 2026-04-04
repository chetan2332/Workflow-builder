# Workflow Execution – Implementation Checklist

Quick reference for where each feature lives (backend vs frontend) and what to build.

---

## Backend (NestJS + Prisma)

### Schema & DB
- [ ] **Prisma:** Add `WorkflowExecution`, `ExecutionNodeResult`, `PinnedNodeData` (see `WORKFLOW_EXECUTION_DESIGN.md`). Add `templateId` to `Node` if not already (or keep `config` with `templateId` inside). Run migration.
- [ ] **Workflow save:** Extend create/update workflow API to accept and store `nodes` and `edges` (with positions, `templateId`, `config`/actionState) so the execution engine can load the graph.

### Execution engine
- [ ] **DAG / levels:** From `nodes` + `edges`, compute level per node (topological sort). Reject if cycle.
- [ ] **Node runners:** One runner per node type (START, INPUT, FUNCTION, SWITCH, DO_NOTHING, IF):
  - Input: `Record<handleId, unknown[]>` (and node `config`).
  - Output: `Record<handleId, unknown[]>`.
  - FUNCTION/SWITCH: run user code in a sandbox (e.g. `vm2` or isolated-vm); define contract (e.g. `(item) => result` or `(arr) => arr`).
- [ ] **Run pipeline:** Load workflow → build DAG → if resume, load pin or execution outputs → for each level run all nodes in parallel (Promise.all) → persist `ExecutionNodeResult` per node → on error set status FAILED and stop.

### API
- [ ] **POST `/workflows/:id/run`**  
  Body: `{ resumeFromNodeId?: string, resumeFromExecutionId?: string }`.  
  Start execution; return `{ executionId }`. Optionally wait for completion or return immediately and let client poll.
- [ ] **GET `/workflows/:id/executions`**  
  List executions (paginated); return id, status, startedAt, finishedAt.
- [ ] **GET `/executions/:id`**  
  Execution + all `ExecutionNodeResult` (inputs, outputs, status, error).
- [ ] **POST `/workflows/:id/pin/:nodeId`**  
  Body: `{ outputs: Record<string, unknown[]> }`. Create/update pin for that node.
- [ ] **GET `/workflows/:id/pins`**  
  List pins (nodeId, updatedAt).
- [ ] **DELETE `/workflows/:id/pin/:nodeId`**  
  Remove pin.

---

## Frontend (React + React Flow)

### Run
- [ ] **Save before run:** Ensure workflow (nodes + edges + config) is persisted (e.g. PUT workflow with graph). Disable or warn “Run” if unsaved.
- [ ] **Run button:** Call `POST /workflows/:id/run`. Show loading; then redirect or open execution detail (e.g. `/workflows/:id/executions/:execId`).
- [ ] **Run options (optional):** Dropdown or dialog: “Run from start” | “Run from pinned: [node]” | “Run from execution: [list]”. Pass `resumeFromNodeId` or `resumeFromExecutionId` in body.

### Executions
- [ ] **Executions list:** Page or drawer `GET /workflows/:id/executions`. Table: execution id, status, startedAt, finishedAt, “View” link.
- [ ] **Execution detail:** Page or modal `GET /executions/:id`. Per-node cards: node id/label, status, inputs (JSON), outputs (JSON), error if failed. Option “Resume from this execution” (pick node) that triggers run with `resumeFromExecutionId` + node.

### Pinning
- [ ] **Pin data here:** On node (context menu or after run): “Pin data here” enabled when execution result exists for this node. Call `POST /workflows/:id/pin/:nodeId` with that node’s outputs from the chosen execution.
- [ ] **Run from pinned:** In run options, show “Run from pinned: [node labels]” using `GET /workflows/:id/pins`; on choose, send `resumeFromNodeId`.

### Data transport (no UI change)
- Array-in/array-out and parallel-by-level are **backend-only**. No change to React Flow nodes/edges for data transport; only run, executions, and pin UI.

---

## Order of implementation

1. **Backend:** Schema + migration → save workflow (nodes/edges) → execution engine (levels + runners for START, INPUT, then FUNCTION/SWITCH) → POST run + GET execution.
2. **Frontend:** Save workflow (if not already) → Run button → execution detail page.
3. **Backend:** Pins API → “run from pin” in engine.
4. **Frontend:** Executions list → Pin UI → “Run from pinned” / “Run from execution” in run options.
