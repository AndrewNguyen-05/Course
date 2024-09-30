import React, { useState } from "react";
import { AdsTable } from "./AdsTable";
import { Link } from "react-router-dom";

export const AdsPage = () => {
    const [adsList, setAdsList] = useState([
        {
            id: 1,
            name: "Spring Restful API",
            image: "https://hoidanit.vn/_next/image?url=https%3A%2F%2Fhoidanit.vn%2Fimages%2Fdf103a910302aef81bc172b910af3f77bfb.png&w=3840&q=75",
            type: "Sản phẩm",
            placement: "Trang chủ",
            customer: "Nguyễn Văn A",
            status: "Approved",
            make: "2024-09-25",
        },
        {
            id: 2,
            name: "Java Core for Beginner",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNDLTeb2ssFVFXtStyuvfj7IWY1xtL6Cuy9g&s",
            type: "Dịch vụ",
            placement: "Trang tin tức",
            customer: "Trần Thị B",
            status: "Pending",
            make: "2024-08-30",
        },
        {
            id: 3,
            name: "JavaScript for Beginner",
            image: "https://c8.alamy.com/comp/2C66938/moscow-russia-1-june-2020-javascript-js-logo-sign-with-program-code-on-background-illustrative-editorial-2C66938.jpg",
            type: "Sản phẩm",
            placement: "Trang chủ",
            customer: "Lê Văn C",
            status: "Rejected",
            make: "2024-07-15",
        },
    ]);

    return (
        <div>
            {/* Banner được tối ưu hóa với hình ảnh và biểu tượng */}
            <div className="banner-ads">
                <div className="banner-ads-left">
                    <div className="banner-ads-content">
                        <h1 className="banner-ads-title">Manage Your Advertisement</h1>
                        <p className="banner-ads-description">
                            Optimize performance and manage campaigns effectively
                        </p>
                        <Link to='/contact' className="banner-ads-button">Get started now</Link>
                    </div>
                </div>
                <div className="banner-ads-right">
                    <img
                        src="https://media.vneconomy.vn/w800/images/upload/2021/05/31/quang-cao-so1.png"
                        alt="Quản lý quảng cáo"
                        className="banner-ads-image"
                    />
                </div>
            </div>

            {/* Phần danh sách quảng cáo */}
            <div className="ads-content">
                <div className="ads-container">
                    <div className="ads-filter-bar">
                        <label htmlFor="orderByDate" className="ads-form-label">Advertisement Type</label>
                        <select className="ads-form-select" id="orderByDate" name="orderByDate">
                            <option value="desc">Down</option>
                            <option value="asc">Up</option>
                        </select>
                    </div>
                    {/* Bảng quảng cáo */}
                    <AdsTable ads={adsList} />
                </div>
            </div>
        </div>
    );
};
