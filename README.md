<p>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/billvog/unibus/blob/main/web/public/og-image-dark.png">
    <img src="https://github.com/billvog/unibus/blob/main/web/public/og-image.png" alt="unibus: Public transit, without the buzz." />
  </picture>
</p>

**unibus** focuses on Greece's public transit network, to help people move throughout the city with ease and speed.

## Features

- 🚏 Map with Bus Stops.
- 📍 Geolocation Web API, to help you pick a stop near you.
- ✨ Great UI/UX.
- 🧭 Directions between waypoints.
- // 🛣️ On the fly generated routes, that lead to your destination, combining transit, if needed.

## Technical Stack

This is a monorepo, using Turborepo and pnpm workspaces.

### Frontend

Under `web/` folder.

Scaffolded with [T3](https://create.t3.gg/).

- Next.js (App Router)
- TailwindCSS
- TRPC / React Query

### Backend

Under `api/` folder.

Deployed using [Dokku](https://dokku.com/).

- Express
- Drizzle / PostgreSQL
- TRPC
- TypeScript
- Docker / Docker Compose
