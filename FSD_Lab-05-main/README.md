# Task PWA (React + Vite)

A minimal task app built with React and Vite configured as a Progressive Web App (PWA) so users can "install" it from the browser.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

3. Build and preview (to test production build):

```bash
npm run build
npm run preview
```

Notes
- The app registers a simple service worker located at `public/sw.js` and includes `public/manifest.json` so browsers can prompt for installation.
- `localhost` is a secure context, so you can test the install prompt locally when running the build/preview or dev server in modern browsers.
- To publish, deploy the contents of `dist` to any static host (Netlify, Vercel, GitHub Pages, etc.).
