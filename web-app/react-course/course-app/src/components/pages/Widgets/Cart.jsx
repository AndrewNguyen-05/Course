import React from 'react';
import { Link } from 'react-router-dom';

export const Card = () => {
    return (
        <div className="nav-item dropdown mx-2">
        <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} data-bs-toggle="dropdown">
            <i className="fa-solid fa-shopping-cart"></i>
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
            <li className="dropdown-item">Item 1 in Cart</li>
            <li className="dropdown-item">Item 2 in Cart</li>
            <li className="dropdown-item text-center">
                <Link to="/cart" className="text-primary">Go to Cart</Link>
            </li>
        </ul>
    </div>
    );
}