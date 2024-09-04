import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaChalkboardTeacher, FaLayerGroup, FaUsers, FaBuilding, FaUserGraduate, FaRegCalendarAlt, FaArchive } from 'react-icons/fa';
import { IoSchoolSharp } from 'react-icons/io5'; // Import biểu tượng mới

const Sidebar = () => {
    return (
        <div className="d-flex flex-column bg-light p-4">
            <div className="sidebar-header mb-4">
                <Link to="/" className="d-flex align-items-center">
                    <IoSchoolSharp size={30} className="me-2 text-primary" /> {/* Thay thế bằng biểu tượng mới */}
                    <span className="text-primary h4">KIAALAP</span>
                </Link>
            </div>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to="/education" className="nav-link d-flex align-items-center">
                        <FaBook className="me-2" /> Education
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/events" className="nav-link d-flex align-items-center">
                        <FaRegCalendarAlt className="me-2" /> Events
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/professors" className="nav-link d-flex align-items-center">
                        <FaUserGraduate className="me-2" /> Professors
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/students" className="nav-link d-flex align-items-center">
                        <FaUsers className="me-2" /> Students
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/manager-courses" className="nav-link d-flex align-items-center">
                        <FaChalkboardTeacher className="me-2" /> My Courses
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/teacher-add-courses" className="nav-link d-flex align-items-center">
                        <FaLayerGroup className="me-2" /> Add Course
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/library" className="nav-link d-flex align-items-center">
                        <FaArchive className="me-2" /> Library
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

export default Sidebar;
