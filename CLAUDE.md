# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Infinity Network App — a React + TypeScript social-network frontend (posts, profiles, friend requests, real-time messaging, notifications). Bundled with Vite, deployed to Vercel (SPA rewrite to `index.html` configured in `vercel.json`).

## Commands

- `npm run dev` — start Vite dev server on `0.0.0.0:5173`
- `npm run build` — type-check (`tsc -b`) then `vite build`
- `npm run lint` — ESLint over the repo
- `npm run preview` — preview the production build
- `npm test` / `npm run test:watch` — Jest (jsdom + ts-jest), setup file `setupTests.js`
- Run a single test: `npx jest path/to/file.test.ts` or `npx jest -t "test name"`

## Environment

`.env` must define `VITE_API_URL` (consumed by `src/services/rootApi.ts`). The Socket.IO server URL is currently hard-coded to `https://api.holetex.com` with path `/v1/we-connect/socket.io` in `src/context/SocketProvider.tsx`.

## Path aliases

Configured in both `vite.config.ts` and `tsconfig.json` — keep them in sync when adding new ones:
`@/*`, `@components/*`, `@page/*`, `@libs/*`, `@hooks/*`, `@context/*`, `@redux/*`, `@services/*` (note: tsconfig also lists `@ultil/*` for the existing `src/ultil/` folder — the misspelling is intentional and used throughout the code).

Jest has its own `moduleNameMapper` in `jest.config.js` covering only `@components/*` and `@hooks/*`. When tests import from other aliases, extend that mapper.

## Architecture

### Data layer — RTK Query

A single `rootApi` (`src/services/rootApi.ts`) defines auth/user/search endpoints and the shared `tagTypes` list (`POSTS`, `USERS`, `MESSAGES`, `CONVERSATIONS`, `GET_AUTH_USER`, etc.). Feature-specific APIs (`postApi`, `messagesApi`, `friendApi`, `userApi`, `notificationApi`) are separate `createApi` slices but inject into the same Redux store. When adding cache invalidation, use the tag types already declared on `rootApi`.

The custom `baseQueryForceLogout` wraps `fetchBaseQuery`:
- Injects `Bearer` token from `state.auth.accessToken`.
- On 401 with message `"Token has expired."`, calls `/refresh-token`, dispatches `login()` with the new access token, and retries the original request.
- On any other 401 (or refresh failure), dispatches `logOut()` and hard-redirects to `/login`.

### Store & persistence

`src/redux/store.ts` combines `auth`, `snackbar`, `settings`, `dialog`, and `rootApi.reducer`. The whole tree is wrapped with `redux-persist` (localStorage); **`rootApi`, `dialog`, and `settings` are blacklisted** — only auth tokens/user info survive reload. `logOutMiddleware` (`src/redux/middleware.ts`) intercepts `logOut` actions to call `rootApi.util.resetApiState()` and `persistor.purge()` — don't bypass it when implementing logout flows.

### Routing

`src/main.tsx` wraps the app in `Provider` → `PersistGate` → `ThemeProvider` (MUI) → `BrowserRouter` → `<AppRoutes />` + `<Dialog />`. Routes are declared as a plain array in `src/route.tsx` and rendered recursively by `src/AppRoutes.tsx`. The `RootLayout` → `ProtectedLayout` → page tree is the authenticated shell; `AuthLayout` hosts login/register/OTP/forgot/reset pages.

`AppRoutes` implements the **background-location modal pattern** for `/posts/:postId`: when navigation state carries `background`, the main `<Routes>` renders against the background while a second `<Routes>` overlays `<PostDetail />` as a modal. Preserve `state.background` when adding modal routes.

`ProtectedLayout` calls `useGetAuthUserQuery()` and only mounts `<SocketProvider>` + `<Outlet />` after it resolves. The 401 redirect is handled by `baseQueryForceLogout`, not by the layout itself.

### Real-time (SocketProvider)

`src/context/SocketProvider.tsx` owns a single Socket.IO client (exported as `socket`). It connects when `state.auth.accessToken` is present, listens for `CREATE_NOTIFICATION_REQUEST` and `SEND_MESSAGE`, and **mutates RTK Query caches directly** via `notificationsApi.util.updateQueryData` / `messagesApi.util.updateQueryData` instead of refetching. New realtime events should follow the same pattern (update the matching cache entry rather than invalidating tags) to keep chat/notifications snappy.

### Global Dialog

`<Dialog />` (mounted once in `main.tsx`) is driven by `state.dialog`. Dispatch `openDialog({ title, content, data, ... })` with a `contentType` string; `DynamicContent` switches on that string (`NEW_CONTENT_DIALOG`, `TITLE_CREATE_POST`, `POST_DETAIL_DIALOG`). To add a new dialog, register a new case in `src/components/Dialog/index.tsx` rather than mounting ad-hoc `<Dialog>` components per page.

## Conventions

- UI is Material UI v6 (`@mui/material`, `@emotion/*`) + Tailwind utility classes (`tailwind.config.js`, `postcss.config.cjs`). Both coexist — match the surrounding component's style.
- Forms use `react-hook-form` + `yup` via `@hookform/resolvers`.
- The `src/ultil/` directory (sic) holds shared types and constants.
- Existing code freely uses `any` and `eslint-disable @typescript-eslint/no-explicit-any`; prefer real types in new code, but don't churn old files purely to remove them.
