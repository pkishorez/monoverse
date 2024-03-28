import { z } from "zod";
import { packageSchema } from "./schema.js";

const requestSchema = z.string();
const responseSchema = z.object({
  name: z.string(),
  versions: z.record(z.any()),

  description: z.string().optional(),
  repository: z
    .object({
      url: z.string().optional(),
    })
    .optional(),
  licence: z.string().optional(),
});

export const fetchPackageInfo = async (input: unknown) => {
  const packageName = requestSchema.parse(input);
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);
  const json = await response.json();

  const pkg = responseSchema.parse(json);

  return packageSchema.parse({
    name: pkg.name,
    versions: Object.keys(pkg.versions),
    description: pkg.description,
    repository: pkg.repository?.url,
    licence: pkg.licence,
  });
};
