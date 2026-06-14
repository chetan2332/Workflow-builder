# Flowstack

A workflow automation platform. Build, manage, and execute node-based automation workflows through a visual editor.

## Architecture

```
┌─────────────────────┐        ┌──────────────────────┐
│   Frontend (React)  │──────▶ │    API (NestJS)       │
│   CloudFront + S3   │        │    EC2 :3000          │
└─────────────────────┘        └──────────┬───────────┘
                                           │ HTTP
                                ┌──────────▼───────────┐
                                │  Execution Engine     │
                                │  (NestJS)  EC2 :3001  │
                                └──────────────────────┘
                                           │
                                ┌──────────▼───────────┐
                                │  PostgreSQL (RDS)     │
                                └──────────────────────┘
```

- **Frontend** — React SPA served via CloudFront + S3
- **API** — NestJS REST API, handles auth, workflows, delegates node execution to the engine
- **Execution Engine** — Isolated NestJS service that runs individual nodes, no DB dependency
- **Database** — PostgreSQL via Prisma (local Docker or AWS RDS)

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, TailwindCSS, React Flow, TanStack Query |
| API | NestJS, Prisma, PostgreSQL, AWS Cognito (JWT) |
| Execution Engine | NestJS |
| Monorepo | Turborepo, pnpm workspaces |
| Infrastructure | AWS EC2, RDS, S3, CloudFront, ECR |
| CI/CD | GitHub Actions |

## Project Structure

```
.
├── apps/
│   ├── api/                  # NestJS REST API (port 3000)
│   ├── execution-engine/     # NestJS execution service (port 3001)
│   └── web/                  # React frontend
├── packages/
│   ├── database/             # Prisma schema, migrations, PrismaService
│   └── shared/               # Shared types and node definitions
└── .github/workflows/
    └── deploy.yml            # CI/CD — deploys all 3 apps on push to main
```

## Local Development

### Prerequisites

- Node.js 22+
- pnpm 10.32.1
- Docker (for local PostgreSQL)
- AWS Cognito pool (for auth)

### Setup

```bash
# Install dependencies
pnpm install

# Start local PostgreSQL
docker run -d --name flowstack-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -e POSTGRES_DB=automation_workflow_db \
  -p 5432:5432 postgres:16

# Run migrations
cd packages/database && pnpm db:deploy && cd ../..

# Start all apps
pnpm dev
```

`pnpm dev` starts both the API (`:3000`), execution engine (`:3001`), and frontend (`:5173`) concurrently via Turborepo.

### Environment Variables

Copy the example files and fill in values:

```bash
cp apps/api/.env.example apps/api/.env
```

Key variables for `apps/api/.env`:

```env
DATABASE_URL=postgresql://admin:admin123@localhost:5432/automation_workflow_db
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
EXECUTION_ENGINE_URL=http://localhost:3001
```

## Node Types

The execution engine supports 8 built-in node types:

| Type | Description |
|---|---|
| `trigger.start` | Entry point, passes initial payload |
| `code.http` | Makes HTTP requests |
| `code.llm` | LLM inference (in progress) |
| `code.function` | Runs custom JavaScript |
| `flow.if` | Binary true/false branching |
| `flow.switch` | First-match multi-case routing |
| `flow.condition` | Non-exclusive multi-case routing |
| `flow.combine` | Merges data from multiple inputs |

## Deployment

All 3 apps deploy automatically on push to `main` via GitHub Actions. Three jobs run in parallel:

- **API** — builds Docker image → pushes to ECR → deploys to EC2 via SSM
- **Execution Engine** — same pattern, separate EC2
- **Frontend** — pnpm build → S3 sync → CloudFront invalidation

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret |
| `DATABASE_URL` | RDS PostgreSQL connection string |
| `CORS_ORIGIN` | Frontend CloudFront URL |
| `EXECUTION_ENGINE_URL` | Engine EC2 private IP and port |
| `VITE_API_BASE` | API EC2 public URL (baked into frontend build) |

### EC2 Setup (one-time)

Both EC2 instances need Docker installed and the instance profile with `AmazonSSMManagedInstanceCore` + `AmazonEC2ContainerRegistryReadOnly` attached. Connect via SSM Session Manager and run:

```bash
sudo yum update -y && sudo yum install -y docker
sudo systemctl start docker && sudo systemctl enable docker
```

Migrations run automatically on every API container startup via `prisma migrate deploy`
