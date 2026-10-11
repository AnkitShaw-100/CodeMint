# CodeMint

Secure JWT secrets and strong passwords, generated entirely in your browser.

CodeMint is a small, focused web tool for developers who need cryptographically secure secrets without trusting a third-party server. Every value is produced on-device with the Web Crypto API. Nothing is logged, stored, or transmitted.

## Contents

- [Features](#features)
- [Security Model](#security-model)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

## Features

### JWT Secret Generator

- Key sizes of 128, 256, 384, and 512 bits
- Output encodings: Base64, Base64URL, and Hexadecimal
- Strength guidance mapped to HMAC algorithms (HS256, HS384, HS512)

### Password Generator

- Adjustable length from 4 to 32 characters
- Toggle uppercase, lowercase, numbers, and symbols independently
- Live strength estimate with approximate entropy in bits

### Interface

- One-click copy to clipboard with visual confirmation
- Light and dark appearance, remembered between visits
- Responsive layout with touch-friendly controls (44 pt minimum tap targets)
- Keyboard accessible, with visible focus states and screen reader announcements

## Security Model

| Concern | Approach |
| --- | --- |
| Randomness | `crypto.getRandomValues()`, the browser's cryptographically secure random number generator |
| Data handling | All generation runs client-side. No network requests are made with generated values. |
| Persistence | Generated values live only in memory and are cleared on page reload. The only item written to `localStorage` is the theme preference. |
| Key length guidance | Follows [RFC 7518 Section 3.2](https://www.rfc-editor.org/rfc/rfc7518#section-3.2): an HMAC key should be at least as long as the hash output. 128-bit keys are flagged as below the HS256 minimum. |

Password strength is estimated as `length * log2(pool size)`, where the pool size is the combined number of characters in the enabled sets. This is an upper-bound estimate for randomly generated passwords and should not be applied to human-chosen passwords.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [React 19](https://react.dev) |
| Build tool | [Vite 7](https://vite.dev) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| UI primitives | [Radix UI](https://www.radix-ui.com) via [shadcn/ui](https://ui.shadcn.com) |
| Routing | [React Router 7](https://reactrouter.com) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| Notifications | [Sonner](https://sonner.emilkowal.ski) |
| Icons | [Lucide](https://lucide.dev) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20.19 or later (or 22.12 or later)
- npm 10 or later

### Installation

```bash
git clone https://github.com/AnkitShaw-100/CodeMint.git
cd CodeMint
npm install
```

### Run locally

```bash
npm run dev
```

The app is served at [http://localhost:5173](http://localhost:5173).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot module replacement |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Serve the production build locally for verification |
| `npm run lint` | Run ESLint across the project |

## Project Structure

```
CodeMint/
├── public/                 Static assets copied as-is to the build
├── src/
│   ├── components/
│   │   └── ui/             shadcn/ui component library
│   ├── hooks/              Shared React hooks
│   ├── lib/                Utilities (class name merging)
│   ├── pages/
│   │   ├── Index.jsx       Main page: navigation, generators, and layout
│   │   └── NotFound.jsx    404 page
│   ├── App.jsx             Providers (theme, tooltips, query client) and routes
│   ├── index.css           Design tokens for light and dark mode
│   └── main.jsx            Application entry point
├── index.html
├── vite.config.js
└── package.json
```

## Deployment

CodeMint builds to a static bundle and can be hosted on any static provider, such as Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

```bash
npm run build
```

Upload the contents of `dist/`. Because the app uses client-side routing, configure your host to rewrite unknown paths to `index.html` so the 404 page is rendered by the app.

Serve the site over HTTPS. The Clipboard API requires a secure context, and HTTPS ensures the generator code itself has not been tampered with in transit.

## Browser Support

CodeMint runs in all current versions of Chrome, Edge, Firefox, and Safari, on desktop and mobile. It requires:

- Web Crypto API (`crypto.getRandomValues`)
- Async Clipboard API (`navigator.clipboard.writeText`), available on HTTPS and `localhost`

## Contributing

Contributions are welcome.

1. Fork the repository and create a branch from `main`.
2. Make your changes and confirm `npm run lint` and `npm run build` both pass.
3. Open a pull request describing the change and its motivation.

For significant changes, please open an issue first to discuss the approach.

## License

No license has been specified yet. Until one is added, all rights are reserved by the author.
