import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaThumbsUp, FaComment } from 'react-icons/fa';
import CommentBox from './CommentBox ';

const PostCard = ({ author, content, image, likes, comments, onLike }) => {
  return (
    <Card className="mb-4 shadow-sm post-card">
      <Card.Body>
        <Card.Title>{author}</Card.Title>
        <Card.Text>{content}</Card.Text>

        {/* Hiển thị hình ảnh nếu có */}
        {image && (
          <div className="post-image-container mb-3">
            <img
              src={image}
              alt="Post"
              style={{ width: '100%', borderRadius: '10px' }}
            />
          </div>
        )}

        {/* Khu vực nút Like và Comment */}
        <div className="d-flex justify-content-between align-items-center">
          <Button variant="outline-primary" className="btn-sm" onClick={onLike}>
            <FaThumbsUp /> Like {likes}
          </Button>
          <Button variant="outline-secondary" className="btn-sm">
            <FaComment /> Comment {comments}
          </Button>
        </div>
        {/* Khu vực hiển thị Comment */}
        <CommentBox />
      </Card.Body>
    </Card>
  );
};

export default PostCard;
