import { FaCamera } from "react-icons/fa";

const CoverPhotoSection = () => {
    return (
        <div className="my-account-cover-photo">
            <img
                src="https://inkythuatso.com/uploads/thumbnails/800/2022/04/anh-bia-facebook-lien-quan-den-hoc-hanh-va-thi-cu-an-tuong-26-12-15-20-06.jpg"
                alt="Ảnh bìa"
                className="my-account-cover-img"
            />
            <div className="my-account-cover-overlay">
                <button className="my-account-cover-button">
                    <FaCamera /> Thêm ảnh bìa
                </button>
            </div>
        </div>
    );
}

export default CoverPhotoSection;