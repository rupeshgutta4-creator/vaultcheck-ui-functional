# VaultCheck

VaultCheck is a privacy-first password security analysis platform. Passwords are analyzed in the browser and are never persisted by the server. The optional breach check uses k-anonymity: the browser sends only a short hash prefix to the upstream range API.

## Features

- Client-side password strength scoring and entropy analysis
- Character-set, sequence, dictionary-shape, and policy analysis
- Offline breach-hash lookup
- Have I Been Pwned range-query proxy that accepts only 5-character SHA-1 prefixes
- Modular production service layer for scoring, risk, audit, reporting, compliance, operations, and security workflows
- Service registry and health endpoints
- Structured logging and error handling
- Jest tests with coverage
- Docker packaging
- No database and no password persistence

## Requirements

- Node.js 18+
- npm 9+

## Install

```bash
npm install
```

## Run

```bash
npm start
```

Open `http://localhost:3000`.

## Development

```bash
npm run dev
npm test
npm run validate
npm run smoke
```

## API

- `GET /api/health` — application health
- `GET /api/services` — registered production service catalog
- `GET /api/services/:name/health` — service health
- `POST /api/services/:name/validate` — validate a JSON object against a service's generic contract
- `GET /api/hibp/range/:prefix` — privacy-preserving 5-character hash-prefix proxy

## Security and privacy

The server deliberately does not accept passwords for analysis or store password material. Do not add password fields to server-side persistence. HIBP requests must remain prefix-only. Environment files and secrets are excluded from version control.

## Project structure

```text
vaultcheck/
├── public/                  # browser application
├── server/
│   ├── api/                 # HTTP API adapters
│   ├── lib/                 # small infrastructure helpers
│   ├── modules/             # production security/domain services
│   ├── service-registry.js  # service catalog and factory
│   └── index.js             # Express entry point
├── tests/                   # automated tests
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md
```

## Build

There is no bundling step. The application is a static browser client plus a Node.js/Express server. The deployment artifact is created with Docker or by packaging the repository.

```bash
npm run build
docker build -t vaultcheck .
docker run --rm -p 3000:3000 vaultcheck
```

## Ownership

VaultCheck is proprietary software. No open-source license is granted by this repository. Third-party dependencies retain their own licenses.
