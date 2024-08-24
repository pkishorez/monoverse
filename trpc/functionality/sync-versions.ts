import { getMonorepoInfo, syncDependencyVersions } from "~/domain/index.ts";

export const syncVersions = (
  // TODO: For reducing api calls, we could also pass the monorepo info here.
  dirPath: string,
  updates: Parameters<typeof syncDependencyVersions>[1]
) => {
  const monorepoInfo = getMonorepoInfo(dirPath);

  if (!monorepoInfo) {
    return null;
  }

  return syncDependencyVersions(monorepoInfo, updates);
};
