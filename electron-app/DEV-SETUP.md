# Development Setup

## Hot Reload Configuration

This Electron app now supports automatic reloading during development:

### Features:
1. **TSX Hot Module Replacement (HMR)**: Changes to React components are hot-reloaded without losing state
2. **Webpack Dev Server**: Serves content from `http://localhost:3000` during development
3. **Electron Auto-Restart**: Main process restarts when electron source files change
4. **Automatic Window Reload**: Window reloads if renderer becomes unresponsive

### Development Commands:

```bash
# Start development with hot reload
yarn dev

# Start only webpack dev server
yarn start

# Start only electron (requires dev server to be running)
yarn electron:dev
```

### How it works:

1. **Webpack Dev Server** (`yarn start`):
   - Runs on port 3000
   - Watches TSX/CSS files in `src/renderer`
   - Provides HMR for React components
   - Auto-reloads browser when files change

2. **Nodemon** (`yarn electron:dev`):
   - Watches `src/electron` files only
   - Restarts Electron main process when main process files change
   - Has 2s delay to allow webpack server to start

3. **Main Process**:
   - Loads from `http://localhost:3000` in development
   - Loads from `dist/index.html` in production
   - Waits for dev server to be ready before loading

### File Structure:
```
src/
├── electron/          # Main process files (watched by nodemon)
│   ├── main.js
│   └── preload.js
├── renderer/          # Renderer process files (watched by webpack)
│   ├── index.tsx
│   └── components/
└── types/            # TypeScript definitions
    └── webpack.d.ts  # HMR types
```

### Troubleshooting:

1. **Dev server not ready**: Wait a few seconds for webpack to start
2. **Port conflicts**: Change PORT in main.js if needed
3. **TypeScript errors**: Make sure all dependencies are installed
4. **Window not reloading**: Check browser console for HMR errors

### Production Build:

```bash
# Build for production
yarn build

# Build and package electron app
yarn electron:build
```
