# EduRune web client

EduRune is a learning game with courses, lesson maps, and turn-based battles. Learners answer questions to fight enemies and earn XP, coins, gear, and cosmetics.

## Run it

```sh
bun install
cp .env.example .env   # set VITE_API_URL to your API origin
bun run dev
```

Build and review interfaces in Storybook:

```sh
bun run storybook
```

## Checks

```sh
bun run typecheck && bun run lint && bun run fmt
```

## License

Licensed under [FSL-1.1-ALv2](LICENSE).
