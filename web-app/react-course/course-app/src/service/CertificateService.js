import axios from "../utils/CustomizeAxios";

export const fetchCertificateByUserLogin = async () => {
  const response = await axios.get(`api/v1/certificate/current-login`);
  return response.data;
};

export const createCertificate = async (courseId) => {
  const response = await axios.post(`api/v1/certificate/creation`, {
    courseId: courseId,
  });
  console.log(response.data);
  return response.data;
};
