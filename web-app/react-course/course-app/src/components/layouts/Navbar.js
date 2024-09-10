import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UseAuth } from '../authentication/UseAuth';
import { HandleLogout } from '../authentication/HandleLogout';
import { useEffect } from 'react';
import { ProfileDropdown } from '../common/ProfileDropdown';
import { TopBar } from '../common/TopBar';

export const Navbar = () => {
  
  const [loggedOut, setLoggedOut] = useState(false);
  const { isTokenValid } = UseAuth({ loggedOut });
  const { handleLogout } = HandleLogout({ setLoggedOut });

  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || !isTokenValid) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/v1/get-avatar`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch avatar');
        return response.json();
      })
      .then(data => {
        const urlAvatar = data.result;
        setAvatar(urlAvatar);
        setLoading(false);
      })
      .catch(error => {
        console.log('Error fetching avatar:', error);
        setLoading(false);
      });
  }, [token, isTokenValid]);

  return (
    <div>
      <TopBar />
      <div className="container-fluid p-0">
        <nav className="navbar navbar-expand-lg bg-white navbar-light py-3 py-lg-0 px-lg-5">
          <Link to="/" className="navbar-brand ml-lg-3">
            <h1 className="m-0 text-uppercase text-primary rounded">
              <i className="fa fa-book-reader mr-3"></i>D-LEARNING
            </h1>
          </Link>
          <button type="button" className="navbar-toggler rounded" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-between px-lg-3" id="navbarCollapse">
            <div className="navbar-nav mx-auto py-0">
              <Link to="/" className="nav-item nav-link active rounded">Home</Link>
              <Link to="/about" className="nav-item nav-link rounded">About</Link>
              <Link to="/courses" className="nav-item nav-link rounded">Courses</Link>
              <div className="nav-item dropdown rounded">
                <Link to="#" className="nav-link dropdown-toggle rounded" data-bs-toggle="dropdown">Pages</Link>
                <div className="dropdown-menu m-0 rounded">
                  <Link to="/course-detail" className="dropdown-item rounded">Course Detail</Link>
                  <Link to="/our-feature" className="dropdown-item rounded">Our Features</Link>
                  <Link to="/instructor" className="dropdown-item rounded">Instructors</Link>
                  <Link to="/testimonial" className="dropdown-item rounded">Testimonial</Link>
                </div>
              </div>
              <Link to="/contact" className="nav-item nav-link rounded">Contact</Link>
            </div>

            <ProfileDropdown
              avatar={avatar}
              isTokenValid={isTokenValid}
              role={role}
              handleLogout={handleLogout}
            />
          </div>
        </nav>
      </div>
    </div>
  );
};


