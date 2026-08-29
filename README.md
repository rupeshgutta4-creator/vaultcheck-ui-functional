# VaultCheck

Client-side password strength analyzer and k-anonymity breach checker.  
No database. Passwords never leave the browser.

**Proprietary software.** All rights reserved.

## Prerequisites

- Node.js 18 or later
- npm 9 or later

## Installation

```bash
npm install
```

## Run

```bash
npm start
```

Then open http://localhost:3000 in your browser.

Development (same as start for this project):

```bash
npm run dev
```

## Tests

```bash
npm test
```

Coverage report is written to `coverage/`.

## Project structure

```
vaultcheck/
├── server/
│   └── index.js          # Express static server + HIBP proxy
├── public/
│   ├── index.html
│   ├── app.js            # Strength scoring + offline/online breach checks
│   ├── styles.css
│   └── data/
│       └── offline-breach-hashes.txt
├── tests/
│   └── strength.test.js
├── package.json
├── package-lock.json
└── README.md
```

## Dependencies

- **express** – lightweight static file server and thin HIBP range proxy
- **jest** (dev) – unit tests and coverage

## Usage

1. Type or paste a password into the input field.
2. Strength score, estimated crack time, policy findings and entropy update live.
3. Offline breach check runs against the bundled hash list (no network).
4. Optional online HaveIBeenPwned k-anonymity lookup uses only a 5-character SHA-1 prefix.

## License

Proprietary. Not open source. Do not distribute without permission.
