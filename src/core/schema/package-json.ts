import { Schema } from "@effect/schema";

const dependency = Schema.Struct({
  pkg: Schema.String,
  version: Schema.String,
});
const dependencyType = Schema.Union(
  Schema.Literal("dependency"),
  Schema.Literal("devDependency"),
  Schema.Literal("optionalDependency"),
  Schema.Literal("peerDependency")
);
type DependencyType = Schema.Schema.Type<typeof dependencyType>;
type Dependency = Schema.Schema.Type<typeof dependency>;

const addDependencyType =
  (type: DependencyType) => (dependency: Dependency) => ({
    ...dependency,
    type,
  });

const encodedDependencies = Schema.transform(
  Schema.Record({ key: Schema.String, value: Schema.String }),
  Schema.Array(dependency),
  {
    decode: (record) =>
      Object.entries(record).map(([key, value]) => ({
        pkg: key,
        version: value,
      })),
    encode: (array) =>
      array.reduce((acc, { pkg, version }) => {
        acc[pkg] = version;
        return acc;
      }, {} as Record<string, string>),
  }
);

const decodedDependencies = Schema.Array(
  Schema.extend(
    dependency,
    Schema.Struct({
      type: dependencyType,
    })
  )
);

export const workspaceGlobsSchema = Schema.Array(Schema.String);

const common = {
  name: Schema.String,
  workspaces: Schema.optional(workspaceGlobsSchema),
};
export const encodedPackageJsonSchema = Schema.Struct({
  ...common,
  dependencies: Schema.optional(encodedDependencies),
  devDependencies: Schema.optional(encodedDependencies),
  optionalDependencies: Schema.optional(encodedDependencies),
  peerDependencies: Schema.optional(encodedDependencies),
});

export const decodedPackageJsonSchema = Schema.Struct({
  ...common,
  dependencies: decodedDependencies,
});

const transformed = Schema.transform(
  encodedPackageJsonSchema,
  decodedPackageJsonSchema,
  {
    decode: ({
      dependencies = [],
      devDependencies = [],
      optionalDependencies = [],
      peerDependencies = [],
      ...rest
    }) => ({
      ...rest,
      dependencies: [
        ...dependencies.map(addDependencyType("dependency")),
        ...devDependencies.map(addDependencyType("devDependency")),
        ...optionalDependencies.map(addDependencyType("optionalDependency")),
        ...peerDependencies.map(addDependencyType("peerDependency")),
      ],
    }),
    encode: ({ dependencies, ...rest }) => ({
      ...rest,
      dependencies: dependencies.filter((v) => v.type === "dependency"),
      optionalDependencies: dependencies.filter(
        (v) => v.type === "optionalDependency"
      ),
      devDependencies: dependencies.filter((v) => v.type === "devDependency"),
      peerDependencies: dependencies.filter((v) => v.type === "peerDependency"),
    }),
    strict: true,
  }
);

export interface PackageJsonEncoded
  extends Schema.Schema.Encoded<typeof transformed> {}
export interface PackageJsonDecoded
  extends Schema.Schema.Type<typeof transformed> {}

export const PackageJson: Schema.Schema<
  PackageJsonDecoded,
  PackageJsonEncoded
> = transformed;

export const decodePackageJson = Schema.decodeUnknown<
  PackageJsonDecoded,
  PackageJsonEncoded,
  never
>(transformed);

export const encodePackageJson = Schema.encode<
  PackageJsonDecoded,
  PackageJsonEncoded,
  never
>(transformed);
