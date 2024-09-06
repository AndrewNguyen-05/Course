import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toast, ToastContainer } from 'react-bootstrap';
import { Footer } from '../layouts/Footer';
import { Navbar } from '../layouts/Navbar';

export const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    const OAuthConfig = {
      clientId: '1063674841920-mtlapuiv2d8gc3rgf6b4oi4vlaa31pah.apps.googleusercontent.com',
      redirectUri: 'http://localhost:3000/authenticate',
      authUri: 'https://accounts.google.com/o/oauth2/auth',
    };

    const targetUrl = `${OAuthConfig.authUri}?redirect_uri=${encodeURIComponent(OAuthConfig.redirectUri)}&response_type=code&client_id=${OAuthConfig.clientId}&scope=openid%20email%20profile`;
    window.location.href = targetUrl;

  };

  const handleLogin = (event) => {
    event.preventDefault();
  
    fetch('http://localhost:8080/api/v1/auth/token', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.message || 'An error occurred.');
          });
        }
        return response.json();
      })
      .then(data => {
        const expiryTime = new Date().getTime() + 86400 * 1000;  // Token có thời hạn 1 ngày
        const token = data.result.token; 
        console.log(token); 
  
        localStorage.setItem('token', token);
        localStorage.setItem('expiryTime', expiryTime);
  
        // Gọi API introspect để kiểm tra token, phân quyền
        fetch(`http://localhost:8080/api/v1/auth/introspect`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ token })
        })
          .then(response => {
            if (!response.ok) {
              return response.json().then(errorData => {
                throw new Error(errorData.message);
              });
            }
            return response.json();
          })
          .then(introspectData => {
            if (introspectData.result && introspectData.result.valid) { 
              const role = introspectData.result.scope;  // Lấy role từ token
              localStorage.setItem('role', role);
  
              if (role === 'USER') {
                navigate('/home');
              } else if (role === 'ADMIN') {
                navigate('/admin');
              } else if (role === 'TEACHER') {
                navigate('/manager-courses');
              }

            } else {
              throw new Error('Invalid token.');
            }
          })
          .catch(error => {
            console.error('Error during introspect:', error); 
            setError(error.message);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
          });
      })
      .catch(error => {
        console.error('Login error:', error);  // In lỗi ra console để kiểm tra
        setError(error.message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      });
  };
  
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div>
      <Navbar />
      <section className="py-3 py-md-5 py-xl-8">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="mb-5">
                <h2 className="display-5 fw-bold text-center">Sign in</h2>
                <p className="text-center m-0">Don't have an account? <Link to="/register">Sign up</Link></p>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8">
              <div className="row gy-5 justify-content-center">
                <div className="col-12 col-lg-5">
                  <form id="login-form" onSubmit={handleLogin}>
                    <div className="row gy-3 overflow-hidden">
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="name@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <label htmlFor="email" className="form-label">Email</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <label htmlFor="password" className="form-label">Password</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="row justify-content-between">
                          <div className="col-6">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" id="remember_me" />
                              <label className="form-check-label text-secondary" htmlFor="remember_me">
                                Remember me
                              </label>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-end">
                              <Link to="/forgot-password" className="link-secondary text-decoration-none">Forgot password?</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-grid">
                          <button className="btn btn-lg btn-dark rounded-0 fs-6" type="submit">Log in</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-12 col-lg-2 d-flex align-items-center justify-content-center gap-3 flex-lg-column">
                  <div className="bg-dark h-100 d-none d-lg-block" style={{ width: '1px', opacity: 0.1 }}></div>
                  <div className="bg-dark w-100 d-lg-none" style={{ height: '1px', opacity: 0.1 }}></div>
                  <div>or</div>
                  <div className="bg-dark h-100 d-none d-lg-block" style={{ width: '1px', opacity: 0.1 }}></div>
                  <div className="bg-dark w-100 d-lg-none" style={{ height: '1px', opacity: 0.1 }}></div>
                </div>
                <div className="col-12 col-lg-5 d-flex align-items-center">
                  <div className="d-flex gap-3 flex-column w-100">

                    <button className="btn bsb-btn-2xl btn-outline-dark rounded-0 d-flex align-items-center" id="google-login" onClick={handleGoogleLogin}>
                      <i className="bi bi-google text-danger"></i>
                      <span className="ms-2 fs-6 flex-grow-1">Continue with Google</span>
                    </button>

                    <button className="btn bsb-btn-2xl btn-outline-dark rounded-0 d-flex align-items-center">
                      <i className="bi bi-facebook text-primary"></i>
                      <span className="ms-2 fs-6 flex-grow-1">Continue with Facebook</span>
                    </button>

                    <button className="btn bsb-btn-2xl btn-outline-dark rounded-0 d-flex align-items-center">
                      <i className="bi bi-apple text-dark"></i>
                      <span className="ms-2 fs-6 flex-grow-1">Continue with Apple</span>
                    </button>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer position="bottom-start" className="p-3">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            className="toast-custom"
            style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              position: 'absolute',
              bottom: '790px',
              left: '1430px',
              zIndex: 9999
            }}
          >
            <Toast.Body>{error}</Toast.Body>
          </Toast>
        </ToastContainer>
      </section>
      <Footer />
    </div>
  );
};
