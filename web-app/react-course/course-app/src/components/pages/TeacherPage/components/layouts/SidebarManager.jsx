import { FaCalendar, FaClipboard, FaFile, FaGraduationCap, FaMapMarkedAlt, FaQuestionCircle, FaUniversity } from "react-icons/fa";

const SidebarManager = () => {
    return (
        <div className="manager-course-sidebar">
            <h3>Lessons</h3>
            <ul>
                <li><FaGraduationCap className="icon" style={{ color: '#2ecc71' }} /> Lessons</li>
                <li><FaClipboard className="icon" style={{ color: '#27ae60' }} /> Assignments</li>
                <li><FaCalendar className="icon" style={{ color: '#8e44ad' }} /> Schedule</li>
                <li><FaUniversity className="icon" style={{ color: '#d35400' }} /> Library</li>
                <li><FaQuestionCircle className="icon" style={{ color: '#e67e22' }} /> FAQs</li>
                <hr />
                <li><FaFile className="icon" style={{ color: '#3498db' }} /> New Page</li>
                <hr />
                <li><FaMapMarkedAlt className="icon" style={{ color: '#e74c3c' }} /> Map</li>
            </ul>
        </div>
    );
}

export default SidebarManager;