import fs from "fs";
import path from "path";
import { sortPackageJson } from "sort-package-json";
import { getMonorepoInfo } from "./filesystem.ts";

export const syncDependencyVersions = (
  monorepoInfo: Exclude<ReturnType<typeof getMonorepoInfo>, undefined>,
  updates: {
    dependencyName: string;
    versionRange: string;
  }[]
) => {
  try {
    const updatedWorkspaces: Set<string> = new Set();
    for (const update of updates) {
      for (const { packageJSON, workspace } of monorepoInfo.workspaces) {
        if (packageJSON.dependencies?.[update.dependencyName]) {
          packageJSON.dependencies[update.dependencyName] = update.versionRange;
          updatedWorkspaces.add(workspace.name);
        }

        if (packageJSON.devDependencies?.[update.dependencyName]) {
          packageJSON.devDependencies[update.dependencyName] =
            update.versionRange;
          updatedWorkspaces.add(workspace.name);
        }

        if (packageJSON.peerDependencies?.[update.dependencyName]) {
          packageJSON.peerDependencies[update.dependencyName] =
            update.versionRange;
          updatedWorkspaces.add(workspace.name);
        }
      }
    }

    for (const {
      location,
      workspace,
      packageJSON,
    } of monorepoInfo.workspaces) {
      if (updatedWorkspaces.has(workspace.name)) {
        fs.writeFileSync(
          path.join(location, "package.json"),
          sortPackageJson(JSON.stringify(packageJSON, null, 2))
        );
      }
    }
  } catch {
    return { success: false };
  }

  return { success: true };
};
