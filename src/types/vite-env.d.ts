/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TRPC_API_ROUTE: string;
  readonly VITE_PROJECT_MODE: "online" | "offline";
  readonly VITE_DEPLOYMENT_ENV: "cli" | "local" | "vercel";
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
