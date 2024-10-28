import React, { useState, useEffect, useCallback } from 'react';
import { creationPost, deletePost, getAllPosts } from '../../../service/PostService';
import { toast, ToastContainer } from 'react-toastify';
import { getAvatar } from '../../../service/ProfileService';
import SidebarCommunity from './components/SidebarCommunity';
import ModalCreatePost from './components/ModalCreatePost';
import PostArticle from './components/PostArticle';
import PostList from './components/PostList';
import avatarDefault from '../../../img/avatar-default.jpg'
import Swal from 'sweetalert2';

export const Community = () => {
  const token = localStorage.getItem('token');
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [avatar, setAvatar] = useState(avatarDefault);
  const [newPost, setNewPost] = useState({ content: '', image: null });
  const [filterQuery, setFilterQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getAvatar()
      .then((data) => setAvatar(data.result))
      .catch((error) => console.log(error));
  }, [token]);


  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllPosts(currentPage, filterQuery);
      if (data && data.result && Array.isArray(data.result.data)) {
        const newPosts = data.result.data;
        console.log("Page", currentPage);
        if (currentPage === 1) {
          setPosts(newPosts);
        } else {
          setPosts((prevPosts) => [
            ...prevPosts,
            ...newPosts.filter((post) => !prevPosts.some((p) => p.id === post.id))
          ]);
        }
        setHasMore(currentPage < data.result.totalPages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [currentPage, filterQuery]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlesearchPost = () => {
    setIsSearching(true);
    setPosts([]);
    setCurrentPage(1);

    setTimeout(() => {
      fetchPosts(1, filterQuery);
    }, 2000);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please log in again.');
      return;
    }
    try {
      setIsLoadingPost(true);
      const jsonBlog = new Blob([JSON.stringify({ content: newPost.content })], { type: 'application/json' });

      const formData = new FormData();
      formData.append('request', jsonBlog);
      if (newPost.image) {
        formData.append('file', newPost.image);
      }
      const newCreatedPost = await creationPost(formData);
      if (newCreatedPost) {
        setPosts((prevPosts) => [newCreatedPost, ...prevPosts]);
      }
      setShowModal(false);
      setSelectedImage(null);
      setNewPost({ content: '', image: null });
      setIsLoadingPost(false);
    } catch (error) {
      setIsLoadingPost(true);
      console.log(error);
    }
  };

  const handleContentChange = (e) => setNewPost({ ...newPost, content: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
      setNewPost({ ...newPost, image: file });
    }
  };

  const handleDeletePost = (postId) => {
    Swal.fire({
        title: 'Are you sure ?',
        text: 'Do you want to delete this post ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete now',
        cancelButtonText: "No, cancel",
        width: "370px",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await deletePost(postId);
                setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your post has been deleted.',
                    icon: 'success',
                    width: "370px",
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error.message || 'Đã xảy ra lỗi trong quá trình mua khóa học. Vui lòng thử lại sau.',
                    icon: 'error'
                });
                console.error(error);
            }
        }
    })
}

  return (
    <div className='content-page'>
      <div className="community-container d-flex">

        <SidebarCommunity
          filterQuery={filterQuery}
          setFilterQuery={setFilterQuery}
          handlesearchPost={handlesearchPost}
        />

        <div className="main-content">
          <ModalCreatePost setShowModal={setShowModal} avatar={avatar} />
          <PostArticle
            showModal={showModal}
            setShowModal={setShowModal}
            handlePostSubmit={handlePostSubmit}
            newPost={newPost}
            handleContentChange={handleContentChange}
            handleImageChange={handleImageChange}
            selectedImage={selectedImage}
            isLoadingPost={isLoadingPost}
          />

          <PostList
            posts={posts}
            loading={loading}
            isSearching={isSearching}
            hasMore={hasMore}
            setCurrentPage={setCurrentPage}
            handleDeletePost={handleDeletePost}
          />
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          style={{ top: '20%', right: '20px' }}
        />
      </div>
    </div>
  );
};

export default Community;
