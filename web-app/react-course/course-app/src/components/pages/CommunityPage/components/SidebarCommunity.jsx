import { Form } from "react-bootstrap";
import { FaHome, FaSearch } from "react-icons/fa";
import { FaPen } from 'react-icons/fa';
import { Link } from "react-router-dom";

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
                <Link to="/community" ><SidebarMenuItem title="Dashboard" icon={<FaHome />} /></Link>
                <Link to="/community/my-post"><SidebarMenuItem title="My Post" icon={<FaPen  />} /></Link>
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