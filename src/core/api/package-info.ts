import { Schema } from "@effect/schema";
import { Effect } from "effect";
import { fetchJson } from "./utils.ts";

class PackageInfo extends Schema.Class<PackageInfo>("PackageInfoSchema")({
  name: Schema.String,
  versions: Schema.transform(
    Schema.Record({
      key: Schema.String,
      value: Schema.Any,
    }),
    Schema.Array(Schema.String),
    {
      decode: (record) => Object.keys(record),
      encode: (v) => v,
    }
  ),
  description: Schema.optional(Schema.String),
  repository: Schema.optional(
    Schema.Struct({
      url: Schema.optional(Schema.String),
    })
  ),
  licence: Schema.optional(Schema.String),
}) {
  public static decode = Schema.decodeUnknown(PackageInfo);
}

export const getPackageInfo = (pkg: string) =>
  Effect.gen(function* () {
    const json = yield* fetchJson(`https://registry.npmjs.org/${pkg}`);
    return yield* PackageInfo.decode(json);
  });
