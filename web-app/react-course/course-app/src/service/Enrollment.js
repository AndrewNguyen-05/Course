import axios from "../utils/CustomizeAxios";

export const checkPurchase = async (courseId) => {
  const response = await axios.get(`api/v1/check-purchase/${courseId}`);
  return response.data;
};

export const isCourseComplete = async (courseId) => {
  const response = await axios.post(`api/v1/course/is-complete`, {
    courseId: courseId,
  });

  console.log(response.data);

  return response.data;
};
