export {
  packageJsonSchema,
  transformPackageJsonToWorkspace,
  transformToMonorepo,
} from "./schema/index.ts";
export type { Monorepo, Workspace } from "./schema/index.ts";
export {
  getMaxVersion,
  getMaxVersionFromRange,
  getMinVersionFromRange,
} from "./version.ts";
