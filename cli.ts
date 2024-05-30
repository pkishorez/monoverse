#!/usr/bin/env node
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-internal-modules */
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { fileURLToPath } from "node:url";
import path from "path";
import { appRouter } from "./trpc";

const __DIRNAME = fileURLToPath(new URL(".", import.meta.url));
const app = express();

app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  }),
);
app.use(express.static("dist"));
app.get("*", (_, res) => {
  res.sendFile(path.join(__DIRNAME, "dist", "index.html"));
});

const port = 21212;

app.listen(port, () => {
  console.log(`Server listening... http://localhost:${port}/`);
});
