# React + TypeScript + Vite

## Offline map

The map uses a local PMTiles map package for Eindhoven in
`public/maps/eindhoven.pmtiles`. Vite copies this file to `dist/maps` during
`npm run build`, so the production build does not need an external map server.

The package covers the area from `5.15,51.20` to `5.80,51.68` at zoom levels
0–15. The basemap is based on Protomaps and OpenStreetMap. Keep the visible
attribution in the application when replacing the map package.

For a real offline test, serve the built `dist` directory from the Raspberry Pi
while the Pi has no internet connection. Then connect a phone using only the
local WiFi network.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
