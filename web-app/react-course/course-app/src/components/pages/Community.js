import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';
import { FaImage, FaUserFriends, FaSmile, FaMapMarkerAlt, FaRegGrinAlt } from 'react-icons/fa';
import { MdGif } from 'react-icons/md';
import PostCard from '../AppComponents/PostCard';

export const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim() !== '') {
      const newPostObj = {
        id: Date.now(),
        content: newPost,
        image: selectedImage,
        likes: 0,
        comments: []
      };
      setPosts([newPostObj, ...posts]);
      setNewPost('');
      setSelectedImage(null);
      setShowModal(false);
    }
  };

  // Xử lý cập nhật trạng thái likes cho một bài viết
  const handleLikePost = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // Hiển thị trước ảnh đã chọn
    }
  };

  return (
    <div>
      {/* Phần banner */}
      <div className="banner-community text-white text-center d-flex justify-content-center align-items-center position-relative">
        <div className="banner-content">
          <h1 className="banner-title mb-3">Welcome to the Learning Community</h1>
          <p className="banner-subtitle mb-4">
            Share your knowledge, collaborate with others, and grow together.
          </p>
          {/* Nút Join Now mở Modal */}
          <Button
            variant="light"
            size="lg"
            className="rounded-pill banner-button shadow-sm"
            onClick={() => setShowModal(true)}
          >
            Join Now
          </Button>
        </div>
      </div>

      {/* Modal hiển thị Form đăng bài */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create a New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePostSubmit}>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="form-control-custom"
              />
            </Form.Group>

            {/* Thanh biểu tượng để thêm ảnh, cảm xúc, v.v. */}
            <div className="d-flex align-items-center justify-content-between my-3 icon-toolbar">
              <span className="text-secondary">Add to your post</span>
              <div className="icon-container d-flex">
                {/* Icon để chọn ảnh */}
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

            {/* Hiển thị ảnh đã chọn nếu có */}
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

      <div className="community-container bg-light min-vh-100 py-5">
        <Container>
          <Row className="justify-content-md-center">
            <Col md={8}>
              {/* Hiển thị các bài viết */}
              {posts.length === 0 ? (
                <p className="text-center text-secondary">No posts yet. Be the first to post!</p>
              ) : (
                posts.map((post, index) => (
                  <PostCard
                    key={index}
                    author="User"
                    content={post.content}
                    image={post.image}
                    likes={post.likes}
                    comments={post.comments.length}
                    onLike={() => handleLikePost(post.id)} // Truyền hàm xử lý Like vào PostCard
                  />
                ))
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
