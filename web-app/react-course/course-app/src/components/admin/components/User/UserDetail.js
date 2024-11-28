import React, { useEffect, useState } from "react";
import "../../css/UserDetail.css"; // Đảm bảo bạn có file CSS cho giao diện người dùng
import { CIcon } from "@coreui/icons-react";
import {
  cilEnvelopeClosed,
  cilUser,
  cilPhone,
  cilDescription,
  cilFile,
  cilStar,
  cilCalendar,
  cilShieldAlt,
} from "@coreui/icons";
import { cibFacebook } from "@coreui/icons";
import { Button } from "react-bootstrap";
import { FiFileText, FiAward } from "react-icons/fi";
import { getUserDetails } from "../../service/Admin_UserService";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDetail = () => {
  const [userDetails, setUserDetails] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getUserDetails(id);
        setUserDetails(data);
      } catch (error) {
        toast.error("Failed to fetch user details.");
      }
    };

    fetchDetails();
  }, [id]);

  const handleOpenInNewTab = (url) => {
    if (url) {
      const fullUrl = `http://localhost:8080${url}`;
      window.open(fullUrl, "_blank", "noopener,noreferrer");
    } else {
      toast.error("File not found.");
    }
  };

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-detail">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="header-section">
        <img
          src={userDetails.avatar || "default-avatar.png"}
          alt="Avatar"
          className="user-avatar"
        />
        <div className="user-basic-info">
          <div className="name-and-points">
            <h2 className="user-name">{userDetails.name}</h2>
            <p className="user-points">
              <CIcon icon={cilStar} /> {userDetails.points || "0"} points
            </p>
          </div>

          <p className="user-email">
            <CIcon icon={cilEnvelopeClosed} /> {userDetails.email}
          </p>
          <p className="user-phone">
            <CIcon icon={cilPhone} /> {userDetails.phone || "N/A"}
          </p>
        </div>
      </div>

      <div className="detail-section">
        <div className="info-card">
          <h3>CV</h3>
          <Button
            variant="outline-primary"
            onClick={() => handleOpenInNewTab(userDetails.cvUrl)}
          >
            <FiFileText /> View CV
          </Button>
        </div>
        <div className="info-card">
          <h3>Certificate</h3>
          <Button
            variant="outline-secondary"
            onClick={() => handleOpenInNewTab(userDetails.certificate)}
          >
            <FiAward /> View Certificate
          </Button>
        </div>
        <div className="info-card">
          <h3>Facebook</h3>
          <p>
            <a
              href={userDetails.facebookLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CIcon icon={cibFacebook} /> Facebook
            </a>
          </p>
        </div>
        <div className="info-card">
          <h3>Description</h3>
          <p>
            <CIcon icon={cilDescription} /> {userDetails.description || "N/A"}
          </p>
        </div>
        <div className="info-card">
          <h3>Date of Birth</h3>
          <p>
            <CIcon icon={cilCalendar} />{" "}
            {userDetails.dob
              ? new Date(userDetails.dob).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <div className="info-card">
          <h3>Role</h3>
          <p>
            <CIcon icon={cilShieldAlt} /> {userDetails.role || "N/A"}
          </p>
        </div>
        <div className="info-card">
          <h3>Created At</h3>
          <p>
            <CIcon icon={cilCalendar} />{" "}
            {userDetails.createAt
              ? new Date(userDetails.createAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
