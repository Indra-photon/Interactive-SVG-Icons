"use client";

import { createContext, useContext } from "react";

export const UIPropsContext = createContext<Record<string, any>>({});

export function useUIProps() {
  return useContext(UIPropsContext);
}
