import { toast } from "react-toastify";
import axios from "../components/utils/CustomizeAxios";

export const creationPost = async (formData) => {
  try {
    const response = await axios.post('api/v1/create-post',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (response.data.result) {
      toast.success('Created Post Succesfully')
      return response.data.result;
    } else {
      toast.error(response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error in create Post:', error);
    throw error;
  }
};

export const getAllPosts = async (currentPage, filterQuery) => {
  try {
    let urlApi = `api/v1/get-all-post?page=${currentPage}`;
    if (filterQuery) {
      const formattedQuery = `content~~'*${encodeURIComponent(filterQuery)}*' or user.name~~'*${encodeURIComponent(filterQuery)}*'`;
      urlApi += `&filter=${formattedQuery}`;
    }

    const response = await axios.get(urlApi);
    return response.data;

  } catch (error) {
    console.error('Error fetching post filter:', error);
    throw error;
  }
};


export const getPostByUserLogin = async (currentPage) => {
  try {
    const response = await axios.get(`api/v1/get-post-current-login`, {
      params: {
        page: currentPage
      }
    })

    return response.data;
  } catch (error) {
    console.error('Error fetching post current login:', error);
    throw error;
  }
}

export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`api/v1/delete-post/${postId}`);
    return response.data;
  } catch (error) {
    console.log('Fail to delete post')
    throw error;
  }
}