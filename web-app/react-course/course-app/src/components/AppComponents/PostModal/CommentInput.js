import React from "react";
import { Button, Form, Image } from "react-bootstrap";
import { BsFillImageFill } from "react-icons/bs";
import { FaCamera, FaPaperPlane, FaSmile } from "react-icons/fa";
import { MdGif } from "react-icons/md";

export const CommentInput = ({avatar, commentContent , setCommentContent, handleAddComment }) => {
    return (
        <div className="post-comment-input-container d-flex align-items-center mt-3 p-2 rounded shadow-sm">
            <Image
                src={avatar}
                roundedCircle
                width={40}
                height={30}
                className="me-3 shadow-sm"
            />
            <Form.Control
                type="text"
                placeholder="Viết bình luận của bạn..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="shadow-sm flex-grow-1 me-2"
            />
            <div className="post-icon-container d-flex align-items-center">
                <FaSmile size={20} className="post-icon me-2 text-warning" title="Thêm biểu tượng cảm xúc" />
                <BsFillImageFill size={20} className="post-icon me-2 text-success" title="Thêm ảnh" />
                <MdGif size={22} className="post-icon me-2 text-info" title="Thêm GIF" />
                <FaCamera size={20} className="post-icon me-2 text-primary" title="Chụp ảnh" />
            </div>

            <Button variant="link" className="p-0 text-primary">
                <FaPaperPlane size={24} onClick={handleAddComment} />
            </Button>

        </div>
    );
}