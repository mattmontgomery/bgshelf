import Head from "next/head";
import type { AppProps } from "next/app";
import {
  Box,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  CssBaseline,
} from "@mui/material";
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
          background: {
            paper: darkMode
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(0, 0, 0, 0.04)",
          },
          warning: {
            main: "#f9c389",
          },
          error: {
            main: "#f3968f",
          },
        },
        typography: {
          fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(","),
          h4: {
            fontSize: 24,
            fontWeight: "bold",
            color: "inherit",
          },
          h5: {
            fontSize: 18,
            fontWeight: "bold",
            color: "inherit",
          },
          h6: {
            fontSize: 16,
            fontWeight: "bold",
            color: "inherit",
            textDecoration: "none",
          },
        },
      }),
    [darkMode]
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Head>
          <title>BGSHELF 2021</title>
        </Head>
        <Box m={2}>
          <Component {...pageProps} />
        </Box>
      </CssBaseline>
    </ThemeProvider>
  );
}
export default MyApp;
