// src/pages/_app.js

import React from "react";
import Layout from "../app/layout";
import "../styles/global.css";
import { useRouter } from "next/router"; // Ensure router is imported
import { useEffect } from "react"; // Ensure useEffect is imported

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Ensure router is loaded
    if (!router.isReady) return;
  }, [router.isReady]);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
