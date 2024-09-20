import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaKey, FaUser, FaShieldAlt } from 'react-icons/fa';
import { Navbar } from '../layouts/Navbar';
import { Footer } from '../layouts/Footer';
import { ToastContainer, toast } from 'react-toastify';
import { TopBar } from '../layouts/TopBar';

export const ChangePassword = () => {

  const token = localStorage.getItem('token')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSnipping, setIsSnipping] = useState(false);

  const togglePasswordVisibility = (setter) => {
    setter((prev) => !prev);
  };

  const submitChangePassword = (event) => {
    event.preventDefault();
    setIsSnipping(true);

    setTimeout(() => {
      setIsSnipping(false);
    }, 1000);

    fetch(`http://localhost:8080/api/v1/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    })
      .then(async (response) => {
        if (response.ok) {
          toast.success('Password changed successfully.');
        } else {
          const errorData = await response.json();
          toast.error(errorData.message);
        }
      })
      .catch((error) => {
        toast.error('An error occurred. Please try again.');
      });
  };
  

  return (
    <div>
      <TopBar/>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-gradient text-white text-center rounded-top p-4" style={{ background: 'linear-gradient(135deg, #6e8efb, #a777e3)' }}>
                <h3 className="font-weight-bold">
                  <FaUser className="me-2" /> Change Password
                </h3>
              </div>
              <div className="card-body p-5">
                <form onSubmit={submitChangePassword}>
                  {/* Current Password Field */}
                  <div className="mb-4 position-relative">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0"><FaLock /></span>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="form-control form-control-lg border-start-0 shadow-sm"
                        id="currentPassword"
                        placeholder="Enter your current password"
                         autoComplete="current-password"
                        onChange={(event) => setCurrentPassword(event.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => togglePasswordVisibility(setShowCurrentPassword)}
                      >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* New Password Field */}
                  <div className="mb-4 position-relative">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0"><FaKey /></span>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className="form-control form-control-lg border-start-0 shadow-sm"
                        id="newPassword"
                        placeholder="Enter your new password"
                         autoComplete="new-password"
                        onChange={(event) => setNewPassword(event.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => togglePasswordVisibility(setShowNewPassword)}
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-4 position-relative">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0"><FaKey /></span>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-control form-control-lg border-start-0 shadow-sm"
                        id="confirmPassword"
                         autoComplete="confirm-password"
                        placeholder="Confirm your new password"
                        onChange={(event) => setConfirmPassword(event.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => togglePasswordVisibility(setShowConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid mt-4">
                    <button type="submit"
                    className="btn btn-primary btn-lg rounded-pill shadow">
                      <FaShieldAlt className="me-2" 
                      /> Change Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        className="custom-toast-container"
      />

      <Footer />
    </div>
  );
};
