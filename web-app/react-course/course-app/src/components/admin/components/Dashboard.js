import React from "react";
import { SidebarAdmim } from "../layouts/SidebarAdmin";
import { AdminHeader } from "../layouts/HeaderAdmin";
import { Footer } from "../../layouts/Footer";

export const Dashboard = () => {
    return (
       <div>
         <div className="d-flex">
            <SidebarAdmim />

            <div className="content-wrapper w-100">
                <AdminHeader />
            </div>
        
        </div>
        <Footer/>
       </div>
    );
}