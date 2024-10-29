import React from "react";
import { TopBar } from "../layouts/TopBar";
import { Header } from "../layouts/Header";
import { Banner } from "../layouts/Banner";
import { Outlet } from "react-router-dom";
import { Footer } from "../layouts/Footer";

export const MainLayout = () => {
  return (
    <div>
      <TopBar />
      <Header />
      <Banner />

      <Outlet />

      <Footer />
    </div>
  );
};
