import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';

const CommentBox = () => {
  return (
    <div className="mt-4 comment-box">
      {/* Bình luận mẫu */}
      <Card className="mb-2">
        <Card.Body>
          <strong>Anna:</strong> This is a great post!
        </Card.Body>
      </Card>
     
      {/* Form nhập bình luận */}
      <hr/>
      <Form>
        <Form.Group>
          <Form.Control type="text" placeholder="Write a comment..." />
        </Form.Group>
        <Button className="mt-2" variant="primary" size="sm">
          Comment
        </Button>
      </Form>
    </div>
  );
};

export default CommentBox;
