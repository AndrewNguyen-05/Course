import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PromoModal = ({ onClose, promotions }) => {
    const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

    const handleNext = () => {
        setCurrentPromoIndex((prevIndex) => (prevIndex + 1) % promotions.length);
    };

    const handlePrev = () => {
        setCurrentPromoIndex((prevIndex) => (prevIndex - 1 + promotions.length) % promotions.length);
    };

    useEffect(() => {
        const interval = setInterval(handleNext, 5000); 
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="promo-modal-container">
            <div className="promo-modal-content">
                <button className="promo-close-btn" onClick={onClose}>✖</button>
                <div className="promo-image-container">
                    <AnimatePresence>
                        <motion.img
                            key={currentPromoIndex} // Sử dụng key để thay đổi
                            className="promo-product-image"
                            src={promotions[currentPromoIndex].image}
                            alt={promotions[currentPromoIndex].title}
                            initial={{ opacity: 0, x: 100 }} // Bắt đầu từ ngoài bên phải
                            animate={{ opacity: 1, x: 0 }} // Hiện tại
                            exit={{ opacity: 0, x: -100 }} // Biến mất ra ngoài bên trái
                            transition={{ duration: 0.5 }} // Thời gian chuyển tiếp
                        />
                    </AnimatePresence>
                    <div className="promo-info">
                        <div className="promo-info-background">
                            <a className="promo-btn" href={promotions[currentPromoIndex].link}>Xem Ngay</a>
                        </div>
                    </div>
                </div>
                <div className="promo-navigation">
                    <button className="promo-prev-btn" onClick={handlePrev}>❮</button>
                    <button className="promo-next-btn" onClick={handleNext}>❯</button>
                </div>
            </div>
        </div>
    );
};
