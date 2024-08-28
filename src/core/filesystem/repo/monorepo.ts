import { Schema } from "@effect/schema";
import { Effect, Option } from "effect";
import fg from "fast-glob";
import { readFileSync } from "fs";
import { load as yamlLoad } from "js-yaml";
import path from "path";
// import { PackageJsonDecoded } from "../../schema/package-json.ts";
import { RepoInfo } from "./schema.ts";
import { getPackageJsonInfo } from "./singlerepo.ts";

export const getMonorepoInfo = (dirPath: string) =>
  Effect.gen(function* () {
    const packageJsonDetails = yield* getPackageJsonInfo(dirPath);
    const workspaces = yield* getMonorepoWorkspaces(dirPath);

    if (Option.isSome(workspaces) && Option.isSome(packageJsonDetails)) {
      return RepoInfo.decodeOption({
        type: "monorepo" as const,
        workspaces: [packageJsonDetails.value, ...workspaces.value],
        root: packageJsonDetails.value.name,
      });
    }

    return Option.none<RepoInfo>();
  });

const getMonorepoWorkspaces = (dirPath: string) =>
  Effect.gen(function* () {
    const workspaceGlobs = yield* getMonorepoWorkspaceGlobs(dirPath);

    const allEntries = yield* workspaceGlobs.pipe(
      Option.map((globs) =>
        globs.flatMap((glob) =>
          // eslint-disable-next-line import/no-named-as-default-member
          fg.globSync(glob, {
            cwd: dirPath,
            onlyDirectories: true,
            absolute: true,
          })
        )
      ),
      Option.map((paths) => paths.map((p) => getPackageJsonInfo(p)))
    );

    const packageJsons = (yield* Effect.all(allEntries))
      .filter(Option.isSome)
      .map((o) => o.value);

    return Option.some(packageJsons);
  })
    .pipe
    // Effect.catchAllDefect(() =>
    //   Effect.succeed(Option.none<PackageJsonDecoded[]>())
    // ),
    // Effect.catchAll(() => Effect.succeed(Option.none<PackageJsonDecoded[]>()))
    ();

export const getMonorepoWorkspaceGlobs = (dirPath: string) =>
  Effect.gen(function* () {
    const packageJsonWorkspaceGlobs = yield* getPackageJsonWorkspaceGlobs(
      dirPath
    );

    if (Option.isSome(packageJsonWorkspaceGlobs)) {
      return packageJsonWorkspaceGlobs;
    }
    const pnpmWorkspaceGlobs = yield* getPnpmWorkspaceGlobs(
      path.join(dirPath, "pnpm-workspace.yaml")
    );

    if (Option.isSome(pnpmWorkspaceGlobs)) {
      return pnpmWorkspaceGlobs;
    }
    return yield* getPnpmWorkspaceGlobs(
      path.join(dirPath, "pnpm-workspace.yml")
    );
  }).pipe(
    Effect.catchAll(() => Effect.succeed(Option.none<readonly string[]>())),
    Effect.catchAllDefect(() =>
      Effect.succeed(Option.none<readonly string[]>())
    )
  );

const getPackageJsonWorkspaceGlobs = (dirPath: string) =>
  Effect.gen(function* () {
    const packageDetails = yield* getPackageJsonInfo(dirPath);

    return packageDetails.pipe(
      Option.map((details) => details.workspaces),
      Option.filter((workspaces) => !!workspaces),
      Option.filter((workspaces) => workspaces.length > 0)
    );
  });

const getPnpmWorkspaceGlobs = (yamlPath: string) =>
  Effect.gen(function* () {
    const workspacesSchema = Schema.Struct({
      packages: Schema.Array(Schema.String),
    });

    const contents = readFileSync(yamlPath, "utf-8");
    const parsed = yamlLoad(contents);
    const decoded = yield* Schema.decodeUnknown(workspacesSchema)(parsed);

    return Option.some(decoded.packages);
  }).pipe(
    Effect.catchAll(() => Effect.succeed(Option.none<readonly string[]>()))
  );
