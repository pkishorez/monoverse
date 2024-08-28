import { Effect } from "effect";
import { FetchError } from "../errors.ts";

export const fetchJson = (url: string) =>
  Effect.flatMap(
    Effect.tryPromise({
      try: () => fetch(url),
      catch: () => new FetchError(`Failed to fetch ${url}`),
    }),
    (response) =>
      Effect.tryPromise({
        try: (): Promise<unknown> => response.json(),
        catch: () => new FetchError(`Failed to parse JSON from ${url}`),
      })
  );
