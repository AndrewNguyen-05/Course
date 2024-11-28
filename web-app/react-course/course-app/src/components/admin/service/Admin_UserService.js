import axios from "axios";
const API_BASE_URL = "http://localhost:8080/api/v1/admin";
export const getAllUsers = async (page, size, sort) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/admin/users`,
      {
        params: {
          page,
          size,
          sort,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm token nếu cần thiết
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const searchUsers = async (page, size, sort, keywords) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/admin/users/search`,
      {
        params: {
          page,
          size,
          sort,
          keywords,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm token nếu cần thiết
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

// Thay đổi vai trò người dùng
export const changeUserRole = async (userId, roleName) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/v1/admin/users/${userId}/role`,
      null,
      {
        params: { roleName },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm token nếu cần
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi cập nhật vai trò người dùng ${userId} thành ${roleName}:`,
      error
    );
    throw error;
  }
};

// Gọi API ban người dùng
export const banUser = async (userId) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/v1/admin/users/ban/${userId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm token nếu cần thiết
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi ban người dùng ${userId}:`, error);
    throw error;
  }
};

// Gọi API unban người dùng
export const unbanUser = async (userId) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/v1/admin/users/unban/${userId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm token nếu cần thiết
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi unban người dùng ${userId}:`, error);
    throw error;
  }
};

export const getUserDetails = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/${userId}/details`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
