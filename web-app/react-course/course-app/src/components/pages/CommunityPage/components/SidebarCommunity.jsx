import { Form } from "react-bootstrap";
import { FaBook, FaBookmark, FaComments, FaHome, FaSearch } from "react-icons/fa";
import { MdLibraryBooks, MdLiveTv } from "react-icons/md";

const SidebarCommunity = (props) => {

    const {
        filterQuery,
        setFilterQuery,
        handlesearchPost
    } = props;

    return (
        <div className="sidebar bg-dark text-light p-4">
            <Form.Group className="search-group position-relative mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search Post"
                    className="custom-search-input"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                />
                <button className="search-button"
                    onClick={handlesearchPost}
                >
                    <FaSearch />
                </button>
            </Form.Group>
            <div className="sidebar-menu">
                <SidebarMenuItem title="Dashboard" icon={<FaHome />} />
                <SidebarMenuItem title="Live Classes" icon={<MdLiveTv />} />
                <SidebarMenuItem title="Discussions" icon={<FaComments />} />
                <SidebarMenuItem title="Courses" icon={<MdLibraryBooks />} />
                <SidebarMenuItem title="Resources" icon={<FaBook />} />
                <SidebarMenuItem title="Saved Resources" icon={<FaBookmark />} />
            </div>
        </div>
    );
}

const SidebarMenuItem = ({ title, icon }) => (
    <div className="sidebar-item d-flex align-items-center mb-3 p-2">
        <span className="me-3">{icon}</span>
        <span>{title}</span>
    </div>
);

export default SidebarCommunity;