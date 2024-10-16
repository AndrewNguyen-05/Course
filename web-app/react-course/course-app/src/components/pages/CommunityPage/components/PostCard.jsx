import React, { useState } from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { FaThumbsUp, FaCommentAlt, FaShare } from 'react-icons/fa';
import PostModal from './PostModal';
import { PostFooter } from './PostFooter';

const PostCard = ({ id, author, avatar, content, image, likes, comments, createdAt }) => {
  const [showModal, setShowModal] = useState(false);

  // Mở/Đóng Modal
  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  return (
    <>
      <Card className="post-card mb-1">
        {/* Header của bài đăng */}
        <Card.Header className="post-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Image
              src={avatar || "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"}
              roundedCircle
              width={50}
              height={50}
              className="me-3"
            />
            <div>
              <strong className="post-author">{author}</strong>
              <p className="text-muted mb-0 post-created">{createdAt}</p>
            </div>
          </div>
        </Card.Header>

        {/* Nội dung bài viết */}
        <Card.Body>
          <Card.Text className="post-content">{content}</Card.Text>

          {/* Hình ảnh trong bài viết */}
          {image && (
            <div className="post-image-container mb-3">
              <img
                src={image}
                alt="Post"
                className="post-image"
              />
            </div>
          )}
        </Card.Body>
        
        <PostFooter handleModalOpen={handleModalOpen} />
      </Card>

      {/* Modal hiển thị chi tiết bài viết */}
      <PostModal show={showModal} handleClose={handleModalClose} post={{ id, author, avatar, content, image, likes, comments, createdAt }} />
    </>
  );
};

export default PostCard;
