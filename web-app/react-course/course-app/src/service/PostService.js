import { toast } from "react-toastify";

export const creationPost = async (token, formData) => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/create-post', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message)
      throw new Error(errorData.message || 'Failed to create post');
    }
    return await response.json();

  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getAllPosts = async (token, currentPage, filterQuery) => {

  try {
    let urlApi = `http://localhost:8080/api/v1/get-all-post?page=${currentPage}`;
    if (filterQuery) {
      urlApi += `&filter=${encodeURIComponent(filterQuery)}`;
      console.log("Filter Query:", filterQuery);
      console.log("API URL:", urlApi);
    }

    const response = await fetch(urlApi, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error fetching post filter:', error);
    throw error;
  }
}

export const getPostByUserLogin = async (token, currentPage) => {
  const response = await fetch(`http://localhost:8080/api/v1/get-post-current-login?page=${currentPage}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error('Fail to fecth post by user login', errorData.message);
  }

  return response.json();
}

export const deletePost = async (token, postId) => {
  const response = await fetch(`http://localhost:8080/api/v1/delete-post/${postId}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
}