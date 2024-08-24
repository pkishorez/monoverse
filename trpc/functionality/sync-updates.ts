import { getMonorepoInfo } from "~/domain/index.ts";

export const getSyncUpdates = (dirPath: string) => {
  const monorepoInfo = getMonorepoInfo(dirPath);

  if (!monorepoInfo) {
    return null;
  }

  const workspaceMap = monorepoInfo.workspaces.reduce((acc, { workspace }) => {
    acc[workspace.name] = true;
    return acc;
  }, {} as Record<string, boolean>);

  return monorepoInfo.workspaces.flatMap(({ workspace }) => {
    return workspace.dependencies.map((dependency) => {
      return {
        dependencyName: dependency.name,
        dependencyType: dependency.type,
        workspaceName: workspace.name,
        versionRange: dependency.versionRange,
        isInternalDependency: !!workspaceMap[dependency.name],
      };
    });
  });
};
