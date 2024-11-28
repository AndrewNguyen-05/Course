import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/admin/courses";

// Lấy danh sách tất cả các khóa học
export const getAllCourses = async (page, size, sort) => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: { page, size, sort },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all courses:", error);
    throw error;
  }
};

// Lấy danh sách các khóa học đang hoạt động
export const getActiveCourses = async (page, size, sort) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/active`, {
      params: { page, size, sort },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching active courses:", error);
    throw error;
  }
};

// Lấy danh sách các khóa học bị cấm
export const getBannedCourses = async (page, size, sort) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/banned`, {
      params: { page, size, sort },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching banned courses:", error);
    throw error;
  }
};

// Tìm kiếm các khóa học
export const searchCourses = async (page, size, sort, enabled, keywords) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { page, size, sort, enabled, keywords },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching courses:", error);
    throw error;
  }
};

// Lấy chi tiết một khóa học theo ID
export const getCourseDetails = async (courseId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${courseId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw error;
  }
};

// Ban một khóa học
export const banCourse = async (courseId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${courseId}/ban`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error banning course with ID ${courseId}:`, error);
    throw error;
  }
};

// Unban một khóa học
export const unbanCourse = async (courseId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${courseId}/unban`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error unbanning course with ID ${courseId}:`, error);
    throw error;
  }
};
