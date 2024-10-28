import React, { useState } from 'react';
import { Card, Image } from 'react-bootstrap';
import PostModal from './PostModal';
import { PostFooter } from './PostFooter';
import avatarDefault from '../../../../img/avatar-default.jpg'

const PostCard = (props) => {
  const { id, author, avatar, content, image, likes, comments, createdAt, owner, handleDeletePost }
    = props;
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  return (
    <>
      <Card className="post-card mb-1">
        <Card.Header className="post-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Image
              src={avatar || avatarDefault}
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
          {owner && <button className="delete-post-button"
            onClick={() => handleDeletePost(id)}
          >
            <i className="fa-solid fa-trash"></i>
          </button>}
        </Card.Header>

        <Card.Body>
          <Card.Text className="post-content">{content}</Card.Text>

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

      <PostModal show={showModal} handleClose={handleModalClose} post={{ id, author, avatar, content, image, likes, comments, createdAt }} />
    </>
  );
};

export default PostCard;
