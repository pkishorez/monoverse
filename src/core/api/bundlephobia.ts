import { Schema as S } from "@effect/schema";
import { Effect, pipe } from "effect";
import { FetchError } from "../errors.ts";

const responseSchema = S.Struct({
  assets: S.Array(
    S.Struct({
      gzip: S.Number,
      name: S.String,
      size: S.Number,
      type: S.String,
    })
  ),
  dependencyCount: S.Number,
  dependencySizes: S.Array(
    S.Struct({ approximateSize: S.Number, name: S.String })
  ),
  description: S.optionalWith(S.String, {}),
  name: S.String,
  version: S.String,
});
const decodeResponse = S.decodeUnknownSync(responseSchema);

export const fetchBundleInfo = (packageName: string) =>
  pipe(
    Effect.tryPromise({
      try: () =>
        fetch(`https://bundlephobia.com/api/size?package=${packageName}`),
      catch: () => new FetchError(`Failed to fetch ${packageName}`),
    }),
    Effect.map((response) => response.json()),
    Effect.map(decodeResponse)
  );
