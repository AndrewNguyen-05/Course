import { FaCheckCircle, FaClipboardList, FaFolderOpen } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";

const StatisticsOverview = () => {
    return (
        <div className="manager-courses-stats">
            <div className="stats-card">
                <h3 className="icons-lesson-detail-student"><PiStudentBold /></h3>
                <p>120 Enrolled</p>
            </div>
            <div className="stats-card">
                <h3 className="icons-lesson-detail-lessons"><FaClipboardList /></h3>
                <p>25 Lessons</p>
            </div>
            <div className="stats-card">
                <h3 className="icons-lesson-detail-chapters"><FaFolderOpen /></h3>
                <p>3 Total</p>
            </div>
            <div className="stats-card">
                <h3 className="icons-lesson-detail-completion"><FaCheckCircle /></h3>
                <p>80% Average</p>
            </div>
        </div>
    );
}

export default StatisticsOverview;
