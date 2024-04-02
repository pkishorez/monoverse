import { z } from "zod";

const projectSchema = z.union([
  z.object({
    type: z.literal("local"),
    dirPath: z.string(),
  }),
  z.object({
    type: z.literal("github"),
    url: z.string(),
  }),
]);

export const stateValueSchema = z.object({
  theme: z.enum(["light", "dark"]),
  projects: z.object({
    list: z.array(projectSchema),
  }),
});

export const stateSchema = stateValueSchema.and(
  z.object({
    toggleTheme: z.function().args().returns(z.void()),
  }),
);

export type StateValueType = z.infer<typeof stateValueSchema>;
export type StateType = z.infer<typeof stateSchema>;

export const initialState: StateValueType = {
  theme: "light",
  projects: {
    list: [],
  },
};
