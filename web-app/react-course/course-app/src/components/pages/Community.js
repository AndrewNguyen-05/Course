import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Form, Container, Row, Col, Modal, Spinner } from 'react-bootstrap';
import { FaImage, FaUserFriends, FaSmile, FaMapMarkerAlt, FaRegGrinAlt, FaHome, FaVideo, FaSave } from 'react-icons/fa';
import { MdExplore, MdGif, MdLiveTv, MdVideoLibrary } from 'react-icons/md';
import PostCard from '../AppComponents/PostCard';
import { creationPost, getAllPosts } from '../../service/PostService';
import { toast, ToastContainer } from 'react-toastify';
import { TopBar } from '../layouts/TopBar';
import { Header } from '../layouts/Header';

export const Community = () => {
  const token = localStorage.getItem('token');
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [filterQuery, setFilterQuery] = useState('');

  const observer = useRef();

  const firstRender = useRef(true); // Dùng để kiểm tra xem useEffect có chạy lần đầu không

  // Hàm lấy bài viết từ API
  useEffect(() => {
    const fetchPosts = async () => {
      console.log("Fetching page:", currentPage);
      setLoading(true);
      try {
        const data = await getAllPosts(currentPage, filterQuery);
        if (data && data.result && Array.isArray(data.result.data)) {
          const newPosts = data.result.data.filter(
            (newPost) => !posts.some((post) => post.id === newPost.id)
          );
          setPosts((prevPosts) => [...prevPosts, ...newPosts]); // Gộp dữ liệu mới
          setTotalPages(data.result.totalPages || 1);
          setHasMore(currentPage < data.result.totalPages); // Cập nhật hasMore
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    // Chỉ chạy fetchPosts nếu không phải lần render đầu tiên
    if (!firstRender.current) {
      fetchPosts();
    } else {
      firstRender.current = false; // Lần đầu render, không gọi API
    }
  }, [currentPage]); // Chỉ phụ thuộc vào currentPage

  const lastPostRef = useCallback(
    (node) => {
      if (loading || !hasMore) return; // Nếu đang tải hoặc không còn bài viết mới
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node); // Gán observer cho phần tử cuối cùng
    },
    [loading, hasMore]
  );

  const [newPost, setNewPost] = useState(
    { content: '', image: null }
  );

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
      formData.append('file', newPost.image);

      await creationPost(token, formData);
      toast.success('Create Post Successfully');
      setShowModal(false);
      setCurrentPage(1);
      setPosts([]);
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

  const handleLikePost = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  return (
    <div className="community-container d-flex">
      {/* Sidebar Menu */}
      <div className="sidebar bg-dark text-light p-4">
        <h4 className="text-white mb-4">Video</h4>
        <Form.Control type="text" placeholder="Search Post" className="mb-3" />
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
            <img src="https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg" alt="User Avatar" className="avatar-img me-3" />
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
              Video trực tiếp
            </Button>
            <Button variant="outline-success" className="d-flex align-items-center">
              <FaImage className="me-1" />
              Ảnh/video
            </Button>
            <Button variant="outline-warning" className="d-flex align-items-center">
              <FaSmile className="me-1" />
              Cảm xúc/hoạt động
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
                  <p>Preview Image:</p>
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

        {/* Hiển thị danh sách bài viết */}
        <Container className="view-post">
          <Row className="justify-content-md-center">
            <Col md={8}>
              {posts.length === 0 ? (
                <p className="text-center text-secondary">No posts yet. Be the first to post!</p>
              ) : (
                posts.map((post, index) => (
                  <PostCard
                    key={post.id}
                    author={post.name}
                    avatar={post.avatar}
                    content={post.content}
                    image={post.image}
                    likes={post.likeCount}
                    createdAt={post.createdAt}
                    onLike={() => { }}
                    ref={index === posts.length - 1 ? lastPostRef : null}
                  />
                ))
              )}
              {loading && (
                <div className="text-center my-3">
                  <Spinner animation="border" />
                  <p>Loading more posts...</p>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

const SidebarMenuItem = ({ title, icon }) => (
  <div className="sidebar-item d-flex align-items-center mb-3 p-2">
    <span className="me-3">{icon}</span>
    <span>{title}</span>
  </div>
);