import React from "react";
import Header from "./Header";
import { Container } from "@mui/material";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>{children}</Container>
    </>
  );
};

export default Layout;
