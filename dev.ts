// eslint-disable-next-line import/no-internal-modules
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import ViteExpress from "vite-express";
import express from "express";

const app = express();

app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

ViteExpress.listen(app, 5173, () => {
  console.log("Server listening... http://localhost:5173/");
});
