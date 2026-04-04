# Workflow nodes — specification

This document is the single source of truth for **node library** definitions: three synchronized layers per `nodeTypeId`, validation rules, and UX copy. Implementation details (execution engine, edge payload arrays) will evolve later; handle **types** and **configuration field types** are declared here so the editor, validator, and runner stay aligned.

---

## Two IDs (do not confuse)

| | **nodeTypeId** (static) | **nodeInstanceId** (dynamic) |
|--|-------------------------|------------------------------|
| **What** | Identifies the *kind* of node in the library | Identifies one node *instance* inside a workflow |
| **Scope** | Same string in every workflow | Unique per node on the canvas |
| **Defined by** | This document + node library / `node-config` | Frontend when the user drops a node |
| **Examples** | `trigger.start`, `control.if`, `action.http` | uuid or nanoid |

The JSON `nodeId` in `apps/web/src/node-config/*.json` (e.g. `START`, `IF`) is the **file key** today; **`nodeTypeId`** is the stable catalog id. Implementations may map file keys → `nodeTypeId` when loading.

---

## Glossary

### What is `paletteGroup`?

**`paletteGroup`** is the **bucket label in the node palette** (sidebar or picker when the user adds a node). It does not affect execution. It only groups templates for discovery.

Suggested values:

| paletteGroup | Use for |
|----------------|---------|
| `Trigger` | Workflow entry nodes |
| `Control` | Branching, routing, transform |
| `Input & utility` | Constants, sinks, glue |
| `Action` | HTTP, code, file, LLM, etc. |

You can add more (e.g. `Integrations`) without changing the backend `category` enum.

### What is `flow` in handle data types?

Handles declare a **data type** so edges connect compatible endpoints.

| Type | Meaning |
|------|---------|
| **`flow`** | **Execution / control signal** — “this step runs after that one.” Payload is minimal or empty; ordering and branching are the point. Use for triggers, If/Switch branches, and any edge that only means “activate next.” |
| **`json`** | **Structured data** — arbitrary JSON (objects, arrays, primitives) passed between nodes. Use when downstream nodes read fields (Function, HTTP body, LLM prompt context, etc.). |

**Why it matters:** mixing `flow` and `json` on the same edge should be invalid or explicitly bridged (future: “gate” nodes). Today the editor may only check string equality; later you can enforce `flow`↔`flow` and `json`↔`json` (or a declared supertype).

---

## Canvas shapes (`shape`)

Shapes control **render style** on the graph (size, icon placement, optional **inline label**).

| `shape` | Visual | Typical use |
|---------|--------|----------------|
| `circle` | Circle | If, Switch, Input, Do Nothing |
| `d` | D-shaped (one flat edge, “capsule” / opposite-D style) | **Start** (trigger) |
| `roundedRectangle` | Standard rounded rect | Function, HTTP, File, Transform |
| `llmCard` | **Larger** rounded rectangle than `roundedRectangle`, with **room for short text inside** (e.g. model name or “LLM”) | **LLM** node |

Implementation note: `llmCard` is a **variant of rounded rect** with increased min size + typography for inline preview text (not a second title bar).

---

## Configuration field types (Layer 3 template)

Use this **vocabulary** when describing `actionState` / persisted `config`. Each **field** can declare:

| Property | Purpose |
|----------|---------|
| `key` | Stable key in JSON (`actionState[key]`) |
| `fieldType` | One of the types below |
| `label` | Form label |
| `required` | boolean |
| `default` | Optional default |
| `validation` | Optional: regex, min/max, JSON Schema ref, etc. |
| `visibility` | Optional: `always` \| `advanced` (collapsed section) |

### Standard `fieldType` values

