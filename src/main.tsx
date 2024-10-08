import { RouterProvider, createRouter } from "@tanstack/react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// eslint-disable-next-line import/no-internal-modules
import { SpeedInsights } from "@vercel/speed-insights/react";
import { trpc } from "~/trpc/client.ts";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: ENV.API_BASE_URL })],
});

// Import the generated route tree
import { ENV } from "./env.ts";
import { routeTree } from "./routeTree.gen.ts";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {import.meta.env.VITE_DEPLOYMENT_ENV === "vercel" && <SpeedInsights />}
    {/* @ts-expect-error trpc types issue. */}
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpc.Provider>
  </StrictMode>
);
