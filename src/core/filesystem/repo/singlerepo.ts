import { Effect, Option } from "effect";
import { readFileSync } from "fs";
import path from "path";
import {
  decodePackageJson,
  PackageJsonDecoded,
} from "../../schema/package-json.ts";
import { getValidDirectory } from "../fs.ts";
import { RepoInfo } from "./schema.ts";

export const getSingleRepoInfo = (dirPath: string) =>
  getPackageJsonInfo(dirPath).pipe(
    Effect.map(
      Option.flatMap((packageJson) =>
        RepoInfo.decodeOption({
          type: "singlerepo",
          root: packageJson.name,
          workspaces: [packageJson],
        })
      )
    )
  );

export const getPackageJsonInfo = (dirPath: string) =>
  Effect.gen(function* () {
    const validDir = yield* getValidDirectory(dirPath);
    const packageJsonPath = yield* Effect.sync(() =>
      path.join(validDir, "package.json")
    );

    const contents = readFileSync(packageJsonPath, "utf-8");
    const parsed = JSON.parse(contents);
    const decoded = yield* decodePackageJson(parsed as unknown);

    return yield* Effect.succeed(Option.some(decoded));
  }).pipe(
    Effect.catchAllDefect(() =>
      Effect.succeed(Option.none<PackageJsonDecoded>())
    )
  );
