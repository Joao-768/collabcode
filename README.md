# CollabCode

Empty starting point with the CollabCode stack already configured: npm workspaces
with a Vite + React client and an Express + Prisma server.

## Stack

- **Client**: Vite, React 19, TypeScript, Tailwind v4, react-router-dom, zustand,
  Monaco, Yjs, socket.io-client
- **Server**: Express 5, Prisma 7 (PostgreSQL), socket.io, Yjs, zod, JWT auth deps
- **Tooling**: oxlint, Prettier (4 spaces), vitest

## Setup

```bash
npm install
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Fill in `DATABASE_URL` and `JWT_SECRET` in `server/.env`, create the database,
then run the first migration once the schema has models:

```bash
npm run prisma:migrate -w server
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Server on :4000 and client on :5173, together |
| `npm run build` | Prisma generate, then build server and client |
| `npm start` | Apply migrations and run the built server |
| `npm run lint` | oxlint on both workspaces |
| `npm test` | vitest on the server |
