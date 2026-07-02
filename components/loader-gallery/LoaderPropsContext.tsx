"use client";

import { createContext, useContext } from "react";

export const LoaderPropsContext = createContext<Record<string, any>>({});

export function useLoaderProps() {
  return useContext(LoaderPropsContext);
}
