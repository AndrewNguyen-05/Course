import React from 'react';
import { Link } from 'react-router-dom';

export const Favorites = () => {
    return (
        <div className="nav-item dropdown mx-2">
        <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} data-bs-toggle="dropdown">
            <i className="fa-solid fa-heart"></i>
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
            <li className="dropdown-item">Favorited Course 1</li>
            <li className="dropdown-item">Favorited Course 2</li>
        </ul>
    </div>
    );
}