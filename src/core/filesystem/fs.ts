import { Effect } from "effect";
import { statSync } from "node:fs";
import path from "node:path";
import { InvalidFilesystemPath } from "../errors.ts";

const isDirectory = (path: string) =>
  Effect.try(() => statSync(path).isDirectory()).pipe(
    Effect.orElse(() => Effect.succeed(false))
  );

export const getValidDirectory = (dirPath: string) =>
  Effect.gen(function* () {
    const isDir = yield* isDirectory(dirPath);

    if (isDir) {
      return dirPath;
    }

    const parentDir = path.dirname(dirPath);
    const isParentADirectory = yield* isDirectory(parentDir);

    if (isParentADirectory) {
      return parentDir;
    }

    return yield* Effect.fail(
      new InvalidFilesystemPath(
        `Path provided is not a valid file path: ${dirPath}`
      )
    );
  });

export const traverseUp = (dirPath: string) => path.dirname(dirPath);

export const isAbsolutePath = (filePath: string) => path.isAbsolute(filePath);
