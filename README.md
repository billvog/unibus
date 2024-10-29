<p>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/billvog/unibus/blob/main/web/public/og-image-dark.png">
    <img src="https://github.com/billvog/unibus/blob/main/web/public/og-image.png" alt="Unibus: Public transit, without the buzz." />
  </picture>
</p>

Unibus focuses on Greece's public transit network, to help people move throughout the city with ease and speed.

We make the hard work of assembling the puzzle to get from point A to point B, while combining transit, and we make it look stupidly easy.

## Features

- 🚏 Map with Bus Stops.
- 📍 Geolocation Web API, to help you pick a stop near you.
- ✨ Great UI/UX.
- 🛣️ On the fly generated routes, that lead to your destination, combining transit, if needed.
- 🧭 Directions between waypoints.

## Technical Stack

### Frontend

Created with [T3](https://create.t3.gg/).

- Next.js (App Router)
- TailwindCSS
- TRPC / React Query

### Backend

Deployed using [Dokku](https://dokku.com/).

- Express
- Drizzle / PostgreSQL
- TRPC
- TypeScript
- Docker / Docker Compose
