import { getMonorepoInfo } from "~/domain";

export const getSyncUpdates = (dirPath: string) => {
  const monorepoInfo = getMonorepoInfo(dirPath);

  if (!monorepoInfo) {
    return null;
  }

  const depMap: Record<
    string,
    {
      name: string;
      workspaces: {
        name: string;
        versionRange: string;
      }[];
    }
  > = {};

  monorepoInfo.workspaces.forEach((workspace) => {
    workspace.dependencies.forEach((dep) => {
      if (!depMap[dep.name]) {
        depMap[dep.name] = {
          name: dep.name,
          workspaces: [],
        };
      }
      depMap[dep.name].workspaces.push({
        name: workspace.name,
        versionRange: dep.versionRange,
      });
    });
  });

  return Object.values(depMap);
};
