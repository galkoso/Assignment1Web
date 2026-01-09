# Express TypeScript Project with Node.js v24

A TypeScript Express.js application configured for Node.js v24.

## Prerequisites

- Node.js v24 or higher
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
1. Build the TypeScript code:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

### Type Checking
```bash
npm run type-check
```

The server will start on `http://localhost:3000`

## Endpoints

- `GET /` - Welcome message with Node.js version info
- `GET /health` - Health check endpoint

## Project Structure

```
.
├── src/
│   └── server.ts      # Main Express server file (TypeScript)
├── dist/               # Compiled JavaScript output (generated)
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

