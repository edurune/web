# Contributing

## Running the API

Follow the server repository README to run the API locally, then point `VITE_API_URL` at it.

## Before opening a pull request

```sh
bun run typecheck && bun run lint && bun run fmt
```

If you changed user-facing text:

```sh
bun run i18n:extract
bun run i18n:compile
```

Commit the `.po` and compiled `.ts` files.

Follow [AGENTS.md](AGENTS.md).
