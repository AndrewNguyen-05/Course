import axios from "axios";
const BASE_URL = "http://localhost:8080/api/v1/admin/teachers";
const API_BASE_URL = "http://localhost:8080/api/v1/admin"; // Cơ sở URL API

export const getAllTeachers = async (page, size, sort) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/admin/teachers`,
      {
        params: { page, size, sort },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm token nếu cần
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const searchTeachers = async (page, size, sort, keywords) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/admin/teachers/search`,
      {
        params: { page, size, sort, keywords },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm token nếu cần
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching teachers:", error);
    throw error;
  }
};

export const removeTeacherRole = async (teacherId) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/v1/admin/teachers/${teacherId}/remove-role`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm token nếu cần thiết
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing teacher role:", error);
    throw error;
  }
};

export const getTeacherApplications = async (page, size) => {
  try {
    const response = await axios.get(`${BASE_URL}/applications`, {
      params: {
        page,
        size,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is included if needed
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher applications:", error);
    throw error;
  }
};

export const approveTeacher = async (id) => {
  try {
    await axios.post(`${BASE_URL}/${id}/approve`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error(`Error approving teacher with ID ${id}:`, error);
    throw error;
  }
};

export const rejectTeacher = async (id) => {
  try {
    await axios.post(`${BASE_URL}/${id}/reject`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error(`Error rejecting teacher with ID ${id}:`, error);
    throw error;
  }
};

// API để từ chối ứng dụng giáo viên
export const rejectTeacherApplication = async (id) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/v1/admin/teachers/${id}/reject`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error rejecting teacher application with ID ${id}:`, error);
    throw error;
  }
};

export const getTeacherDetails = async (teacherId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/${teacherId}/details`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    throw error;
  }
};
