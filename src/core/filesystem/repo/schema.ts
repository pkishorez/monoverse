import { Schema } from "@effect/schema";
import { decodedPackageJsonSchema } from "../../schema/package-json.ts";

export class RepoInfo extends Schema.Class<RepoInfo>("RepoInfo")({
  type: Schema.Union(Schema.Literal("singlerepo"), Schema.Literal("monorepo")),
  workspaces: Schema.Array(decodedPackageJsonSchema),
  root: Schema.String,
  meta: Schema.optional(Schema.Any),
}) {
  public static decode = Schema.decode(RepoInfo);
  public static decodeOption = Schema.decodeOption(RepoInfo);
}
