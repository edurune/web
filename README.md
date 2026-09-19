![EduRune](https://raw.githubusercontent.com/edurune/game/refs/heads/main/art/exports/social-card-1200x630.png)

EduRune is a learning game with courses, lesson maps, and turn-based battles. Learners answer questions to fight enemies and earn XP, coins, gear, and cosmetics.

## Development

```sh
bun install
cp .env.example .env   # set VITE_API_URL to your API origin
bun run dev
```

Build and review interfaces in Storybook:

```sh
bun run storybook
```

## Translation

Help translating by updating [.po files](./art/src/locales).

```sh
bun run i18n:extract
bun run i18n:compile
```

## License

Licensed under [FSL-1.1-ALv2](LICENSE).
