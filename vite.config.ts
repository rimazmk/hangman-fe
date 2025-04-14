import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), viteTsconfigPaths()],
    resolve: {
      alias: {
        src: resolve(__dirname, "src"),
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    define: {
      // Handle CRA environment variables
      "process.env.REACT_APP_SERVER": JSON.stringify(env.VITE_REACT_APP_SERVER),
      "process.env.REACT_APP_ANALYTICS_KEY": JSON.stringify(
        env.VITE_REACT_APP_ANALYTICS_KEY
      ),
    },
  };
});
