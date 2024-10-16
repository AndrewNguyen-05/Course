import React from "react";
import { Button } from "react-bootstrap";
import { FaCommentAlt, FaShare, FaThumbsUp } from "react-icons/fa";

export const PostFooter = () => {
    return (
        <div className="post-footer d-flex justify-content-around py-2 px-3 border-top">
            <Button variant="link" className="post-action text-primary">
                <FaThumbsUp /> Likes
            </Button>
            <Button variant="link" className="post-action text-info">
                <FaCommentAlt /> Comments
            </Button>
            <Button variant="link" className="post-action text-secondary">
                <FaShare /> Share
            </Button>
        </div>
    )
}
