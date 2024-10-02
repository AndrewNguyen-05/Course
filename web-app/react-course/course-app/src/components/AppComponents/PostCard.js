import React from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';
import CommentBox from './CommentBox ';

// Sử dụng forwardRef để có thể nhận ref từ component cha
const PostCard = React.forwardRef(({ author, avatar, content, image, likes, comments, createdAt, onLike }, ref) => {
  return (
    <Card className="mb-4 shadow-sm post-card" ref={ref}> {/* Thêm ref vào thẻ Card */}
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
          <Button variant="outline-primary" className="btn-sm" onClick={onLike}>
            <FaThumbsUp /> Like {likes}
          </Button>
          <Button variant="outline-danger" className="btn-sm">
            <FaComment /> Comment {comments}
          </Button>
          <Button variant="outline-success" className="btn-sm">
            <FaShare /> Share
          </Button>
        </div>

        <CommentBox />
        
      </Card.Body>
    </Card>
  );
});

export default PostCard;
