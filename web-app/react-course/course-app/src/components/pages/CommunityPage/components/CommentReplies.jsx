import React from "react";
import { Button, Dropdown, Form, Image } from "react-bootstrap";
import { FaEllipsisH } from "react-icons/fa";

export const CommentReplies = ({
    replies,
    timeAgo,
    handleEditComment,
    handleDeleteComment,
    handleSaveEdit,
    handleCancelEdit,
    activeDropdownId,
    toggleDropdown,
    editingCommentId,
    setEditContent,
    editContent,

}) => {
    return (
        <div className="replies-container ml-4 mt-2">
            {replies.map((reply) => (
                <div key={reply.id} className="reply-item d-flex align-items-start mt-2">
                    <Image src={reply.avatar} roundedCircle width={25} height={25} className="me-2" />
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{reply.name}</strong>
                                <span className="text-muted"> - {timeAgo(reply.createdAt)}</span>
                            </div>
                            {/* Dropdown cho các hành động của reply */}
                            <Dropdown show={activeDropdownId === reply.id} onToggle={() => toggleDropdown(reply.id)} className="ms-auto">
                                <Dropdown.Toggle as="button" className="post-dropdown-toggle">
                                    <FaEllipsisH />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="post-dropdown-menu">
                                    <Dropdown.Item onClick={() => handleEditComment(reply.id, reply.content)}>Edit</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleDeleteComment(reply.id)}>Delete</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        {/* Hiển thị nội dung reply */}
                        {editingCommentId === reply.id ? (
                            <div>
                                <Form.Control
                                    as="textarea"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="my-2"
                                />
                                <Button variant="primary" onClick={() => handleSaveEdit(reply.id)}>Save</Button>
                                <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                            </div>
                        ) : (
                            <p className="mb-1">{reply.content}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}