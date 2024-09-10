import React from 'react';
import { Link } from 'react-router-dom';

export const NavigationMenu = ({ isActive, underlineRef }) => {
    return (
        <div className="navbar-nav mx-auto py-0 position-relative">
            <Link to="/home" className={`nav-item nav-link rounded ${isActive('/home') ? 'active' : ''}`}>Home</Link>
            <Link to="/about" className={`nav-item nav-link rounded ${isActive('/about') ? 'active' : ''}`}>About</Link>
            <Link to="/courses" className={`nav-item nav-link rounded ${isActive('/courses') ? 'active' : ''}`}>Courses</Link>
            <div className="nav-item dropdown rounded">
                <a href="#" className="nav-link dropdown-toggle rounded" data-bs-toggle="dropdown">Pages</a>
                <div className="dropdown-menu m-0 rounded">
                    <Link to="/course-detail" className={`dropdown-item rounded ${isActive('/course-detail') ? 'active' : ''}`}>Course Detail</Link>
                    <Link to="/our-feature" className={`dropdown-item rounded ${isActive('/our-feature') ? 'active' : ''}`}>Our Features</Link>
                    <Link to="/instructor" className={`dropdown-item rounded ${isActive('/instructor') ? 'active' : ''}`}>Instructors</Link>
                    <Link to="/testimonial" className={`dropdown-item rounded ${isActive('/testimonial') ? 'active' : ''}`}>Testimonial</Link>
                </div>
            </div>
            <Link to="/contact" className={`nav-item nav-link rounded ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
            <div className="underline" ref={underlineRef}></div>
        </div>
    );
};
