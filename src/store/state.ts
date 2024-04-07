import { z } from "zod";

const projectSchema = z.union([
  z.object({
    type: z.literal("filepath"),
    value: z.string(),
  }),
  z.object({
    type: z.literal("url"),
    value: z.string(),
  }),
]);

export const stateValueSchema = z.object({
  version: z.string(),
  theme: z.enum(["light", "dark"]),
  projects: z.object({
    selected: projectSchema.optional(),
    list: z.array(projectSchema),
  }),
});

export const stateSchema = stateValueSchema.and(
  z.object({
    toggleTheme: z.function().args().returns(z.void()),
    addProject: z.function().args(projectSchema).returns(z.void()),
    selectProject: z.function().args(projectSchema).returns(z.void()),
    removeProject: z.function().args(projectSchema).returns(z.void()),
    resetProject: z.function().returns(z.void()),
  }),
);

export type StateValueType = z.infer<typeof stateValueSchema>;
export type StateType = z.infer<typeof stateSchema>;

export const initialState: StateValueType = {
  version: "0.0.1",
  theme: "light",
  projects: {
    list: [
      {
        type: "url",
        value: "https://github.com/vercel/turbo/archive/refs/heads/main.zip",
      },
    ],
  },
};
