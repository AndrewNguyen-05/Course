import { FaCommentDots, FaPlayCircle, FaUsers } from "react-icons/fa";
import { RiStarSFill } from "react-icons/ri";

const Instructor = ({ infoTeacher }) => {
    return (
        <div className="info-teacher-container">
            <div className="info-teacher-profile">
                <img src={infoTeacher.avatar} alt={`${infoTeacher.name}'s Avatar`} className="info-teacher-avatar" />
                <div className="info-teacher-details">
                    <h4 className="info-teacher-name">{infoTeacher.name}</h4>
                    <div className="info-teacher-stats">
                        <div className="info-teacher-stat-item">
                            <span className="icon-star"><RiStarSFill /></span> {infoTeacher.avgRating} Instructor Rating
                        </div>
                        <div className="info-teacher-stat-item">
                            <span className="icon-reviews"><FaCommentDots /></span> {infoTeacher.reviewAmount} Reviews
                        </div>
                        <div className="info-teacher-stat-item">
                            <span className="icon-students"><FaUsers /></span> {infoTeacher.studentAmount} Students
                        </div>
                        <div className="info-teacher-stat-item">
                            <span className="icon-courses"><FaPlayCircle /></span> {infoTeacher.courseAmount} Courses
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Instructor;