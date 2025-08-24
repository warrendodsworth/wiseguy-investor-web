# WiseGuy Investor - Market Insights

## Description

WiseGuy Investor - Market Insights is a web application that provides users with valuable insights and analytics related to market trends, consumer behavior, and other relevant data.

### Frameworks

Angular, Material, TailwindCSS, Firebase, Jest, ESLint, PWA

1. Angular CLI Application builder - https://angular.dev/tools/cli/build-system-migration/
2. Tailwind CSS - https://tailwindcss.com/docs/container#using-the-container

## Dev Notes

- /users - public or private user data
- /user_meta - to keep emails private incase /users needs to be public
- /user_roles - not sure if needed as we have claims, db roles don't override claims (only set in functions)

## Environment setup

- Install Node.js
- Install global packages `npm i -g @angular/cli @capacitor/cli firebase-tools node-firestore-import-export rimraf workbox-cli pwa-asset-generator kill-port`
- Install local pacakges `npm install-all`

- Run `npm start` to start the development server

## Setup Tailwind CSS in the project

- Install Tailwind CSS and its dependencies:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init
  ```
  https://notiz.dev/blog/angular-with-tailwindcss

### Install VSCode recommended extensions

- Press Ctrl/Cmd + Shift + X
- Click the funnel filter icon > select Recommendations
- Last, click the cloud download icon to install all recommended extensions

### ESLint

- Change since v9 - Migrated to eslint flat file - https://eslint.org/docs/latest/use/getting-started
- VSCode plugin setting - "eslint.useFlatConfig": true
- Run `ng add @angular-eslint/schematics`

### Jest

- Fast unit tests
- jest https://jestjs.io/docs/getting-started
- ts-jest transformer - https://kulshekhar.github.io/ts-jest

### Setup Firebase Emulators

- To Import live db
- - Create a firebase service account and download your service credential json file
- - Save it as `service-key.json` in the root folder
- Use node-firestore-import-export to [https://jsmobiledev.com/article/firebase-emulator](Export firestore & Import into emulator)

- Note - service key file: service-key.json

### Setup Development Database

Import the Dev Database backup into the Firestore emulator

Step 1 - start firestore emulator

- `firebase emulators:start --only firestore  --export-on-exit=./emulators.backup`

Step 2 - import live db - in a new terminal

- `export FIRESTORE_EMULATOR_HOST=0.0.0.0:8080`
- `firestore-import --accountCredentials service-key.json --backupFile dev-database.json`

Step 3 - close emulator and see exported data

- Press `Ctrl + C` in the terminal to close the emulator
- it will then export the data to `./emulators.backup` to be imported again when you start the emulators next

### Run the app

On VSCode, bring up `build task` menu by pressing `Cmd + Shift + B` and then launch `Start Web app (Windows/Mac)`.

This will launch the

1. Web app - `http://localhost:8100`
2. Firestore emulators UI - `http://localhost:4000`
3. Functions (Server code) compiler using nodemon to watch for changes

### Update Dev Database

To update the local dev db so other devs can get your latest db changes.

```shell
export FIRESTORE_EMULATOR_HOST=0.0.0.0:8080
firestore-export --accountCredentials service-key.json --backupFile dev-database.json
```

### Export Live data

To a local file `output.json`. **Not required for day to day dev.**

```shell
firestore-export --accountCredentials service-key.json --backupFile prod-database.json
```

# Plugin notes

Firebase Stripe extension -
For the integration to work I needed to install these packages into my functions project

- @firebase/app-compat@0.2.3
- @firebase/auth-compat@0.3.3
- @firebase/firestore-compat@0.3.3

&nbsp;

# Angular

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via Jest

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.
