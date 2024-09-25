import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Footer } from '../layouts/Footer';
import { OAuthConfig } from '../config/OAuthConfig';
import { toast, ToastContainer } from 'react-toastify';
import { TopBar } from '../layouts/TopBar';
import { Header } from '../layouts/Header';

export const LoginPage = () => {

  useEffect(() => {
    document.title = 'Login Page'
  })

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();


  const handleGoogleLogin = () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const authUrl = OAuthConfig.authUri;
    const googleClientId = OAuthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    console.log(targetUrl);

    window.location.href = targetUrl;

  };

  const handleFacebookLogin = () => {
    const facebookAppId = OAuthConfig.facebookClientId;
    const redirectUri = OAuthConfig.facebookRedirectUri;
    const authUrl = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email,public_profile`;

    window.location.href = authUrl;
  };


  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/home')
    }
  })

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
          toast.error('Email or Password incorrect');
          return response.json().then(errorData => {
            throw new Error(errorData.message || 'An error occurred.');
          });
        }
        return response.json();
      })
      .then(data => {
        const token = data.result.token;
        localStorage.setItem('token', token);
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
              const role = introspectData.result.scope;

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
      <TopBar />
      <Header />
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
                            autoComplete='password'
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

                    <button className="btn bsb-btn-2xl btn-outline-dark rounded-0 d-flex align-items-center"
                      onClick={handleFacebookLogin}
                    >
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

        <ToastContainer
          position="top-right"
          autoClose={3000}
          className="custom-toast-container"
        />
      </section>
      <Footer />
    </div>
  );
};
