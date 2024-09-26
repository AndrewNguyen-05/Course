import React from 'react';
import { NavLink } from 'react-router-dom';

export const NavigationMenu = ({ isActive, underlineRef }) => {
    return (
        <div className="navbar-nav mx-auto py-0 position-relative">
            <NavLink to="/home" className={`nav-item nav-link rounded ${isActive('/home') ? 'active' : ''}`}>Home</NavLink>
            <NavLink to="/about" className={`nav-item nav-link rounded ${isActive('/about') ? 'active' : ''}`}>About</NavLink>
            <NavLink to="/courses" className={`nav-item nav-link rounded ${isActive('/courses') ? 'active' : ''}`}>Courses</NavLink>
            <div className="nav-item dropdown rounded">
                <a href="#" className="nav-link dropdown-toggle rounded" data-bs-toggle="dropdown">Pages</a>
                <div className="dropdown-menu m-0 rounded">
                    <NavLink to="/course-detail" className={`dropdown-item rounded ${isActive('/course-detail') ? 'active' : ''}`}>Course Detail</NavLink>
                    <NavLink to="/our-feature" className={`dropdown-item rounded ${isActive('/our-feature') ? 'active' : ''}`}>Our Features</NavLink>
                    <NavLink to="/instructor" className={`dropdown-item rounded ${isActive('/instructor') ? 'active' : ''}`}>Instructors</NavLink>
                    <NavLink to="/testimonial" className={`dropdown-item rounded ${isActive('/testimonial') ? 'active' : ''}`}>Testimonial</NavLink>
                </div>
            </div>
            <NavLink to="/contact" className={`nav-item nav-link rounded ${isActive('/contact') ? 'active' : ''}`}>Contact</NavLink>
            <div className="underline" ref={underlineRef}></div>
        </div>
    );
};
