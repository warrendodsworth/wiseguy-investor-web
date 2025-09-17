# My App – AI Coding Agent Instructions

You are an expert in TypeScript, Angular, Firebase, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices, and you understand the project’s architecture and workflows.

## Project Architecture & Data Flow

- **Angular 20+** app with Material, Tailwind CSS, and PWA features. All UI code is in `src/app/`.
- **Standalone components** are preferred. Avoid NgModules except for legacy code.
- **State management** uses signals and computed properties. Avoid `mutate`; use `update` or `set`.
- **Services** are single-responsibility, provided in root, and use `inject()` for dependencies.
- **User data** is stored in Firestore (`/users`, `/user_meta`). Roles are managed via Firebase claims, not DB roles.
- **Config** and user preferences are loaded via `ConfigService` and `UserPrefService`.
- **Forms** use Reactive Forms and Formly (`@ngx-formly/core`). See `core/formly/fields-app.ts` for field patterns.
- **Emulator support**: Local development uses Firebase emulators for Firestore, Functions, Auth, etc.

## Developer Workflows

- **Start app & emulators:**
  - `npm start` (or VSCode build task: `Start Web (Full)`)
  - App: http://localhost:8100
  - Emulator UI: http://localhost:4000
- **Build:** `ng build`
- **Unit tests:** `ng test` (Jest)
- **Lint:** `npx eslint .`
- **Functions:**
  - Server code in `/functions`. Build with `npm run build` and test with `npm run test` inside `functions/`.
- **Database import/export:**
  - Import: `firestore-import --accountCredentials service-key.json --backupFile dev-database.json`
  - Export: `firestore-export --accountCredentials service-key.json --backupFile dev-database.json`

## Conventions & Patterns

- **TypeScript:** Strict types, avoid `any`, prefer inference, use `unknown` if needed.
- **Angular:**
  - Do NOT set `standalone: true` in decorators (default).
  - Use signals for state, `computed()` for derived state.
  - Host bindings via `host` object, NOT decorators.
  - Use `NgOptimizedImage` for static images (not for base64).
  - Use native control flow (`@if`, `@for`, `@switch`), NOT `*ngIf`, `*ngFor`, `*ngSwitch`.
  - Use `input()`/`output()` functions, NOT decorators.
  - Prefer inline templates for small components.
  - Use class/style bindings, NOT `ngClass`/`ngStyle`.
- **Services:**
  - Provided in root, use `inject()` for dependencies.
  - See `core/services/` for examples (e.g., `AuthService`, `BaseFirestoreService`).
- **Forms:**
  - Use Formly for dynamic forms. See `core/formly/fields-app.ts` and `fields-basic.ts` for field configs.
- **User roles:**
  - Managed via Firebase claims. See `AuthService` for role checks (`canRead`, `canEdit`, `canDelete`).
- **Utilities:**
  - Use `UtilService` for helpers (dialogs, snackbars, storage, array/object transforms).

## Integration Points

- **Firebase:**
  - Firestore, Auth, Functions, Storage, Emulator support. See `firebase.json` for emulator config.
- **Capacitor:**
  - Used for native features (Share, Camera, Notifications). See `UtilService` for usage.
- **Stripe:**
  - Stripe extension requires `@firebase/*-compat` packages in `functions/`.

## VSCode & Tooling

- Recommended extension: `angular.ng-template` (see `.vscode/extensions.json`).
- For ESLint, set `eslint.useFlatConfig: true` in VSCode settings.

---

## Angular & TypeScript Best Practices

// ...existing code...

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
