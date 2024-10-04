import React, { useState } from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';
import PostModal from './PostModal';

const PostCard = ({ id, author, avatar, content, image, likes, comments, createdAt }) => {
  const [showModal, setShowModal] = useState(false);

  // Mở/Đóng Modal
  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  return (
    <>
      <Card className="mb-4 shadow-sm post-card">
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <Image
              src={avatar || "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"}
              roundedCircle
              width={50}
              height={50}
              className="me-3"
            />
            <div>
              <strong>{author}</strong>
              <p className="text-muted mb-0" style={{ fontSize: '0.85em' }}>{createdAt}</p>
            </div>
          </div>

          <Card.Text>{content}</Card.Text>

          {/* Hình ảnh trong bài viết */}
          {image && (
            <div className="post-image-container mb-3">
              <img
                src={image}
                alt="Post"
                style={{ width: '100%', borderRadius: '10px' }}
              />
            </div>
          )}

          <div className="d-flex justify-content-around align-items-center mb-3">
            <Button variant className="btn-sm like-post-home">
              <FaThumbsUp /> {likes}
            </Button>
            <Button variant className="btn-sm comment-post-home" onClick={handleModalOpen}>
              <FaComment />  {comments}
            </Button>
            <Button variant className="btn-sm share-post-home">
              <FaShare />
            </Button>
          </div>
        </Card.Body>
      </Card>

      <PostModal show={showModal} handleClose={handleModalClose} post={{ id, author, avatar, content, image, likes, comments, createdAt }} />
    </>
  );
};

export default PostCard;
