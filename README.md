# CollabCode

A real-time collaborative code editor. Several developers join the same room and
edit the same files at once, seeing each other's changes, cursors and presence as
they happen.

Conflict resolution is handled by [Yjs](https://github.com/yjs/yjs) (a CRDT), so
simultaneous edits merge without a lock, a diff, or a last-write-wins overwrite.

---

## What it does

- **Accounts** — register, log in, log out; passwords hashed with bcrypt, session
  in an httpOnly JWT cookie
- **Projects** — create a room, share its link, rejoin later; the owner can
  delete it
- **Files** — create, rename, delete and switch between files, with syntax
  highlighting for JavaScript, TypeScript, JSON, HTML and CSS
- **Real-time editing** — every keystroke propagates to everyone in the room;
  concurrent edits on different lines all survive
- **Presence and cursors** — who is in the room, and where their caret and
  selection are, each in their own colour
- **Chat** — per-room messages with author and timestamp, persisted
- **Run** — execute the open JavaScript file and see its output in a console
- **Persistence** — the document survives reloads, restarts and everyone leaving
- **Dark and light themes**: dark by default, light or follow the system on
  request, remembered per browser, with the editor switching along with the app

---

## Stack

| Layer    | Choice                                                                    |
| -------- | ------------------------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4, Monaco Editor, React Router |
| Backend  | Node, Express 5, TypeScript, Socket.IO                                    |
| Realtime | Yjs (CRDT) over Socket.IO, with `y-monaco` binding the editor             |
| Database | PostgreSQL 17, Prisma 7                                                   |
| Auth     | JWT in an httpOnly cookie, bcrypt                                         |
| Tests    | Vitest, Supertest                                                         |

---

## Running it

**Requirements:** Node 20+, PostgreSQL 16+ running locally.

```bash
git clone <this-repo> collabcode
cd collabcode
npm install
```

Create the database and configure the server:

```bash
createdb collabcode

cd server
cp .env.example .env
```

Then edit `server/.env`:

- Point `DATABASE_URL` at your database
- Generate a `JWT_SECRET`:
    ```bash
    node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
    ```

Apply the schema and start both apps:

```bash
cd server && npx prisma migrate dev && cd ..
npm run dev
```

- Client: http://localhost:5177 (also on your LAN IP, so a phone on the same Wi-Fi can open it)
- API: http://localhost:4100

The Vite dev server proxies `/api` and `/socket.io` to the API, so the client talks
to its own origin in development just as it does in production. Set `VITE_API_URL`
and `VITE_SOCKET_URL` in `client/.env` only to point it at a different API.

### Trying the collaboration

Open the app in two browsers (or one normal and one private window), register two
accounts, create a project in the first, and paste its `/workspace/:id` URL into
the second. Both windows should show each other in the header and each other's
cursors in the editor.

---

## Architecture

```
Browser (React)
  ├── REST  ─── fetch, httpOnly cookie ───┐
  └── WS    ─── Socket.IO, binary Yjs ────┤
                                          ▼
                     Express 5 + Socket.IO (TypeScript, strict)
                       ├── routes → controllers → services → Prisma
                       ├── middleware: auth, validation, permissions, errors
                       └── websocket: rooms, documents, presence, chat
                                          │
                                          ▼
                                    PostgreSQL (Prisma)
```

Controllers never touch Prisma, and services never see `req`/`res`. That split is
what keeps the services testable on their own and the routes thin.

```
server/src/
├── routes/         HTTP routing only
├── controllers/    request/response, input schemas
├── services/       business logic and database access
├── middleware/      auth, validation, permissions, error handling
├── websocket/      socket server, room manager, presence, chat
└── lib/            prisma client, jwt, password hashing, env validation

client/src/
├── pages/          landing, login, register, dashboard, workspace
├── components/     ui/, workspace/, layout/
├── hooks/          useSocket, useYDoc, useAwareness, usePresence, useChat
├── services/       api client, socket client, per-resource calls
├── stores/         zustand auth store
└── lib/            sandboxed JavaScript runner
```

### How synchronisation works

The interesting part of the project.

1. A client opens a file and emits `document:sync`.
2. The server loads that file's Y.Doc — from the stored binary CRDT state if it
   has one — and returns the full state.
3. Local edits produce a Yjs update, which the client emits as
   `document:update`.
4. The server applies the update to its authoritative doc and relays it to
   everyone else in that file's room.
5. Two seconds after the last edit — or immediately when the last client leaves —
   the server writes the doc back to Postgres.

Each file row stores the document twice, on purpose:

- `content` — a plain-text snapshot, cheap to read over REST and legible in the
  database
- `ydoc` — the binary CRDT state (`Y.encodeStateAsUpdate`)

The binary column is what makes reconnection safe. Rebuilding a Y.Doc from plain
text would discard the history the CRDT needs to merge concurrent edits, so two
people rejoining at once could diverge. Restoring from `ydoc` picks up exactly
where the room left off.

Cursors and selections travel over the same connection as Yjs _awareness_ state,
carried by `cursor:update`. Awareness is ephemeral by design and never persisted.

### Websocket events

| Event                                            | Direction       | Purpose                                                |
| ------------------------------------------------ | --------------- | ------------------------------------------------------ |
| `room:join` / `room:leave`                       | client → server | enter or leave a project room (membership is verified) |
| `room:error`                                     | server → client | join refused, or an action failed                      |
| `document:sync`                                  | both            | request and receive the full document state            |
| `document:update`                                | both            | incremental CRDT update                                |
| `cursor:update`                                  | both            | awareness: cursor and selection                        |
| `presence:update`                                | server → client | who is currently in the room                           |
| `chat:message`                                   | both            | send and receive a chat message                        |
| `file:created` / `file:renamed` / `file:deleted` | server → client | keep everyone's file tree in step                      |

### REST API

| Method   | Path                         | Notes                                 |
| -------- | ---------------------------- | ------------------------------------- |
| `POST`   | `/api/auth/register`         | sets the session cookie               |
| `POST`   | `/api/auth/login`            |                                       |
| `POST`   | `/api/auth/logout`           |                                       |
| `GET`    | `/api/auth/me`               | current user                          |
| `GET`    | `/api/projects`              | projects the caller belongs to        |
| `POST`   | `/api/projects`              | creator becomes `OWNER`               |
| `GET`    | `/api/projects/:id`          | includes members                      |
| `POST`   | `/api/projects/:id/join`     | joining via a shared link; idempotent |
| `DELETE` | `/api/projects/:id`          | owner only                            |
| `GET`    | `/api/projects/:id/files`    |                                       |
| `POST`   | `/api/projects/:id/files`    |                                       |
| `GET`    | `/api/projects/:id/messages` | latest 50, oldest first               |
| `GET`    | `/api/files/:fileId`         |                                       |
| `PATCH`  | `/api/files/:fileId`         | rename                                |
| `DELETE` | `/api/files/:fileId`         | owner only                            |

Realtime traffic is deliberately kept off the REST API: HTTP handles resources,
the socket handles the live session.

### Permissions

|                           | Owner | Collaborator | Non-member |
| ------------------------- | ----- | ------------ | ---------- |
| View project, files, chat | ✅    | ✅           | ❌         |
| Edit code                 | ✅    | ✅           | ❌         |
| Create and rename files   | ✅    | ✅           | ❌         |
| Delete files              | ✅    | ❌           | ❌         |
| Delete project            | ✅    | ❌           | ❌         |

Non-members get `404`, not `403`, so the API never confirms that a project exists
to someone who was not invited.

### Database

```
User ──owns──< Project >──has──< File
 │                │
 └──< ProjectMember >──┘   (role: OWNER | COLLABORATOR)
                  │
                  └──< Message
```

`ProjectMember` is a join table that carries the role, which is what every
permission check reads. Deletes cascade from `Project` to its files, members and
messages.

---

## Running code safely

The **Run** button executes the open JavaScript file in a Web Worker created from
a blob URL. That puts it in an opaque origin: user code has no access to the page,
its cookies, or its storage — `document` is not even defined there. Execution is
cut off after 3 seconds, which also handles infinite loops.

The user's code is written into the worker script itself rather than passed to
`eval()`. The production Content-Security-Policy has no `'unsafe-eval'`, and it
should not; it does allow `blob:` workers, so a worker whose source already holds
the program runs under that same policy. A syntax error makes the script fail to
load and is reported in the console.

Server-side execution is intentionally out of scope. Running untrusted code on the
backend needs real isolation (a container or a VM per run, with CPU, memory and
network limits), and a Web Worker gives a JavaScript-only feature the isolation it
needs without pretending a sandbox exists where it does not. Supporting other
languages would mean building that infrastructure first.

---

## Themes

Dark by default, with light and system as choices: the toggle in every header
cycles dark, light and system, and its label names the current mode.

- **No flash.** `client/public/theme.js` runs in `<head>` before the first paint,
  reads the saved choice (`cc-theme` in `localStorage`) and sets
  `<html data-theme>`. It is a file because the CSP only allows same-origin
  scripts.
- **Identity.** The palette is editorial: near-black and cream, a display serif and
  mono labels, with bright colours kept for presence, cursors and console levels.
  Dark mode is cream on black. Light mode is the same page printed: warm cream
  paper with near-black ink, and the solid pill turns into ink on paper.
- **Tokens.** Colours are CSS variables in `client/src/index.css`, defined once per
  theme and exposed to Tailwind through `@theme`. Names describe roles: `canvas`
  (page), `surface`, `border`, `cream` (the strong foreground and the solid fill
  in both themes), `heading`, `muted`, `dim`, `faint`, plus `live`, `warning`,
  `danger` and the `syntax-*` colours.
- **Editor.** `client/src/lib/editor-theme.ts` defines `collabcode-dark` and
  `collabcode-light` Monaco themes with one set of syntax hues tuned for each
  background, and the editor follows theme changes while it is open.
- **Presence colours** stay the same in both themes; the initials and cursor name
  tags pick black or white text, whichever has more contrast on that colour.

---

## Tests

```bash
createdb collabcode_test
cd server
cp .env.example .env.test          # point DATABASE_URL at collabcode_test
DATABASE_URL="postgresql://USER@localhost:5432/collabcode_test?schema=public" \
  npx prisma migrate deploy

npm test
```

46 tests over four areas:

- **auth** — registration, bcrypt hashing, duplicate emails, login, session
  cookies, forged tokens, logout
- **projects** — ownership on create, membership-scoped listing, idempotent join,
  cascade delete
- **permissions** — the full owner/collaborator/non-member matrix, plus file name
  and language validation
- **collaboration** — websocket auth, room membership, edit propagation,
  concurrent edits converging, room isolation, CRDT persistence and restore, and
  chat delivery

The collaboration suite runs a real Socket.IO server and drives two clients
through it, so document sync is tested end to end rather than mocked.

---

## Security notes

- Passwords hashed with bcrypt (12 rounds); the hash never leaves the database
- JWT in an `httpOnly`, `SameSite=Lax` cookie, `Secure` in production — not
  reachable from JavaScript, so an XSS bug cannot lift the session
- Websocket connections authenticate from the same cookie, and every `room:join`
  re-checks membership in the database
- All input validated with zod; file names are restricted, which blocks path
  traversal
- Prisma parameterises every query; React escapes rendered content
- `helmet` for security headers, a 100kb body cap, and rate limiting on the
  credential endpoints
- Secrets live in `.env` files, which are gitignored; `.env.example` documents
  what is needed

---

## Known limitations

- The workspace is built for desktop. On a phone the file tree and chat collapse
  into side rails and open as overlays, which works but is not where long editing
  sessions are meant to happen.
- `Run` supports JavaScript only, in the browser (see above).
- Presence is per project, not per file: you see who is in the room, not which
  file each person has open.
