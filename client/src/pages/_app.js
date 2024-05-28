// client/src/pages/_app.js

import { ThemeProvider } from "@mui/material/styles";
import  CssBaseline  from "@mui/material/CssBaseline";
import theme from "@/styles/theme"; // doubt about @ as alias.
import { AuthProvider } from "../../context/AuthContext";
import '../styles/global.css'; 

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;