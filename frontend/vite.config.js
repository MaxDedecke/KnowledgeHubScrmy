import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget =
    env.API_TARGET_URL ||
    process.env.API_TARGET_URL ||
    "http://127.0.0.1:3000";

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 8081,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: "jsdom",
    },
  };
});

