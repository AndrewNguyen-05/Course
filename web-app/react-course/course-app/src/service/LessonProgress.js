import axios from "../utils/CustomizeAxios";

export const getCompletionPercentage = async (courseId) => {
  const response = await axios.get(`api/v1/calculate-completion/${courseId}`);
  return response.data;
};

export const markLessonAsCompleted = async (lessonId) => {
  const response = await axios.post(`api/v1/update-lesson-progress`, {
    lessonId: lessonId,
  });
  console.log(response.data);
  return response.data;
};
