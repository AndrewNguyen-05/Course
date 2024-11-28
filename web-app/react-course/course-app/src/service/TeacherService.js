import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";

export const approveTeacher = async (teacherId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/save-teacher/${teacherId}`, // Gửi yêu cầu với id
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error approving teacher:", error);
    throw error;
  }
};

export const rejectTeacher = async (teacherId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/reject-teacher/${teacherId}`, // Gửi yêu cầu với id
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting teacher:", error);
    throw error;
  }
};
