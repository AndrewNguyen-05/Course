import React from 'react';
import { NavLink } from 'react-router-dom';

export const NavigationMenu = ({ isActive, underlineRef }) => {
    return (
        <div className="navbar-nav mx-auto py-0 position-relative">
            <NavLink to="/home" className={`nav-item nav-link rounded ${isActive('/home') ? 'active' : ''}`}>Home</NavLink>
            <NavLink to="/about" className={`nav-item nav-link rounded ${isActive('/about') ? 'active' : ''}`}>About</NavLink>
            <NavLink to="/courses" className={`nav-item nav-link rounded ${isActive('/courses') ? 'active' : ''}`}>Courses</NavLink>
            <NavLink to="/comunity" className={`nav-item nav-link rounded ${isActive('/comunity') ? 'active' : ''}`}>Community</NavLink>
            <NavLink to="/contact" className={`nav-item nav-link rounded ${isActive('/contact') ? 'active' : ''}`}>Contact</NavLink>
            <div className="underline" ref={underlineRef}></div>
        </div>
    );
};
