/* eslint-disable import/no-internal-modules */
import { z } from "zod";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { StateType, initialState, stateValueSchema } from "./state";

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

              return persistSchema.parse(JSON.parse(value));
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
      },
    ),
  ),
);

export const store = useStore;
