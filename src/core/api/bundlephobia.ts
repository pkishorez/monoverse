import { Schema as S, Schema } from "@effect/schema";
import { Effect, pipe } from "effect";
import { fetchJson } from "./utils.ts";

class BundleInfo extends Schema.Class<BundleInfo>("BundleInfo")({
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
}) {
  public static decode = Schema.decodeUnknown(BundleInfo);
}

export const getBundleInfo = (packageName: string) =>
  pipe(
    fetchJson(`https://bundlephobia.com/api/size?package=${packageName}`),
    Effect.map(BundleInfo.decode)
  );
