import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { introspect, login } from "../../../service/AuthenticationService";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { LoginFrom } from "./components/LoginForm";
import { OAuthConfig } from "../../config/OAuthConfig";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import AuthContext from "../../../context/AuthContext";

export const LoginPage = () => {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Login Page";
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    if (token) {
      introspect(token)
        .then((data) => {
          if (data.valid) {
            navigate("/home");
          }
        })
        .catch((error) => {
          console.error("Error introspecting token:", error);
        }).finally(() => setLoading(false));
    }
  }, [navigate]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleGoogleLogin = () => {
    const callbackUrl = OAuthConfig.google.redirectUri;
    const authUrl = OAuthConfig.google.authUri;
    const googleClientId = OAuthConfig.google.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    window.location.href = targetUrl;
  };

  const handleFacebookLogin = () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/facebook";
  };

  const handleLogin = (event) => {
    event.preventDefault();

    login(email, password)
      .then((data) => {
        if (data && data.result && data.result.token) {
          const token = data.result.token;
          localStorage.setItem("token", token);
          authContext.refresh();
          introspect()
            .then((introspectData) => {
              if (introspectData && introspectData.valid) {
                const role = introspectData.scope;

                if (role === "USER") {
                  navigate("/home");
                } else if (role === "ADMIN") {
                  navigate("/admin");
                } else if (role === "TEACHER") {
                  navigate("/manager-courses");
                }
              } else {
                throw new Error("Invalid token.");
              }
            })
            .catch((error) => {
              console.error("Error during introspect:", error);
              setError(error.message);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 4000);
            });
        } else {
          throw new Error("Login failed, please try again.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error.message); // In lỗi ra console
        setError(error.message || "Login failed, please try again.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    <div>{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }} // Hiệu ứng ban đầu: ẩn và dịch trái
      animate={{ opacity: 1, x: 0 }} // Hiệu ứng khi hiển thị: hiện và dịch về vị trí gốc
      exit={{ opacity: 0, x: 100 }} // Hiệu ứng khi thoát: ẩn và dịch phải
      transition={{ duration: 0.5 }} // Thời gian chuyển động
      className="content-page"
    >
      <section className="py-3 py-md-5 py-xl-8">
        <LoginFrom
          email={email}
          setEmail={setEmail}
          password={password}
          handleLogin={handleLogin}
          setPassword={setPassword}
          handleGoogleLogin={handleGoogleLogin}
          handleFacebookLogin={handleFacebookLogin}
        />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          className="custom-toast-container"
        />
      </section>
    </motion.div>
  );
};
