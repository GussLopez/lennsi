<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visib# AGENTS.md

## Project overview

This is a Next.js application using TypeScript and Supabase.

Supabase is used for:
- PostgreSQL database
- Authentication
- Row Level Security (RLS)
- Database functions and triggers
- Storage when applicable

The project has access to a Supabase MCP server named:

supabase-dev

The `supabase-dev` MCP connection is configured as read-only and scoped
to the Supabase project used by this repository.


# General behavior

Before making changes:

1. Inspect the existing implementation.
2. Understand the relevant database schema when the task involves Supabase.
3. Reuse existing project patterns whenever possible.
4. Do not invent tables, columns, functions, policies, routes, or dependencies.
5. If something can be verified using Supabase MCP, verify it instead of assuming it exists.


# Supabase MCP

Use `supabase-dev` whenever database context would help.

Examples include:

- inspecting tables
- inspecting columns and data types
- inspecting foreign keys
- inspecting constraints
- inspecting indexes
- inspecting RLS policies
- inspecting PostgreSQL functions
- inspecting triggers
- inspecting migrations
- inspecting Supabase logs
- investigating database or authentication errors

Prefer checking the real Supabase project through MCP instead of relying
only on TypeScript types or assumptions from application code.


# Database safety

## Default rule

Treat the Supabase database as READ ONLY unless the user explicitly
authorizes a database modification in the current request.

Do not modify the remote database by default.


## Without explicit authorization

You MAY:

- inspect schemas
- inspect tables
- inspect RLS policies
- inspect functions
- inspect triggers
- inspect indexes
- inspect constraints
- inspect logs
- execute read-only queries
- diagnose database errors
- propose SQL
- create migration files locally
- explain required database changes

You MUST NOT:

- execute INSERT
- execute UPDATE
- execute DELETE
- execute UPSERT
- execute TRUNCATE
- execute DROP
- execute ALTER
- execute CREATE against the remote database
- apply migrations remotely
- create or modify RLS policies remotely
- create or modify database functions remotely
- create or modify triggers remotely
- modify auth users
- modify storage buckets or policies
- reset the database


# Database changes

When a task requires a database change, prefer this workflow:

1. Inspect the current database state using Supabase MCP.
2. Explain the problem.
3. Determine the smallest required database change.
4. Generate a SQL migration locally.
5. Show or summarize what the migration changes.
6. Do NOT apply the migration to Supabase unless the user explicitly asks
   to apply or execute it.

Prefer migrations over ad-hoc remote SQL changes.


# Destructive database operations

Operations that can delete or irreversibly modify data require explicit
authorization.

Examples:

- DROP TABLE
- DROP COLUMN
- TRUNCATE
- DELETE without a narrow condition
- resetting the database
- destructive schema migrations
- removing RLS policies
- deleting auth users
- deleting storage buckets

Never perform destructive operations merely because they are a convenient
way to fix a development issue.

Prefer a non-destructive solution.


# Row Level Security

RLS is part of the application's security model.

When working with a Supabase table:

1. Check whether RLS is enabled.
2. Inspect the existing policies.
3. Understand which authenticated roles should have access.
4. Avoid disabling RLS as a workaround.
5. Prefer narrowly scoped policies.
6. Do not create permissive policies such as unrestricted `true`
   conditions unless explicitly justified.

Never solve an RLS error by disabling RLS globally.

If an operation fails because of RLS, diagnose the policy before changing
application logic.


# Authentication

Do not bypass Supabase Auth security mechanisms.

When debugging authentication:

- inspect the current auth flow
- inspect server/client Supabase usage
- inspect RLS policies
- inspect relevant claims
- inspect middleware when applicable
- inspect server-side session handling

Do not expose or log sensitive authentication credentials.


# Secrets

Never print, commit, expose, or copy secrets into source files.

Sensitive values include:

- Supabase service role keys
- database passwords
- personal access tokens
- private API keys
- JWT secrets
- OAuth client secrets

Do not place secrets in:

- source code
- logs
- AGENTS.md
- README files
- test fixtures
- committed `.env` files

Use environment variables.

Before committing changes, ensure secrets are not included in the diff.


# Supabase service role

Treat `SUPABASE_SERVICE_ROLE_KEY` as highly privileged.

Do not move the service role key into client-side code.

Do not expose it through:

- `NEXT_PUBLIC_*`
- React components
- browser JavaScript
- API responses

Service-role usage must remain server-side.


# Next.js

Follow the existing Next.js App Router architecture.

Prefer:

- Server Components when client-side interactivity is not needed
- Client Components only when hooks, browser APIs, or interactive state are required
- Route Handlers for server-side API behavior when consistent with the project
- existing project utilities over duplicated implementations

Do not add `"use client"` unless it is actually required.


# TypeScript

Keep TypeScript strict and avoid weakening types.

Avoid:

- `any`
- unnecessary type assertions
- `@ts-ignore`
- `@ts-expect-error` without a documented reason

Prefer types inferred from real data structures and Supabase-generated
types when available.


# Supabase types

When the database schema and TypeScript types disagree, treat the real
database schema as the source of truth.

Verify the schema using Supabase MCP.

Do not manually change generated Supabase database types to hide a schema
mismatch.

Regenerate types when appropriate.


# Existing architecture

Before introducing:

- a new dependency
- a new abstraction
- a new utility
- a new data-access layer
- a new state-management solution

check whether the project already has an established pattern.

Prefer consistency over introducing a different library for the same job.


# Dependencies

Do not install new dependencies unless they provide a clear benefit.

Before adding a dependency:

1. Check whether the functionality already exists in the project.
2. Check whether it can reasonably be implemented with existing tools.
3. Explain why the dependency is needed if it is substantial.


# Error investigation

When debugging an error, find the root cause instead of immediately
implementing a workaround.

For Supabase-related errors, investigate:

1. application code
2. request payload
3. authentication state
4. database schema
5. constraints
6. RLS policies
7. functions
8. triggers
9. Supabase logs

Use MCP when those resources are relevant.


# SQL

When writing SQL:

- qualify application tables with `public.` when useful
- avoid destructive operations unless necessary
- preserve existing data
- make migrations safe for the current schema
- consider RLS implications
- consider foreign keys
- consider indexes
- consider existing rows before adding NOT NULL constraints

Do not assume a table is empty.


# Migrations

Prefer migrations that are:

- deterministic
- reviewable
- reversible when practical
- safe for existing data

Do not rewrite old migrations that may already have been applied.

Create a new migration instead unless the user explicitly requests
otherwise.


# Code changes

Keep changes focused on the requested task.

Do not:

- refactor unrelated code
- rename unrelated files
- reformat large unrelated sections
- change architecture unnecessarily
- modify unrelated database objects

Small, targeted patches are preferred.


# Validation

After modifying code, inspect `package.json` and use the validation commands
available in the project.

When applicable, run:

- TypeScript checks
- lint
- relevant tests
- build checks

Do not claim a command passed unless it was actually executed successfully.

If validation cannot be run, state that explicitly.


# Git

Do not:

- force push
- rewrite Git history
- delete branches
- modify existing commits
- run destructive Git commands

Do not commit changes unless the user explicitly requests a commit.

Always preserve unrelated user changes in the working tree.


# Communication

When a task involves significant database changes, explain:

1. what is currently happening
2. what caused the issue
3. what needs to change
4. whether the change affects code, database, or both
5. any security implications

If SQL is required, provide the migration separately from application code.


# Decision priority

When multiple solutions are possible, prefer in this order:

1. security
2. data integrity
3. correctness
4. consistency with the existing codebase
5. simplicity
6. performance
7. conveniencele from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
