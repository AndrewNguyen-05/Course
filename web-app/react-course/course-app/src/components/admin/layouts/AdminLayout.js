import React from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import AdminFooter from "../components/AdminFooter";
import { Outlet } from "react-router-dom"; // Đảm bảo rằng bạn đã import Outlet từ react-router-dom
import "../css/AdminLayout.css";
const AdminLayout = () => {
  return (
    <div className="admin-app">
      <AdminSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AdminHeader />
        <div className="body flex-grow-1">
          <Outlet /> {/* Đây là nơi các thành phần con sẽ được hiển thị */}
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
