# WiseGuy Investor - Market Insights

WiseGuy Investor - Market Insights is a web application that provides users with valuable insights and analytics related to market trends, consumer behavior, and other relevant data.

---

## Tech Stack

- **Angular 17** (CLI, Material, PWA)
- **Tailwind CSS** (Styling)
- **Firebase** (Emulators, Hosting)
- **Jest** (Unit Testing)
- **ESLint** (Linting)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Angular CLI](https://angular.dev/tools/cli)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Capacitor CLI](https://capacitorjs.com/docs/getting-started)
- Other tools: `npm i -g node-firestore-import-export rimraf workbox-cli pwa-asset-generator kill-port`

- Shortcut: Install global packages `npm i -g @angular/cli @capacitor/cli firebase-tools`
- Shortcut: Install local packages `npm install-all`

### Installation

```bash
npm install
```

### Development

Start the app and emulators:

```bash
npm start
```

Run the app:

On VSCode, bring up `build task` menu by pressing `Cmd + Shift + B` and then launch `Start Web app (Windows/Mac)`.

This will launch the:

- App: [http://localhost:8100](http://localhost:8100)
- Firestore Emulator UI: [http://localhost:4000](http://localhost:4000)
- Functions (Server code) compiler using nodemon to watch for changes

### Build

```bash
ng build
```

### Unit Tests

```bash
ng test
```

---

## Firebase Emulator Setup

1. **Start Firestore Emulator:**
   ```bash
   firebase emulators:start --only firestore --export-on-exit=./emulators.backup
   ```
2. **Import Dev Database:**
   ```bash
   export FIRESTORE_EMULATOR_HOST=0.0.0.0:8080
   firestore-import --accountCredentials service-key.json --backupFile dev-database.json
   ```
3. **Export Dev Database:**
   To update the local dev db so other devs can get your latest db changes.

   ```bash
   export FIRESTORE_EMULATOR_HOST=0.0.0.0:8080
   firestore-export --accountCredentials service-key.json --backupFile dev-database.json
   ```

4. **Test to Confirm:**

- Close the emulator - Press `Ctrl + C` in the terminal
- Open `./emulators.backup` to see data ready to be imported again when you start the emulators next

---

## Firebase Service Account

- Create a firebase service account and download your service credential json file
- Save it as `service-key.json` in the root folder

Export Live data:

To a local file `output.json`. **Not required for day to day dev.**

```bash
firestore-export --accountCredentials service-key.json --backupFile prod-database.json
```

---

## Notes

- **User Data:**  
  `/users` (public/private), `/user_meta` (private emails), `/user_roles` (optional, claims preferred)
  - not sure if `/user_roles` needed as we have claims, db roles don't override claims (only set in functions
- **Firebase Stripe Extension:**  
  Install `@firebase/*-compat` packages in `functions` if using Stripe extension.

## Tailwind CSS Setup

- Install Tailwind CSS and its dependencies:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init
  ```
  https://notiz.dev/blog/angular-with-tailwindcss

---

## VSCode Recommendations

- Use the recommended extensions (see `.vscode/extensions.json`)
- For ESLint:  
  Set `"eslint.useFlatConfig": true` in your settings.

### ESLint Setup

- https://eslint.org/docs/latest/use/getting-started
- Run `ng add @angular-eslint/schematics`

---

## Jest Test Setup

- Fast unit tests
- jest https://jestjs.io/docs/getting-started
- ts-jest transformer - https://kulshekhar.github.io/ts-jest

---

## Plugin notes

Firebase Stripe extension -
For the integration to work I needed to install these packages into my functions project

- @firebase/app-compat@0.2.3
- @firebase/auth-compat@0.3.3
- @firebase/firestore-compat@0.3.3
