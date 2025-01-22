"use client";

import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
} from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
//import { Analytics } from "@vercel/analytics/react";
import useLocalStorage from "@/hooks/use-local-storage";
  import { createTheme, MantineProvider } from "@mantine/core";

export const AppContext = createContext<{
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
}>({
  font: "Default",
  setFont: () => {},
});

const theme = createTheme({
  fontFamily: "Poppins, sans-serif",
});

const ToasterProvider = () => {
  const { theme } = useTheme() as {
    theme: "light" | "dark" | "system";
  };
  return <Toaster theme={theme} />;
};

export default function Providers({ children }: { children: ReactNode }) {
  const [font, setFont] = useLocalStorage<string>("novel__font", "Default");

  return (
    <ThemeProvider
      attribute="class"
      enableSystem
      disableTransitionOnChange
      defaultTheme="system"
    >
      <AppContext.Provider
        value={{
          font,
          setFont,
        }}
      >
        <ToasterProvider />
        <MantineProvider theme={theme}>
          {children}
        </MantineProvider>
        {/*<Analytics />*/}
      </AppContext.Provider>
    </ThemeProvider>
  );
}
