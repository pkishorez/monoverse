import { getMonorepoInfo } from "~/domain";

export const getOverview = (dirPath: string) => {
  const monorepoInfo = getMonorepoInfo(dirPath);

  if (!monorepoInfo) {
    return null;
  }

  const workspacesMap = monorepoInfo.workspaces.reduce(
    (acc, workspace) => {
      acc[workspace.name] = workspace;
      return acc;
    },
    {} as Record<string, (typeof monorepoInfo.workspaces)[0]>,
  );

  const dependencyLinks = monorepoInfo.workspaces.map((workspace) => {
    const internalDependencies = workspace.dependencies
      .filter((dep) => !!workspacesMap[dep.name])
      .map((v) => v.name);

    return {
      workspaceName: workspace.name,
      internalDependencies,
    };
  });

  const getDependencyType = (
    workspace: string,
  ): "internal" | "leaf" | "standalone" => {
    const hasDecendants =
      dependencyLinks.find((v) => v.workspaceName === workspace)!
        .internalDependencies.length > 0;

    const hasAncestors =
      dependencyLinks.filter((v) => {
        if (v.workspaceName === workspace) return false;
        if (v.internalDependencies.includes(workspace)) return true;

        return false;
      }).length > 0;

    if (hasDecendants && hasAncestors) {
      return "internal";
    }

    if (hasAncestors) {
      return "leaf";
    }

    return "standalone";
  };

  return dependencyLinks.map((link) => {
    return {
      ...link,
      dependenciesCount: workspacesMap[link.workspaceName].dependencies.length,
      type: getDependencyType(link.workspaceName),
    };
  });
};
