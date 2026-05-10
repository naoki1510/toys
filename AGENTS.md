# Repository guidance

## Project overview

This repository hosts small web apps ("toys") in one TanStack Start app.
Each toy should be self-contained under `apps/<toy-name>/`; shared framework code lives under `src/`.

## Development commands

- Install dependencies with `pnpm install`.
- Run tests with `pnpm test`.
- Run `pnpm lint`, `pnpm format:check`, and `pnpm typecheck` before pushing. `pnpm typecheck` internally runs `pnpm cf-typegen` (Cloudflare types) and `pnpm routes-typegen` (TanStack `src/routeTree.gen.ts`) before `tsc --noEmit`, so these generated files do not need to be checked in.
- Run the production build with `pnpm build` (typecheck is split out into `pnpm typecheck`; `pnpm dev` and `pnpm build` regenerate `src/routeTree.gen.ts` automatically via the vite plugin).
- Use `pnpm dev` for local development.

## Implementation guidelines

- Keep toy-specific code inside `apps/<toy-name>/`.
- Use `src/components/ui/` only for shared UI primitives.
- Do not move code into `src/` unless it is genuinely shared by multiple toys.
- Add a route mount in `routes.ts` when adding a new toy route tree.
- Keep generated files such as `src/routeTree.gen.ts` and `worker-configuration.d.ts` out of commits — `pnpm typecheck` (via `pnpm routes-typegen` / `pnpm cf-typegen`) regenerates them on demand.
- Treat Cloudflare Workers compatibility as part of the design; avoid Node-only runtime APIs in code that runs in production.

## Review guidelines

- Flag changes that break the "1 toy = 1 directory" boundary.
- Flag missing or stale `routes.ts` registrations for new toy routes.
- Flag changes that could break other toys because the repository deploys as one Cloudflare Worker.
- Flag missing tests for non-trivial domain logic, especially code under `apps/<toy-name>/lib/`.
- Flag build or type-check regressions that would be caught by `pnpm build` or `pnpm typecheck`.
- Flag accidental commits of generated files, local secrets, or deployment credentials.
