import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Box, ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState<boolean>(prefersDarkMode);

  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          success: {
            main: "#8cca7a",
          },
          warning: {
            main: "#f9c389",
          },
          error: {
            main: "#f3968f",
          },
        },
        typography: {
          h4: {
            fontSize: 24,
            fontWeight: "bold",
          },
          h5: {
            fontSize: 18,
            fontWeight: "bold",
          },
          h6: {
            fontSize: 16,
            fontWeight: "bold",
          },
        },
      }),
    [darkMode]
  );
  return (
    <ThemeProvider theme={theme}>
      <Box m={2}>
        <Component {...pageProps} />
      </Box>
    </ThemeProvider>
  );
}
export default MyApp;
