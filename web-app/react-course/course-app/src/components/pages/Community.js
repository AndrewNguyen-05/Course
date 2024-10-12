import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Modal, Spinner } from 'react-bootstrap';
import { FaHome, FaImage, FaMapMarkerAlt, FaRegFrown, FaRegGrinAlt, FaSave, FaSearch, FaSmile, FaUserFriends, FaVideo } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostCard from '../AppComponents/PostCard';
import { creationPost, getAllPosts } from '../../service/PostService';
import { toast, ToastContainer } from 'react-toastify';
import { MdExplore, MdGif, MdLiveTv, MdVideoLibrary } from 'react-icons/md';
import { getAvatar } from '../../service/ProfileService';
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';

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
      const jsonBlog = new Blob([JSON.stringify({ content: newPost.content })], { type: 'application/json' });

      const formData = new FormData();
      formData.append('request', jsonBlog);
      if (newPost.image) {
        formData.append('file', newPost.image); // Append file nếu c
      }
      const newCreatedPost  = await creationPost(formData);
      if (newCreatedPost) {
        setPosts((prevPosts) => [newCreatedPost, ...prevPosts]);
      }
      setShowModal(false);
      setSelectedImage(null);
      setNewPost({ content: '', image: null });
    } catch (error) {
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

        <div className="sidebar bg-dark text-light p-4">
          <Form.Group className="search-group position-relative mb-3">
            <Form.Control
              type="text"
              placeholder="Search Post"
              className="custom-search-input"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
            <button className="search-button"
              onClick={handlesearchPost}
            >
              <FaSearch />
            </button>
          </Form.Group>
          <div className="sidebar-menu">
            <SidebarMenuItem title="Home" icon={<FaHome />} />
            <SidebarMenuItem title="Live" icon={<MdLiveTv />} />
            <SidebarMenuItem title="Reels" icon={<FaVideo />} />
            <SidebarMenuItem title="Programme" icon={<MdVideoLibrary />} />
            <SidebarMenuItem title="Discover" icon={<MdExplore />} />
            <SidebarMenuItem title="Saved Posts" icon={<FaSave />} />
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="create-post-container">
            <div className="create-post-header d-flex align-items-center">
              <img src={avatar || "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"} alt="User Avatar" className="avatar-img me-3" />
              <Form.Control
                type="text"
                placeholder="Đức ơi, bạn đang nghĩ gì thế?"
                onClick={() => setShowModal(true)}
                className="create-post-input"
              />
            </div>
            <div className="create-post-footer d-flex justify-content-around mt-3">
              <Button variant="outline-danger" className="d-flex align-items-center">
                <FaVideo className="me-1" />
                Live Video
              </Button>
              <Button variant="outline-success" className="d-flex align-items-center">
                <FaImage className="me-1" />
                Photo/Video
              </Button>
              <Button variant="outline-warning" className="d-flex align-items-center">
                <FaSmile className="me-1" />
                Feeling/Activity
              </Button>
            </div>
          </div>

          {/* Modal đăng bài viết */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered className='modal-show'>
            <Modal.Header closeButton>
              <Modal.Title>Create a New Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handlePostSubmit}>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="What's on your mind?"
                    value={newPost.content}
                    onChange={handleContentChange}
                  />
                </Form.Group>

                {/* Thêm phần icon ngay bên dưới textarea */}
                <div className="d-flex align-items-center justify-content-between my-3 icon-toolbar">
                  <span className="text-secondary">Add to your post</span>
                  <div className="icon-container d-flex">
                    <label htmlFor="image-upload" className="icon-label me-3">
                      <FaImage size={24} className="text-success" />
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                      />
                    </label>
                    <FaUserFriends size={24} className="icon me-3 text-primary" />
                    <FaSmile size={24} className="icon me-3 text-warning" />
                    <FaMapMarkerAlt size={24} className="icon me-3 text-danger" />
                    <MdGif size={24} className="icon me-3 text-info" />
                    <FaRegGrinAlt size={24} className="icon text-secondary" />
                  </div>
                </div>

                {/* Hiển thị ảnh xem trước nếu đã chọn */}
                {selectedImage && (
                  <div className="mt-3">
                    <img
                      src={selectedImage}
                      alt="Selected Preview"
                      style={{ width: '100%', maxHeight: '400px', borderRadius: '10px' }}
                    />
                  </div>
                )}

                <Button className="mt-3 btn-block btn-port" variant="primary" type="submit" size="lg">
                  Post
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Danh sách bài viết với InfiniteScroll */}
          <Container>
            <Row className="justify-content-md-center">
              <Col md={8}>

                {isSearching && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="d-flex justify-content-center align-items-center my-5"
                  >
                    <ClipLoader color={"#007bff"} size={50} />
                    <span className="ms-3">Searching for posts...</span>
                  </motion.div>
                )}

                {!loading && posts.length === 0 && !isSearching ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center my-4"
                  >
                    <FaRegFrown size={100} color="#ccc" className="my-3" />
                    <p>No results were found matching your keyword.</p>
                  </motion.div>
                ) : (
                  <InfiniteScroll
                    dataLength={posts.length}
                    next={() => setCurrentPage((prevPage) => prevPage + 1)}
                    hasMore={hasMore}
                    loader={
                      !isSearching && (
                        <div className="text-center my-3">
                          <Spinner animation="border" />
                          <p>Đang tải thêm bài viết...</p>
                        </div>
                      )
                    }
                    endMessage={<p className="text-center text-secondary">There are no more posts to display!</p>}
                  >
                    {posts.map((post) => (
                      <motion.div
                        key={post.id}
                        className="post-container mb-1 p-2 rounded"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <PostCard
                          id={post.id}
                          author={post.name}
                          content={post.content}
                          avatar={post.avatar}
                          image={post.image}
                          likes={post.likes}
                          comments={post.comments}
                          createdAt={post.createdAt}
                        />
                      </motion.div>
                    ))}
                  </InfiniteScroll>

                )}
              </Col>
            </Row>
          </Container>
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

const SidebarMenuItem = ({ title, icon }) => (
  <div className="sidebar-item d-flex align-items-center mb-3 p-2 .sidebar-menu">
    <span className="me-3">{icon}</span>
    <span>{title}</span>
  </div>
);

export default Community;