| fieldType | Storage | UI control (typical) | Notes |
|-----------|---------|----------------------|--------|
| `string` | string | Single-line input | Short text |
| `text` | string | Multi-line textarea | Long text, prompts |
| `number` | number | Number input | Counts, ports |
| `boolean` | boolean | Toggle | Feature flags |
| `enum` | string | Select / radio | Fixed set; declare `options: { value, label }[]` |
| `json` | string (serialized JSON) | Textarea + format button | Validate JSON on blur |
| `code` | string | Code editor (language from `language` param) | Condition / function / switch body |
| `url` | string | URL input | Normalize, validate scheme |
| `httpMethod` | string | Select | GET, POST, … |
| `keyValue` | Array `{ key, value }` or Record | Key-value editor | Headers, query params |
| `secretRef` | string (id) | “Pick secret” + masked | Never store raw secret in workflow JSON |
| `credentialRef` | string (id) | Credential picker | OAuth / API keys registry |
| `fileRef` | string (file id) | File picker (uploaded files) | |
| `modelRef` | string (model id) | Model picker | LLM catalog |
| `handleCount` | number | Number + preview | Renames dynamic handles (`inputHandleCount`, …) |
| `handleLabels` | string \| string[] | Text or tag input | Comma-separated or repeated labels |
| `triggerInvokeInfo` | derived / read-only | URL + method + copy button | Not stored as user text; computed from workflow + env |

### Typed objects (where the spec is still thin)

For **structured payloads** (HTTP response shape, LLM message list, custom objects), prefer declaring:

- **`json` field** + **JSON Schema** (or a named schema id like `schemas/httpResponse.v1`) for validation and autocomplete later.
- Or **`fieldType: object`** with **`properties`** (nested keys) — same idea, different encoding.

**Gap today:** most nodes only list `json` / `code` loosely. The **Problems** subsection under each node calls out missing schemas.

---

## Workflow validity (high level)

Later, a workflow will be **runnable** only if it has a **trigger** and no **error** state on any node **reachable** from that trigger. This document focuses on **per-node** shape and validation; reachability is out of scope here.

---

## Validation model (this phase)

| Severity | When |
|----------|------|
| **Error** | Any **required** field in Layer 3 is missing or invalid. |
| **Warning** | Optional field empty (if you surface it), **or** an **input handle** has no incoming edge. |
| **Tooltip (hover)** | In both cases: show what is wrong (missing fields, unwired handles). No external docs link. |

No cross-node validation yet.

---

## Execution (declarative; UI later)

- The engine runs workflows and **individual nodes**.
- Double-click opens a dialog with **configuration**, **Execute node** (only in this context), and later **inputs (left)** / **outputs (right)** after a test run.
- Retry logic is **not** in scope.

---

## Three layers (stay in sync)

### Layer 1 — Catalog / editor

