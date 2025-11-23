import { create } from "zustand";

type ParamLevel = "section" | "pointer" | "mainView" | "view" | "filter";

export const useParamStore = create(() => ({}));

const PARAMS_TO_CLEAR = {
  section: [
    "pointer",
    "mainView",
    "view",
    "chartType",
    "year",
    "region",
    "govs",
    "subIndicators",
  ],
  pointer: [
    "mainView",
    "view",
    "chartType",
    "year",
    "region",
    "govs",
    "subIndicators",
  ],
  mainView: [
    "view",
    "chartType",
    "year",
    "region",
    "govs",
    "subIndicators",
  ],
  view: [
    "chartType",
    "year",
    "region",
    "govs",
    "subIndicators",
  ],
  filter: [] as string[], 
};

export function updateSearchParams(
  setSearchParams: (
    params: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)
  ) => void,
  changes: Record<string, string | null | string[]>,
  level: ParamLevel = "filter"
) {
  setSearchParams((prev) => {
    const newParams = new URLSearchParams(prev);

    const keysToDelete = PARAMS_TO_CLEAR[level];
    keysToDelete.forEach((key) => newParams.delete(key));

    Object.entries(changes).forEach(([key, value]) => {
      if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.set(key, value.join("-"));
      } else {
        newParams.set(key, value);
      }
    });

    return newParams;
  });
}