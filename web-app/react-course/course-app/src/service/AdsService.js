import axios from "../utils/CustomizeAxios";

export const getAdsByCurrentLogin = async (page) => {
    try {
        const response = await axios.get(`api/v1/get-ads-current`, {
            params: {
                page: page
            }
        });
        return response.data;

    } catch (error) {
        throw new Error(`Failed to fetch ads: ${error.response?.status || error.message}`);
    }
};

export const registerAds = async (token, formData) => {
    try {
        const response = await axios.post('api/v1/register-ads', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;

    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Fail to registerAds';
        throw new Error(errorMessage);
    }
};


export const getAdsActive = async () => {
    return axios.get(`api/v1/get-ads-active`)
}
