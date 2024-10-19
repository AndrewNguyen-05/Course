const AboutSection = () => {
    return (
        <div className="my-account-about">
            <h3>
                <i className="fa-solid fa-info-circle"></i> Giới thiệu
            </h3>
            <button className="about-button">
                <i className="fa-solid fa-user-plus"></i> Thêm tiểu sử
            </button>
            <button className="about-button">
                <i className="fa-solid fa-pen"></i> Chỉnh sửa chi tiết
            </button>
        </div>
    );
};

export default AboutSection;
