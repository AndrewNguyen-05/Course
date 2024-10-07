import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaEllipsisH } from 'react-icons/fa';

const CommentDropdown = ({ commentId, handleEdit, handleDelete, activeDropdownId, toggleDropdown, commentContent }) => {
    return (
        <Dropdown show={activeDropdownId === commentId} onToggle={() => toggleDropdown(commentId)} className="ms-auto">
            <Dropdown.Toggle as="button" className="post-dropdown-toggle">
                <FaEllipsisH />
            </Dropdown.Toggle>
            <Dropdown.Menu className="post-dropdown-menu">
                <Dropdown.Item onClick={() => handleEdit(commentId, commentContent)}>Edit</Dropdown.Item> {/* Truyền thêm commentContent */}
                <Dropdown.Item onClick={() => handleDelete(commentId)}>Delete</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default CommentDropdown;
