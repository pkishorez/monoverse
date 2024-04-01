export {
  packageJsonSchema,
  transformPackageJsonToWorkspace,
  transformToMonorepo,
} from "./schema";
export type { Monorepo, Workspace } from "./schema";
export {
  getMaxVersion,
  getMaxVersionFromRange,
  getMinVersionFromRange,
} from "./version.js";
