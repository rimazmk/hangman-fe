// Helper file to maintain compatibility with both CRA and Vite environment variables

export const SERVER_URL =
  import.meta.env.VITE_REACT_APP_SERVER || process.env.REACT_APP_SERVER;
export const ANALYTICS_KEY =
  import.meta.env.VITE_REACT_APP_ANALYTICS_KEY ||
  process.env.REACT_APP_ANALYTICS_KEY;
