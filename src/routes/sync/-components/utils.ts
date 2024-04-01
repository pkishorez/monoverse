import { groupBy, uniq } from "lodash-es";
import { Dependency } from "./columns";

const dependencyGroups = (dependencies: Dependency[]) =>
  Object.entries(
    groupBy(dependencies, (dependency) => dependency.dependencyName),
  ).map(([dependencyName, dependencies]) => ({
    dependencyName,
    dependencies,
  }));

export const getOutofSyncDependencies = (dependencies: Dependency[]) =>
  dependencyGroups(dependencies).filter(
    ({ dependencies }) =>
      uniq(dependencies.map((v) => v.versionRange)).length > 1,
  );
