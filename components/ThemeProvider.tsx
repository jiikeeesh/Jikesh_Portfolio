"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // When theme = "light", add class "light" so :root:not(.light) stops
      // the media-query dark variables from activating on light-forced pages.
      value={{ light: "light", dark: "dark" }}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
