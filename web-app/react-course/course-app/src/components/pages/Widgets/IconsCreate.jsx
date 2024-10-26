import React from 'react';
import { Link } from 'react-router-dom';
import { GiOpenBook } from "react-icons/gi";

export const CreateCourse = () => {
    return (
        <div className="nav-item mx-2">
            <Link to="/create-course" className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <GiOpenBook  />
            </Link>
        </div>
    );
}
