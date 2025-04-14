/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_SERVER: string;
  readonly VITE_REACT_APP_ANALYTICS_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
