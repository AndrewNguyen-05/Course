import React, { useState, useEffect } from 'react';
import { creationPost, getAllPosts } from '../../../service/PostService';
import { toast, ToastContainer } from 'react-toastify';
import { getAvatar } from '../../../service/ProfileService';
import SidebarCommunity from './components/SidebarCommunity';
import ModalCreatePost from './components/ModalCreatePost';
import PostArticle from './components/PostArticle';
import PostList from './components/PostList';

export const Community = () => {
  const token = localStorage.getItem('token');
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [avatar, setAvatar] = useState('https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg');
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


  const fetchPosts = async () => {
    setLoading(true);

    try {
      const data = await getAllPosts(currentPage, filterQuery);
      if (data && data.result && Array.isArray(data.result.data)) {
        const newPosts = data.result.data;
        console.log("Page", currentPage)
        if (currentPage === 1) {
          setPosts(newPosts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...newPosts.filter(post => !prevPosts.some(p => p.id === post.id))]);
        }
        setTotalPages(data.result.totalPages || 1);
        setHasMore(currentPage < data.result.totalPages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    setIsSearching(false);
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

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
