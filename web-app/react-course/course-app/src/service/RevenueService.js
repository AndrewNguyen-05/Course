import axios from "../utils/CustomizeAxios";

export const revenueDetail = async (year) => {
  const response = await axios.post(`api/v1/revenue-detail`, {
    year: year,
    periodType: "YEAR",
  });
  return response.data;
};
