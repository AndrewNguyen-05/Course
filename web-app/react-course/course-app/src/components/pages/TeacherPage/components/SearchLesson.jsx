import { FaSearch } from "react-icons/fa";

const SearchLesson = () => {
    return (
        <div className="manager-courses-controls">
            <div className="search-bar-lesson">
                <input type="text" placeholder="Search for lessons..." />
                <button className="search-button-lesson">
                    <FaSearch />
                </button>
            </div>
        </div>
    );
}

export default SearchLesson;