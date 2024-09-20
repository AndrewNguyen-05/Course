import React from "react";

export const Banner = () => {
    return (
        <div className="jumbotron jumbotron-fluid position-relative overlay-bottom" style={{ marginBottom: '90px' }}>
        <div className="container text-center my-5 py-5">
            <h1 className="text-white mt-4 mb-4">Learn From Home</h1>
            <h1 className="text-white display-1 mb-5">Education Courses</h1>
            <div className="mx-auto mb-5" style={{ width: '100%', maxWidth: '600px' }}>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <button className="btn btn-outline-light bg-white text-body px-4 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Courses
                        </button>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="#">Courses 1</a>
                            <a className="dropdown-item" href="#">Courses 2</a>
                            <a className="dropdown-item" href="#">Courses 3</a>
                        </div>
                    </div>
                    <input type="text" className="form-control border-light" style={{ padding: '30px 25px' }} placeholder="Keyword" />
                    <div className="input-group-append">
                        <button style={{ backgroundColor: '#F14D5D', borderColor: '#F14D5D', color: '#FFFFFF' }}
                            className="btn btn-secondary px-4 px-lg-5">
                            Search

                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}