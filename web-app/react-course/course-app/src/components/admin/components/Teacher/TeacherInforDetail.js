import React, { useEffect, useState } from "react";
import "../../css/TeacherInforDetail.css";
import { CIcon } from "@coreui/icons-react";
import {
  cilEnvelopeClosed,
  cilUser,
  cilPhone,
  cilDescription,
  cilFile,
  cilStar,
  cilCalendar,
} from "@coreui/icons";
import { Button } from "react-bootstrap";
import { FiFileText, FiAward } from "react-icons/fi";
import { FaFacebook } from "react-icons/fa";
import {
  getTeacherDetails,
  approveTeacher,
  rejectTeacher,
} from "../../service/Admin_TeacherService";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherInforDetail = () => {
  const [teacherDetails, setTeacherDetails] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getTeacherDetails(id);
        setTeacherDetails(data);
      } catch (error) {}
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

  const handleApprove = async () => {
    try {
      await approveTeacher(id);
      toast.success("Teacher approved successfully.");
      setTimeout(() => navigate("/admin/teachers/censor"), 3000);
    } catch (error) {
      console.error("Error approving teacher:", error);
      toast.error("Failed to approve teacher.");
    }
  };

  const handleReject = async () => {
    try {
      await rejectTeacher(id);
      toast.warn("Teacher rejected successfully.");
      setTimeout(() => navigate("/admin/teachers/censor"), 3000);
    } catch (error) {
      console.error("Error rejecting teacher:", error);
      toast.error("Failed to reject teacher.");
    }
  };

  if (!teacherDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="teacher-info-detail">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="header-section">
        <img
          src={teacherDetails.avatar || "default-avatar.png"}
          alt="Avatar"
          className="teacher-avatar"
        />
        <div className="teacher-basic-info">
          <div className="name-and-points">
            <h2 className="teacher-name">{teacherDetails.name}</h2>
            <p className="teacher-points">
              <CIcon icon={cilStar} /> {teacherDetails.points || "0"} points
            </p>
          </div>
          <p className="teacher-email">
            <CIcon icon={cilEnvelopeClosed} /> {teacherDetails.email}
          </p>
          <p className="teacher-phone">
            <CIcon icon={cilPhone} /> {teacherDetails.phone || "N/A"}
          </p>
        </div>
      </div>

      <div className="detail-section">
        <div className="info-card">
          <h3>CV</h3>
          <Button
            variant="outline-primary"
            onClick={() => handleOpenInNewTab(teacherDetails.cvUrl)}
          >
            <FiFileText /> View CV
          </Button>
        </div>
        <div className="info-card">
          <h3>Certificate</h3>
          <Button
            variant="outline-secondary"
            onClick={() => handleOpenInNewTab(teacherDetails.certificate)}
          >
            <FiAward /> View Certificate
          </Button>
        </div>
        <div className="info-card">
          <h3>Facebook</h3>
          <p>
            <a
              href={teacherDetails.facebookLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook style={{ color: "#3b5998" }} /> View Facebook Profile
            </a>
          </p>
        </div>
        <div className="info-card">
          <h3>Description</h3>
          <p>
            <CIcon icon={cilDescription} />{" "}
            {teacherDetails.description || "N/A"}
          </p>
        </div>
        <div className="info-card">
          <h3>Gender</h3>
          <p>
            <CIcon icon={cilUser} /> {teacherDetails.gender || "N/A"}
          </p>
        </div>
        <div className="info-card">
          <h3>Years of Experience</h3>
          <p>
            <CIcon icon={cilCalendar} />{" "}
            {teacherDetails.yearsOfExperience || "N/A"} years
          </p>
        </div>
      </div>

      <div className="action-section">
        <button className="approve-button" onClick={handleApprove}>
          Phê Duyệt
        </button>
        <button className="reject-button" onClick={handleReject}>
          Từ Chối
        </button>
      </div>
    </div>
  );
};

export default TeacherInforDetail;
