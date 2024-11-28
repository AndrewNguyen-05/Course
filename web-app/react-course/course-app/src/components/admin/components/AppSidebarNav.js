import "../css/AdminSidebarNav.css"; // CSS tùy chỉnh cho sidebar
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { CSidebarNav, CNavItem, CNavGroup, CNavTitle } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilUser,
  cilPeople,
  cilLibrary,
  cilBullhorn,
  cilChartLine,
} from "@coreui/icons";
import "simplebar-react/dist/simplebar.min.css";

const AppSidebarNav = () => {
  const [openItems, setOpenItems] = useState({
    user: false,
    teacher: false,
    course: false,
    advertisement: false,
    statistical: false,
  });

  const toggleItem = (name) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [name]: !prevOpenItems[name],
    }));
  };

  const renderNavItem = (text, link) => (
    <CNavItem>
      <NavLink to={link} className="nav-link-custom">
        <span className="nav-bullet">•</span> {text}
      </NavLink>
    </CNavItem>
  );

  return (
    <CSidebarNav>
      {/* MANAGEMENT Group */}
      <CNavTitle>MANAGEMENT</CNavTitle>
      <CNavGroup
        toggler={
          <>
            <CIcon icon={cilUser} className="me-2" />
            User
          </>
        }
        onClick={() => toggleItem("user")}
        visible={openItems["user"]}
      >
        {renderNavItem("Manage", "/admin/users")}
        {renderNavItem("Decentralization", "/admin/users/decentralization")}
      </CNavGroup>
      <CNavGroup
        toggler={
          <>
            <CIcon icon={cilPeople} className="me-2" />
            Teacher
          </>
        }
        onClick={() => toggleItem("teacher")}
        visible={openItems["teacher"]}
      >
        {renderNavItem("Manage", "/admin/teachers")}
        {renderNavItem("Censor", "/admin/teachers/censor")}
      </CNavGroup>
      <CNavGroup
        toggler={
          <>
            <CIcon icon={cilLibrary} className="me-2" />
            Course
          </>
        }
        onClick={() => toggleItem("course")}
        visible={openItems["course"]}
      >
        {renderNavItem("Manage", "/admin/course/manage")}
        {renderNavItem("Promotion", "/admin/course/promotion")}
      </CNavGroup>
      <CNavGroup
        toggler={
          <>
            <CIcon icon={cilBullhorn} className="me-2" />
            Advertisement
          </>
        }
        onClick={() => toggleItem("advertisement")}
        visible={openItems["advertisement"]}
      >
        {renderNavItem("Censor", "/admin/advertisement/censor")}
      </CNavGroup>

      {/* ANALYSIS Group */}
      <CNavTitle>ANALYSIS</CNavTitle>
      <CNavGroup
        toggler={
          <>
            <CIcon icon={cilChartLine} className="me-2" />
            Statistical
          </>
        }
        onClick={() => toggleItem("statistical")}
        visible={openItems["statistical"]}
      >
        {renderNavItem("General", "/admin/statistical/general")}
        {renderNavItem("Course", "/admin/statistical/course")}
        {renderNavItem("Teacher", "/admin/statistical/teacher")}
        {renderNavItem("User", "/admin/statistical/user")}
      </CNavGroup>
    </CSidebarNav>
  );
};

export default AppSidebarNav;
