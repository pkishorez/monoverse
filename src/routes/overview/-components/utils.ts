import { TrpcRouterOutputs } from "~/trpc/client";

export const transformOverviewData = (
  data: Exclude<TrpcRouterOutputs["getOverview"], null>,
) => {
  type Workspace = (typeof data)[0];

  const workspacesMap = data.reduce(
    (acc, workspace) => {
      acc[workspace.workspaceName] = workspace;
      return acc;
    },
    {} as Record<string, Workspace>,
  );

  const standalone = data.filter((v) => v.type === "standalone");
  const leaf = data.filter((v) => v.type === "leaf");
  const internal = data.filter((v) => v.type === "internal");

  const internalDependencyLevels: { level: number; workspaces: Workspace[] }[] =
    [];
  let allInternalWorkspaces = internal.map((v) => v.workspaceName);

  let prevLevel = standalone;
  while (prevLevel.length > 0) {
    const level = internalDependencyLevels.length;
    const currentLevel: Workspace[] = [];

    for (const internalDependency of prevLevel.flatMap(
      (v) => v.internalDependencies,
    )) {
      if (allInternalWorkspaces.includes(internalDependency)) {
        currentLevel.push(workspacesMap[internalDependency]);

        // Remove from internalDependencies to avoid duplicates
        allInternalWorkspaces = allInternalWorkspaces.filter(
          (v) => v !== internalDependency,
        );
      }
    }

    if (currentLevel.length === 0) {
      break;
    }

    prevLevel = currentLevel;
    internalDependencyLevels.push({ level, workspaces: currentLevel });
  }

  if (allInternalWorkspaces.length > 0) {
    internalDependencyLevels.push({
      level: -1,
      workspaces: allInternalWorkspaces.map((v) => workspacesMap[v]),
    });
  }

  const links = data.flatMap((v) =>
    v.internalDependencies.map((id) => ({
      from: v.workspaceName,
      to: id,
    })),
  );

  const overview = [
    {
      label: "Applications",
      workspaces: standalone,
    },
    ...internalDependencyLevels.map(({ level, workspaces }) => ({
      label: `Level ${level + 1}`,
      workspaces,
    })),
    {
      label: "Base libraries",
      workspaces: leaf,
    },
  ];

  return {
    overview,
    standalone,
    leaf,
    internal,
    internalDependencyLevels,
    links,
  };
};
