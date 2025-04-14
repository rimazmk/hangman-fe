# Migrating from Create React App to Vite

This project has been migrated from Create React App (CRA) to Vite for improved performance and developer experience.

## Key Changes

- Build tooling changed from CRA to Vite
- Environment variables now need `VITE_` prefix
- HTML template moved from `public/index.html` to `index.html` in the root
- Build scripts in package.json updated
- Material UI imports updated from `@material-ui/core` to `@mui/material`

## Environment Variables

CRA environment variables (`REACT_APP_*`) are now prefixed with `VITE_`. For compatibility, an `env.ts` helper file has been created:

```ts
// src/env.ts
export const SERVER_URL =
  import.meta.env.VITE_REACT_APP_SERVER || process.env.REACT_APP_SERVER;
export const ANALYTICS_KEY =
  import.meta.env.VITE_REACT_APP_ANALYTICS_KEY ||
  process.env.REACT_APP_ANALYTICS_KEY;
```

Replace all instances of `process.env.REACT_APP_*` with the corresponding export from `env.ts`.

## Instructions for Environment Variables

1. Create a `.env` file based on the `.env.example`
2. Update all values with your actual settings:
   ```
   VITE_REACT_APP_SERVER=your_server_url
   VITE_REACT_APP_ANALYTICS_KEY=your_analytics_key
   ```

## Material UI Update

The project has been updated to use the newer MUI v5 libraries. Make the following changes to all components:

1. Replace imports:

   - `@material-ui/core` → `@mui/material`
   - `@material-ui/icons/IconName` → `@mui/icons-material/IconName`

2. API changes:
   - `createMuiTheme` → `createTheme`

## Development

Use the following commands:

- `npm run dev` - Start development server (was `npm start`)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests with Vitest

## Next Steps

The following manual changes are still needed:

1. Update all references to environment variables using the `env.ts` helper
2. Update remaining Material UI imports in all components
3. Test all functionality to ensure the migration was successful
