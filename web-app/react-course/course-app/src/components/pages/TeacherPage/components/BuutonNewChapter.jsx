import { FaPlus } from "react-icons/fa";
import { FcManager } from "react-icons/fc";

const ButtonNewChapter = ({handleOpenModal}) => {
    return (
        <div className="manager-courses-header">
            <h2><FcManager /> &nbsp; Manage Courses</h2>
            <button className="manager-courses-btn-create" onClick={handleOpenModal}>
                <FaPlus /> New Chapter
            </button>
        </div>
    );
}

export default ButtonNewChapter;