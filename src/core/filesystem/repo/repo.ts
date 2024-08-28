import { Effect, Option } from "effect";
import { getValidDirectory } from "../fs.ts";
import { getMonorepoInfo } from "./monorepo.ts";
import { getSingleRepoInfo } from "./singlerepo.ts";

export const getRepoInfo = (dirPath: string) =>
  Effect.gen(function* () {
    const validDir = yield* getValidDirectory(dirPath);

    const singleRepo = yield* getSingleRepoInfo(validDir);
    const monorepo = yield* getMonorepoInfo(validDir);

    return monorepo.pipe(Option.orElse(() => singleRepo));
  });
