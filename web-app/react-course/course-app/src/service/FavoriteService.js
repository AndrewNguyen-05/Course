import axios from "../components/utils/CustomizeAxios";

export const getFavorite = async (currentPage) => {
    try {
        const response = await axios.get(`api/v1/fetch-all-favorites`, {
            params: {
                page: currentPage
            }
        })
        return response.data;
    } catch (error) {
        console.log('Fail to get Fevorite', error);
        throw error;
    }
}

export const addFavorite = async (courseId) => {
    try {
        const response = await axios.post(`api/v1/save-favorite`, {
            id: courseId
        });
        console.log(response);
        return response;
    } catch (error) {
        console.error('Failed to add to favorites', error);
        throw error;
    }
};


export const removeFavorite = async (favoriteId) => {
    try {
        const response = await axios.delete(`api/v1/delete-favorite/${favoriteId}`);
        return response;
    } catch (error) {
        console.log('Failed to delete favorite', error);
        throw error;
    }
};


