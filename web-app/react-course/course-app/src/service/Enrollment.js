import axios from "../utils/CustomizeAxios"

export const checkPurchase = async(courseId) => {
   const response = await axios.get(`api/v1/check-purchase/${courseId}`);
   return response.data;
}