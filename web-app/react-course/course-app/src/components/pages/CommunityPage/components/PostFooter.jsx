import React from "react";
import { Button } from "react-bootstrap";
import { FaCommentAlt, FaShare, FaThumbsUp } from "react-icons/fa";

export const PostFooter = ({handleModalOpen}) => {
    return (
        <div className="post-footer d-flex justify-content-around py-2 px-3 border-top">
            <Button variant="link" className="post-action text-primary like-post">
                <FaThumbsUp /> Likes
            </Button>
            <Button variant="link" className="post-action text-info comment-post" onClick={handleModalOpen}>
                <FaCommentAlt /> Comments
            </Button>
            <Button variant="link" className="post-action text-secondary share-post">
                <FaShare /> Share
            </Button>
        </div>
    )
}
