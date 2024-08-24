/* eslint-disable import/no-internal-modules */
import { z } from "zod";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { StateType, initialState, stateValueSchema } from "./state.ts";

export const useStore = create<StateType>()(
  devtools(
    persist(
      (set, get) => {
        return {
          ...initialState,

          toggleTheme: () => {
            set({
              theme: get().theme === "dark" ? "light" : "dark",
            });
          },
          removeProject: (project) => {
            set({
              ...get(),
              projects: {
                ...get().projects,
                list: get().projects.list.filter(
                  (p) => p.value !== project.value
                ),
              },
            });
          },
          addProject: (project) => {
            if (get().projects.list.some((p) => p.value === project.value)) {
              return;
            }
            set({
              ...get(),
              projects: {
                ...get().projects,
                list: [...get().projects.list, project],
              },
            });
          },
          selectProject: (project) => {
            set({
              ...get(),
              projects: {
                ...get().projects,
                selected: project,
              },
            });
          },
          resetProject() {
            set({
              ...get(),
              projects: {
                ...get().projects,
                selected: undefined,
              },
            });
          },
        };
      },
      {
        name: "monoverse-local-state",
        storage: {
          getItem: (name) => {
            const value = localStorage.getItem(name);
            if (!value) return null;

            try {
              const persistSchema = z.object({
                state: stateValueSchema,
                version: z.number(),
              });

              const persisted = persistSchema.parse(JSON.parse(value));

              if (persisted.state.version !== initialState.version) {
                return null;
              }

              return persisted;
            } catch (err) {
              console.log("Error parsing local storage", err);
              return null;
            }
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => localStorage.removeItem(name),
        },
      }
    )
  )
);

export const store = useStore;
