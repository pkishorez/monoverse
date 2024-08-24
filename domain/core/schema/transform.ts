import type { z } from "zod";
import { removeUndefined } from "../../tools/index.ts";
import {
  dependencySchema,
  packageJsonSchema,
  workspaceSchema,
} from "./schema.js";
import { Monorepo, Workspace } from "./types.js";

export const transformPackageJsonToWorkspace = (
  packageJson: unknown
): Workspace => {
  const validatedPackageJson = packageJsonSchema.parse(packageJson);

  const {
    dependencies,
    devDependencies,
    peerDependencies,
    optionalDependencies,
  } = validatedPackageJson;

  const getDependencies = (
    list: z.infer<typeof packageJsonSchema>["dependencies"],
    type: z.infer<typeof dependencySchema>["type"]
  ): z.infer<typeof dependencySchema>[] => {
    if (!list) return [];

    return Object.entries(list).map(([name, versionRange]) => {
      return {
        name,
        versionRange,
        type,
      };
    });
  };

  return workspaceSchema.parse(
    // removeUndefined to ensure that the workspace doesn't have any undefined
    removeUndefined({
      name: validatedPackageJson.name,
      description: validatedPackageJson.description,
      dependencies: [
        ...getDependencies(dependencies, "dependency"),
        ...getDependencies(devDependencies, "devDependency"),
        ...getDependencies(peerDependencies, "peerDependency"),
        ...getDependencies(optionalDependencies, "optionalDependency"),
      ],
    })
  );
};

export const transformToMonorepo = (workspaces: Workspace[]): Monorepo => {
  return {
    workspaces,
  };
};