| Field | Purpose |
|-------|---------|
| `nodeTypeId` | Stable static id |
| `displayName` | Palette + default label |
| `category` | `TRIGGER` \| `CODE` \| `CONDITION` \| `OTHER` (backend enum) |
| `subtitle` | Short line on the node |
| `description` | One-sentence overview |
| `shape` | See [Canvas shapes](#canvas-shapes-shape) |
| `paletteGroup` | Palette bucket (see glossary) |
| `definitionVersion` | Bump when Layer 2/3 contract changes |

### Layer 2 — Graph contract

| Field | Purpose |
|-------|---------|
| `inputPolicy` | At most **one incoming edge per input handle** |
| `handles` | `id`, `kind`, **dataType** (`flow` \| `json`), `label` |
| `dynamicHandles` | Which config keys change handle count/labels |
| `branching` | For branch nodes: how outputs are chosen |

### Layer 3 — Configuration

| Field | Purpose |
|-------|---------|
| `fields[]` | Each uses [Configuration field types](#configuration-field-types-layer-3-template) |
| `errors` | Required violations |
| `warnings` | Optional gaps + unwired inputs |

---

## Global template (per node)

```
### <displayName> (`nodeTypeId`)

**Layer 1 — Catalog** — nodeTypeId, displayName, category, subtitle, description, shape, paletteGroup, definitionVersion

**Layer 2 — Graph** — handles table, dynamicHandles, branching

**Layer 3 — Configuration** — table of fields (key, fieldType, required, notes)

**Double-click UI** — regions + controls + **parameters needed**

**Gaps / problems** — missing types, schemas, or UX not yet specified

**Execution (stub)** — role, bindings
```

---

## Node list

| nodeTypeId | displayName | paletteGroup |
|------------|-------------|--------------|
| `trigger.start` | Start | Trigger |
| `input.value` | Input | Input & utility |
| `control.if` | If | Control |
| `control.switch` | Switch | Control |
| `action.code` | Function | Action |
| `control.transform` | Transform | Control |
| `utility.noop` | Do Nothing | Input & utility |
| `action.http` | HTTP request | Action |
| `action.file` | File | Action |
| `action.llm` | LLM | Action |

---

## Node definitions

### Start (`trigger.start`)

**Layer 1 — Catalog**

- nodeTypeId: `trigger.start`
- displayName: Start
- category: TRIGGER
- subtitle: Run workflow (manual · API)
- description: Entry point for the workflow; start with JSON payload via **Run** in the app or via **HTTP API** (same node — two ways to invoke).
- shape: `d`
- paletteGroup: Trigger
- definitionVersion: 2

**Layer 2 — Graph**

- inputPolicy: no inputs
- handles:

  | id | kind | dataType | label | notes |
  |----|------|----------|-------|-------|
  | out | output | json | start | Initial payload to downstream |

- dynamicHandles: none
- branching: n/a

**Layer 3 — Configuration**

| key | fieldType | required | Notes |
|-----|-----------|----------|--------|
| `samplePayload` | json | optional | JSON for **test runs** in the dialog; validates when non-empty |
| `description` | string | optional | User note (shown in palette/detail only) |

**Invoke (manual + API)** — not separate nodes:

| Concern | How |
|---------|-----|
| Manual | User runs workflow from UI; payload editor uses `samplePayload` or ad-hoc input per run |
| API | **Read-only** in dialog: method + URL template + **Copy** (from [triggerInvokeInfo](#configuration-field-types-layer-3-template)); resolved from workflow id + deployment base URL |

**Double-click UI (layout)**

```
┌─────────────────────────────────────────────────────────────┐
│ Start                                              [Execute] │
├─────────────────────────────────────────────────────────────┤
│ LEFT (inputs / context)    │ RIGHT (outputs / invoke)       │
│ — (no upstream)            │ • Out: payload preview         │
│                            │ • **API**: METHOD + URL [Copy] │
│                            │   (read-only; parameters:      │
│                            │   workflowId, baseUrl from app)  │
├────────────────────────────┴────────────────────────────────┤
│ Sample payload (JSON)  [format] [validate]                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ { }                                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Description (optional) [________________________]             │
└─────────────────────────────────────────────────────────────┘
```

**Parameters needed for API block:** `workflowId`, `apiBaseUrl` (from app config), optional `auth` scheme description (not secret value).

**Gaps / problems**

- No **JSON Schema** for payload shape (only freeform JSON).
- **Auth** for API (Bearer, HMAC) not declared per workflow.
- **Rate limits / idempotency** not in scope but will matter for production.

---

### Input (`input.value`)

**Layer 1 — Catalog**

- nodeTypeId: `input.value`
- displayName: Input
- category: OTHER
- subtitle: Static value
- description: Emits a configured value downstream.
- shape: `circle`
- paletteGroup: Input & utility
- definitionVersion: 1

**Layer 2 — Graph**

| id | kind | dataType | label |
|----|------|----------|-------|
| out | output | json | out |

**Layer 3 — Configuration**

| key | fieldType | required | Notes |
|-----|-----------|----------|--------|
| `valueKind` | enum (`text`, `number`, `boolean`, `json`) | optional | default `text`; drives parser |
| `text` | string | required* | *Required if valueKind is text |
| `number` | number | conditional | if valueKind number |
| `json` | json | conditional | if valueKind json |

**Double-click UI**

```
┌─────────────────────────────────────────────────────────────┐
│ Input                                              [Execute] │
├───────────────────────────┬─────────────────────────────────┤
│ (no inputs)               │ Output preview: resolved value   │
├───────────────────────────┴─────────────────────────────────┤
│ Value type: [ text ▼ ]                                      │
│ Value: [________________________________]                    │
└─────────────────────────────────────────────────────────────┘
```

**Gaps / problems**

- **Typing:** output should be a **tagged union** in the engine (`{ type: 'string', value: string }` | …); not fully specified.
- Multiline vs single line not separated (could add `text` vs `textarea`).

---

### If (`control.if`)

**Layer 1 — Catalog**

- nodeTypeId: `control.if`
- displayName: If
- category: CONDITION
- subtitle: True / false branch
- description: Routes to one of two outputs using condition code.
- shape: `circle`
- paletteGroup: Control
- definitionVersion: 1

**Layer 2 — Graph**

| id | kind | dataType | label |
|----|------|----------|-------|
| in-* | input | json | in (merge upstream context) |
| out-true | output | flow | true |
| out-false | output | flow | false |

- dynamicHandles: `inputHandleCount` (`handleCount`, default 1)
- branching: evaluate `code` → boolean → exactly one of `out-true` / `out-false` fires

**Layer 3 — Configuration**

| key | fieldType | required | Notes |
|-----|-----------|----------|--------|
| `inputHandleCount` | handleCount | optional | default 1, min 1 |
| `code` | code | required | language from engine (`expression` / `js`) |

**Double-click UI**

```
┌─────────────────────────────────────────────────────────────┐
│ If                                                 [Execute] │
├───────────────────────────┬─────────────────────────────────┤
│ Inputs: in-1 … in-N       │ Outputs: true | false           │
│ (preview of merged JSON)  │ (after run: which branch fired) │
├───────────────────────────┴─────────────────────────────────┤
│ Number of inputs: [ 1 ]                                      │
│ Condition (code):                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                          │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Gaps / problems**

- **Context type** for `code` (what identifiers exist: `payload`, `prev`, …) not formalized.
- Mixed `flow`/`json` on outputs vs inputs — may need both json in + flow out for ordering only; **review** when engine exists.

---

### Switch (`control.switch`)

**Layer 1 — Catalog**

- nodeTypeId: `control.switch`
- displayName: Switch
- category: CONDITION
- subtitle: Multi-case branch
- description: Routes to exactly one of N outputs using switch code.
- shape: `circle`
- paletteGroup: Control
- definitionVersion: 1

**Layer 2 — Graph**

| id | kind | dataType | label |
|----|------|----------|-------|
| in-* | input | json | in |
| out-* | output | flow | case labels |

- dynamicHandles: `inputHandleCount`, `outputHandleCount`, `outputLabels` (`handleLabels`)

**Layer 3 — Configuration**

| key | fieldType | required | Notes |
|-----|-----------|----------|--------|
| `inputHandleCount` | handleCount | optional | default 1 |
| `outputHandleCount` | handleCount | optional | default 1 |
| `outputLabels` | handleLabels | optional | length should match output count → warning if not |
| `code` | code | required | returns case index or key |

**Double-click UI**

```
┌─────────────────────────────────────────────────────────────┐
│ Switch                                             [Execute] │
├───────────────────────────┬─────────────────────────────────┤
│ Inputs                    │ Outputs: case 1 … case N         │
├───────────────────────────┴─────────────────────────────────┤
│ Inputs count: [ ]  Outputs count: [ ]                          │
│ Labels (comma-separated): [____________]                      │
│ Switch expression:                                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Gaps / problems**

- **Return type contract** for `code` (integer index vs string key) must be fixed in the runner.
- Mismatch **outputLabels length** vs **outputHandleCount**: validation rule TBD (error vs warning).

---

### Function (`action.code`)

**Layer 1 — Catalog**

- nodeTypeId: `action.code`
- displayName: Function
- category: CODE
- subtitle: Custom code
- description: Runs code with multiple inputs and one json output.
- shape: `roundedRectangle`
- paletteGroup: Action
- definitionVersion: 1

**Layer 2 — Graph**

| id | kind | dataType | label |
|----|------|----------|-------|
| in-* | input | json | in |
| out | output | json | out |

- dynamicHandles: `inputHandleCount`

**Layer 3 — Configuration**

| key | fieldType | required | Notes |
|-----|-----------|----------|--------|
| `inputHandleCount` | handleCount | optional | default 1 |
| `code` | code | required | `language`: `javascript` / `python` (TBD) |
| `language` | enum | optional | if not inferred |

**Double-click UI**

```
┌─────────────────────────────────────────────────────────────┐
│ Function                                           [Execute] │
├───────────────────────────┬─────────────────────────────────┤
│ in-1 … in-N (values)      │ out: JSON result                 │
├───────────────────────────┴─────────────────────────────────┤
│ Inputs: [ 2 ]   Language: [ JavaScript ▼ ]                   │
│ Code:                                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Gaps / problems**

- **Sandbox**, timeouts, **allowed imports** not declared.
- **Signature** for `function(inputs: JsonValue[])` vs named args not specified.

---

### Transform (`control.transform`)

**Layer 1 — Catalog**

- nodeTypeId: `control.transform`
- displayName: Transform
- category: OTHER
- subtitle: Multi in · multi out
- description: Maps many inputs to many outputs (fan-in / fan-out) with code or mapping rules.
- shape: `roundedRectangle`
- paletteGroup: Control
- definitionVersion: 1

**Layer 2 — Graph**

- Same dynamic pattern as Switch + Function: `inputHandleCount`, `outputHandleCount`, `outputLabels`
- Handles: `in-*` → `json`, `out-*` → `json` (data restructure; not just flow)

| id | kind | dataType |
|----|------|----------|
| in-* | input | json |
| out-* | output | json |

**Layer 3 — Configuration**

| key | fieldType | required |
|-----|-----------|----------|
| `inputHandleCount` | handleCount | optional |
| `outputHandleCount` | handleCount | optional |
| `outputLabels` | handleLabels | optional |
| `code` | code | required |

**Double-click UI** — same shell as Switch + Function: counts, labels, large code editor; Execute shows per-output blobs.

**Gaps / problems**

- Overlaps **Function** if outputs = 1; product should clarify **when to use Transform vs Function**.
- **Output arity** (single vs multiple active outputs per run) not fixed.

---

### Do Nothing (`utility.noop`)

**Layer 1 — Catalog**

- nodeTypeId: `utility.noop`
- displayName: Do Nothing
- category: OTHER
- subtitle: Sink / placeholder
- description: Endpoint that consumes flow (no output in current design).
- shape: `circle`
- paletteGroup: Input & utility
- definitionVersion: 1

**Layer 2 — Graph**

| id | kind | dataType | label |
|----|------|----------|-------|
| in | input | flow | in |

**Layer 3 — Configuration**

- none

**Double-click UI**

```
┌─────────────────────────────────────────────────────────────┐
│ Do Nothing                                         [Execute] │
├───────────────────────────┬─────────────────────────────────┤
│ in: (connected / not)   │ (no outputs)                     │
└───────────────────────────┴─────────────────────────────────┘
```

**Gaps / problems**

- **Sink vs pass-through:** if you add optional `out` later, versioning needed.
- **json** vs **flow** only — cannot carry data through today.

---

### HTTP request (`action.http`)

**Layer 1 — Catalog**

- nodeTypeId: `action.http`
- displayName: HTTP request
- category: CODE
- subtitle: Call an API
- description: Performs an HTTP request; returns status, headers, body.
- shape: `roundedRectangle`
- paletteGroup: Action
- definitionVersion: 1

**Layer 2 — Graph**

| id | kind | dataType | label |
|----|------|----------|-------|
| in | input | json | in (overrides / merges) |
| out | output | json | out |

**Layer 3 — Configuration**

| key | fieldType | required | Notes |
|-----|-----------|----------|--------|
| `method` | httpMethod | required | |
| `url` | url | required | |
| `query` | keyValue | optional | |
| `headers` | keyValue | optional | |
| `body` | json or text | optional | Content-Type TBD |
| `credentialRef` | credentialRef | optional | |

**Double-click UI**

```
┌─────────────────────────────────────────────────────────────┐
│ HTTP request                                       [Execute] │
├───────────────────────────┬─────────────────────────────────┤
│ in: merged override JSON  │ out: status, headers, body       │
├───────────────────────────┴─────────────────────────────────┤
│ Method [GET ▼]  URL [https://________________]               │
│ Query params [+ add]                                          │
│ Headers [+ add]                                              │
│ Body [____________]  Credential [ None ▼ ]                   │
└─────────────────────────────────────────────────────────────┘
```

**Gaps / problems**

- **body** typing: raw string vs JSON vs form-urlencoded not enumerated.
- **Response** shape should use a **named schema** (`HttpResponse.v1`).
- **SSL**, redirects, timeout ms not in config.

---

### File (`action.file`)

**Layer 1 — Catalog**

- nodeTypeId: `action.file`
- displayName: File
- category: CODE
- subtitle: Uploaded file
- description: Reads a user file and emits metadata or content.
- shape: `roundedRectangle`
- paletteGroup: Action
- definitionVersion: 1

**Layer 2 — Graph**

| id | kind | dataType | label |
|----|------|----------|-------|
| in | input | flow | in |
| out | output | json | out |

**Layer 3 — Configuration**

| key | fieldType | required | Notes |
|-----|-----------|----------|--------|
| `fileId` | fileRef | required | from uploads list |
| `readMode` | enum (`metadata`, `text`, `bytes`) | optional | default `metadata` |

**Double-click UI**

```
┌─────────────────────────────────────────────────────────────┐
│ File                                               [Execute] │
├───────────────────────────┬─────────────────────────────────┤
│ in: ordering              │ out: file payload preview        │
├───────────────────────────┴─────────────────────────────────┤
│ File: [ Choose file ▼ ] [________________]                   │
│ Read mode: [ metadata ▼ ]                                    │
└─────────────────────────────────────────────────────────────┘
```

**Gaps / problems**

- **Max size**, **encoding**, **binary vs text** not declared.
- **MIME** type in output schema missing.

---

### LLM (`action.llm`)

**Layer 1 — Catalog**

- nodeTypeId: `action.llm`
- displayName: LLM
- category: CODE
- subtitle: Model + prompt
- description: Calls a configured model with credentials; returns completion text / structured output.
- shape: **`llmCard`** (larger rounded rect, **inline text**: model short name or “LLM”)
- paletteGroup: Action
- definitionVersion: 1

**Layer 2 — Graph**

| id | kind | dataType | label |
|----|------|----------|-------|
| in | input | json | in (messages / context) |
| out | output | json | out |

**Layer 3 — Configuration**

| key | fieldType | required | Notes |
|-----|-----------|----------|--------|
| `modelId` | modelRef | required | |
| `credentialRef` | credentialRef | required | |
| `prompt` | text | required | unless messages-only mode later |
| `systemPrompt` | text | optional | |
| `temperature` | number | optional | min 0 max 2 |
| `maxTokens` | number | optional | |

**Canvas:** `llmCard` shows **truncated** `modelId` or resolved display name inside the node.

**Double-click UI**

```
┌─────────────────────────────────────────────────────────────┐
│ LLM                                                [Execute] │
├───────────────────────────┬─────────────────────────────────┤
│ in: context JSON          │ out: completion + usage          │
├───────────────────────────┴─────────────────────────────────┤
│ Model [____________▼]   Credential [____________▼]            │
│ System (optional) [______________________________]            │
│ User prompt *                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ └─────────────────────────────────────────────────────────┘ │
│ Temperature [0.7]  Max tokens [____]                         │
└─────────────────────────────────────────────────────────────┘
```

**Gaps / problems**

- **Chat messages array** vs single **prompt** — schema for `in` json not defined (`OpenAI-compatible messages[]`?).
- **Structured output** / JSON mode not declared.
- **Token cost** and **PII** policies not in scope but are product risks.

---

## Cross-cutting gaps (typing & UX)

| Area | Issue |
|------|--------|
| **Payload contracts** | Few nodes define **JSON Schema** (or TypeScript interfaces) for `in` / `out`. Add `schemaIn` / `schemaOut` ids per `nodeTypeId` in a future appendix. |
| **Versioning** | `definitionVersion` exists per node but no migration story for saved workflows. |
| **Secrets** | `secretRef` / `credentialRef` need a **central store** and **audit** story. |
| **Execute preview** | All nodes assume a test runner; **mock upstream data** for Execute not specified. |
| **i18n** | Labels in spec are English-only. |

---

## Product notes (updated)

- **Start** (`trigger.start`): single trigger; **manual run** and **HTTP API** are **features** of the same node (payload JSON; copy URL in dialog).
- **Control:** If, Switch, Transform.
- **Action:** HTTP, Function, File, LLM.

---

## `node-config` file keys (implementers)

| Current `nodeId` in repo | nodeTypeId |
|--------------------------|------------|
| START | `trigger.start` |
| INPUT | `input.value` |
| IF | `control.if` |
| SWITCH | `control.switch` |
| FUNCTION | `action.code` |
| DO_NOTHING | `utility.noop` |

`control.transform`, `action.http`, `action.file`, `action.llm` do not have JSON files yet.
