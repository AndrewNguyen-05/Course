import React, { useEffect, useState } from "react";
import { AdsTable } from "./AdsTable";
import { Link } from "react-router-dom";
import { getAdsByCurrentLogin } from "../../service/AdsService";
import { Pagination } from "../common/Pagination";

export const AdsPage = () => {
    const token = localStorage.getItem('token');
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [pageSize] = useState(6); // Số lượng quảng cáo hiển thị mỗi trang
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang

    useEffect(() => {
        document.title = 'Advertisement';

        const adsByCurrentLogin = async () => {
            try {
                setLoading(true);
                const data = await getAdsByCurrentLogin(token, currentPage, pageSize); // Gọi API với phân trang
                if (data.result && Array.isArray(data.result)) {
                    setAds(data.result);
                    setTotalPages(data.totalPages); // Lưu tổng số trang
                } else {
                    setAds([]);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        adsByCurrentLogin();
    }, [token, currentPage, pageSize]); // Chạy lại khi token, currentPage, hoặc pageSize thay đổi

    // Thay đổi trang
    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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
                        <label htmlFor="orderByDate" className="ads-form-label">Advertisement Sort</label>
                        <select className="ads-form-select" id="orderByDate" name="orderByDate">
                            <option value="desc">Newest</option>
                            <option value="asc">Oldest</option>
                        </select>
                    </div>
                    {/* Bảng quảng cáo */}
                    <AdsTable ads={ads} />

                    {/* Phân trang */}
                    <div className="mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            changePage={changePage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
