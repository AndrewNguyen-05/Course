import axios from "../utils/CustomizeAxios";

export const getCompletionPercentage = async (courseId) => {
  const response = await axios.get(`api/v1/calculate-completion/${courseId}`);
  console.log(response.data);
  return response.data;
};
