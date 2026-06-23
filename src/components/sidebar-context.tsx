"use client";
import { createContext, useContext } from "react";

type SidebarCtx = { open: boolean; setOpen: (v: boolean) => void };

export const SidebarContext = createContext<SidebarCtx>({
  open: false,
  setOpen: () => {},
});

export const useSidebar = () => useContext(SidebarContext);
