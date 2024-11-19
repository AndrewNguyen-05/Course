import axios from "../utils/CustomizeAxios";

export const getRelatedCourses = async (title) => {
  const response = await axios.get(`api/v1/search-title`, {
    params: {
      title: title,
    },
  });

  console.log(response.data);
  return response.data;
};
