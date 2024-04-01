import { getMonorepoInfo, syncDependencyVersions } from "~/domain";

export const syncVersions = (
  dirPath: string,
  updates: Parameters<typeof syncDependencyVersions>[1],
) => {
  const monorepoInfo = getMonorepoInfo(dirPath);

  if (!monorepoInfo) {
    return null;
  }

  return syncDependencyVersions(monorepoInfo, updates);
};
