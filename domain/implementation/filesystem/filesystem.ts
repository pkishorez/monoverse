import { getPackages as getWorkspaces } from "@monorepo-utils/package-utils";
import fs from "fs";
import path from "path";
import invariant from "tiny-invariant";
import { transformPackageJsonToWorkspace } from "../../core";

export const getMonorepoInfo = (dirPath: string) => {
  const monorepoDir = detectMonorepoDir(dirPath);
  const workspaceDir = detectWorkspaceDir(dirPath);

  if (monorepoDir) {
    const workspaces = getMonorepoWorkspacesAtDir(monorepoDir)!;
    invariant(workspaces !== undefined, "monorepo should be defined");

    return {
      workspaces,
    };
  } else if (workspaceDir) {
    const workspace = getWorkspaceAtDir(workspaceDir);
    invariant(workspace !== undefined, "workspace should be defined");

    return {
      workspaces: [workspace],
    };
  }
  return undefined;
};

const detectMonorepoDir = (dirPath: string): string | undefined => {
  dirPath = path.resolve(dirPath);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const monorepo = getMonorepoWorkspacesAtDir(dirPath);
    if (monorepo) return dirPath;

    const parentDir = path.dirname(dirPath);
    if (parentDir === dirPath) return undefined;

    dirPath = parentDir;
  }
};

function getMonorepoWorkspacesAtDir(dir: string) {
  const workspaces = getWorkspaces(dir);

  if (!workspaces || workspaces.length === 0) return undefined;

  return workspaces.map((workspace) => {
    const { packageJSON } = workspace;

    return transformPackageJsonToWorkspace(packageJSON);
  });
}

function detectWorkspaceDir(dir: string): string | undefined {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const workspace = getWorkspaceAtDir(dir);
    if (workspace) return dir;

    const parentDir = path.dirname(dir);
    if (parentDir === dir) return undefined;

    dir = parentDir;
  }
}

function getWorkspaceAtDir(dir: string) {
  const workspacePackageJson = path.resolve(dir, "package.json");

  try {
    const packageJson = JSON.parse(
      fs.readFileSync(workspacePackageJson, "utf-8")
    );
    return {
      location: dir,
      ...transformPackageJsonToWorkspace(packageJson),
    };
  } catch {
    return undefined;
  }
}
