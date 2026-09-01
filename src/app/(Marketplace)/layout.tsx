"use client";

import React from "react";
import Header from "./Acomponents/header";


import Footer from "@/components/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  
  return (
    <div className="">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
