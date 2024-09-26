import React, {useState } from "react";

export const Search = ({ onSearch }) => {

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [courseLevel, setCourseLevel] = useState('');
    const [language, setLanguage] = useState('');
    const [minPoints, setMinPoints] = useState('');
    const [maxPoints, setMaxPoints] = useState('');

    const handleSearch = () => {
        let filterQuery = '';

        if (title) {
            filterQuery += `title~~'*${title}*'`;
        }
        if (author) {
            filterQuery += (filterQuery ? ' and ' : '') + `author.name~~'*${author}*'`;
        }
        if (courseLevel) {
            filterQuery += (filterQuery ? ' and ' : '') + `courseLevel~~'*${courseLevel}*'`;
        }
        if (language) {
            filterQuery += (filterQuery ? ' and ' : '') + `language~~'*${language}*'`;
        }
        if (minPoints) {
            filterQuery += (filterQuery ? ' and ' : '') + `points>:${minPoints}`;
        }
        if (maxPoints) {
            filterQuery += (filterQuery ? ' and ' : '') + `points<:${maxPoints}`;
        }

        if (filterQuery) {
            onSearch(filterQuery);  // Gọi hàm tìm kiếm với query filter
            console.log(courseLevel);

        } else {
            alert('Please enter at least one search criterion.');
        }
    };

    // Components Search này chỉ có nhiệm vụ: thu thập giá trị mà người dùng nhập vào sau đó truyền lên component Courses thông qua hàm OnSearch
    // Khi người dùng nhấn nút Search, dữ liệu này sẽ được truyền ngược lên Courses thông qua hàm onSearch.

    return (
        <div>
            <div className="container-fluid mb-5">
                <div className="search-bar p-4 rounded shadow-sm custom-search-bar">
                    <div className="row justify-content-center align-items-center">

                        {/* Title Search */}
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                            <input
                                type="text"
                                className="form-control search-input custom-input"
                                placeholder="Search by Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Author Search */}
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                            <input
                                type="text"
                                className="form-control search-input custom-input"
                                placeholder="Search by Author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />
                        </div>

                        {/* Course Level Search */}
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                            <select
                                className="form-control search-input custom-input"
                                value={courseLevel}
                                onChange={(e) => setCourseLevel(e.target.value)}
                            >
                                <option value="">All Levels</option>
                                <option value="BEGINNER">BEGINNER</option>
                                <option value="INTERMEDIATE">INTERMEDIATE</option>
                                <option value="ADVANCED">ADVANCED</option>
                                <option value="EXPERT">EXPERT</option>
                            </select>
                        </div>

                        {/* Language Search */}
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                            <select
                                className="form-control search-input custom-input"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option value="">All Languages</option>
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                            </select>
                        </div>

                        {/* Min Price Search */}
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                            <input
                                type="number"
                                className="form-control search-input custom-input"
                                placeholder="Min Price"
                                value={minPoints}
                                onChange={(e) => setMinPoints(e.target.value)}
                            />
                        </div>

                        {/* Max Price Search */}
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                            <input
                                type="number"
                                className="form-control search-input custom-input"
                                placeholder="Max Price"
                                value={maxPoints}
                                onChange={(e) => setMaxPoints(e.target.value)}
                            />
                        </div>

                        {/* Search Button */}
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                            <button className="btn btn-primary btn-block custom-btn" onClick={handleSearch}>
                                Search
                            </button>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}
