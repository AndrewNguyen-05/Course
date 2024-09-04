import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ProcessLoginOAuth2 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    function handleAuthentication() {
      const authCodeRegex = /code=([^&]+)/;
      const isMatch = window.location.href.match(authCodeRegex);

      if (isMatch) {
        const authCode = isMatch[1];

        fetch(`http://localhost:8080/api/v1/auth/outbound/authentication?code=${authCode}`, {
          method: 'POST',
        })
          .then(response => response.json())
          .then(data => {
            if (data.result && data.result.token) {
              localStorage.setItem('token', data.result.token);

              let token = localStorage.getItem('token');
              const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              };

              fetch(`http://localhost:8080/api/v1/my-info`, { headers: headers })
                .then(response => response.json())
                .then(userData => {
                  if (userData.result && userData.result.noPassword) {
                    navigate('/create-password');
                  } else {
                    navigate('/home');
                  }
                });
            } else {
              console.error('Authentication failed');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    }

    handleAuthentication();
  }, [navigate]);

  return (
    <div className="container text-center">
      <div className="d-flex justify-content-center align-items-center flex-column">
        <div className="spinner-border spinner-border-custom text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h2 className="mt-3">Processing...</h2>
        <p className="text-muted">Please wait while we authenticate your account.</p>
      </div>
      <style>
        {`
          body {
            background-color: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .spinner-border-custom {
            width: 4rem;
            height: 4rem;
            border-width: 0.4em;
          }
        `}
      </style>
    </div>
  );
};
