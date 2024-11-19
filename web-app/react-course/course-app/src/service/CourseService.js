import axios from "../utils/CustomizeAxios";

export const getAllCourses = async (currentPage, pageSize) => {
  try {
    const response = await axios.get(`api/v1/courses`, {
      params: {
        page: currentPage,
        size: pageSize,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const SearchService = async (currentPage, pageSize, filterQuery) => {
  try {
    const apiUrl = `api/v1/courses`;

    const response = await axios.get(apiUrl, {
      params: {
        page: currentPage,
        size: pageSize,
        filter: filterQuery || "",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const getCourseById = async (id) => {
  try {
    const response = await axios.get(`api/v1/course/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getChapterById = async (id) => {
  try {
    const response = await axios.get(`api/v1/info-course/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chapter by id:", error);
    throw error;
  }
};

export const getCommentByCourseId = async (id) => {
  try {
    const response = await axios.get(`api/v1/courses-review/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comment by courseId:", error);
    throw error;
  }
};

export const buyCourse = async (id) => {
  try {
    const response = await axios.post(`api/v1/buy-course`, { courseId: id });
    return response;
  } catch (error) {
    console.error("Error By Course:", error);
    throw error;
  }
};

export const getInfoCourse = async (id) => {
  try {
    const response = await axios.get(`/api/v1/info-course/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error By Course:", error);
    throw error;
  }
};

export const getCoursesByTeacher = async () => {
  const response = await axios.get("api/v1/manager-courses");
  return response.data;
};

export const deleteCourse = async (courseId) => {
  const response = await axios.delete(`api/v1/delete-courses/${courseId}`);
  return response.data;
};

export const myCourse = async () => {
  const response = await axios.get(`api/v1/users/me/courses`);
  return response.data;
};
