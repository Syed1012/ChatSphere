// src/app/layout.js

"use client";

import React from "react";
import Navbar from "../components/Navbar";
import "../styles/global.css";

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        {/* Add your head elements here */}
        <title>ChatSphere</title>
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;
