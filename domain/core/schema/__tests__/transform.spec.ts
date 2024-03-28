import type { z } from "zod";
import type { packageJsonSchema, workspaceSchema } from "../schema.js";
import { transformPackageJsonToWorkspace } from "../transform.js";

describe("topic: transform", () => {
  test("package json transform", () => {
    const pkg: z.infer<typeof packageJsonSchema> = {
      name: "test",
    };

    const workspace: z.infer<typeof workspaceSchema> = {
      name: pkg.name,
      dependencies: [],
    };

    expect(transformPackageJsonToWorkspace(pkg)).toStrictEqual(workspace);
  });
});
