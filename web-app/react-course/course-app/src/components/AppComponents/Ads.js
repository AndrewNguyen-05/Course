import React, { useEffect, useState } from "react";
import { AdsTable } from "./AdsTable";
import { Link } from "react-router-dom";
import { getAdsByCurrentLogin } from "../../service/AdsService";
import { Pagination } from "../common/Pagination";
import { motion } from "framer-motion";

export const AdsPage = () => {
    const token = localStorage.getItem('token');
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);


    useEffect(() => {
        document.title = 'Advertisement';

        const adsByCurrentLogin = async () => {
            try {
                setLoading(true);
                const data = await getAdsByCurrentLogin(token, currentPage);
                console.log(data);
                if (data.result && Array.isArray(data.result.data)) {
                    setAds(data.result.data);
                    setTotalPages(data.result.totalPages);
                } else {
                    setAds([]);
                    setTotalPages(0);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        adsByCurrentLogin();
    }, [token, currentPage]);

    // Thay đổi trang
    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }} // Hiệu ứng khi trang bắt đầu: mờ và dịch xuống
            animate={{ opacity: 1, y: 0 }}  // Hiệu ứng khi trang hiện ra: hiện và dịch lên
            exit={{ opacity: 0, y: 50 }}     // Hiệu ứng khi rời khỏi trang: mờ và dịch xuống
            transition={{ duration: 0.5 }}   // Thời gian chuyển đổi hiệu ứng
            className="content-page"
        >
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
        </motion.div>
    );
};
