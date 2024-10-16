import React from "react";
import { Image } from "react-bootstrap";

export const PostHeader = ({ avatar, author, createdAt }) => {

    return (
        <div className="d-flex align-items-center p-3">
            <Image
                src={avatar || "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"}
                roundedCircle
                width={40}
                height={40}
                className="me-3"
            />
            <div>
                <strong>{author}</strong>
                <p className="text-muted mb-0" style={{ fontSize: '0.85em' }}>{createdAt}</p>
            </div>
        </div>
    );

}