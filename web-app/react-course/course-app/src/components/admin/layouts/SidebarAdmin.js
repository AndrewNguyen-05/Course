import React from "react";
import { FaBuilding, FaChalkboardTeacher, FaRegCalendarAlt, FaUserGraduate, FaUserPlus, FaUsers } from "react-icons/fa";
import { IoSchoolSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

export const SidebarAdmim = () => {
    return (
        <div className="d-flex flex-column bg-light p-4">
            <div className="sidebar-header mb-4">
                <Link to="/" className="d-flex align-items-center">
                    <IoSchoolSharp size={70} className="me-2 text-primary" />
                    <span className="text-primary h4">D-LEARNING</span>
                </Link>
            </div>
            <ul className="nav flex-column">

                <li className="nav-item">
                    <Link to="/events" className="nav-link d-flex align-items-center">
                        <FaRegCalendarAlt className="me-2" /> Events
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to="/professors" className="nav-link d-flex align-items-center">
                        <FaUserGraduate className="me-2" /> Teacher
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to="/students" className="nav-link d-flex align-items-center">
                        <FaUsers className="me-2" /> Students
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to="/admin/list-registes-teacher" className="nav-link d-flex align-items-center">
                        <FaUserPlus className="me-2" /> Register Teacher
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to="/manager-courses" className="nav-link d-flex align-items-center">
                        <FaChalkboardTeacher className="me-2" /> Manager Course
                    </Link>
                </li>
              
                <li className="nav-item">
                    <Link to="/departments" className="nav-link d-flex align-items-center">
                        <FaBuilding className="me-2" /> Departments
                    </Link>
                </li>

            </ul>
            
        </div>
    );
};