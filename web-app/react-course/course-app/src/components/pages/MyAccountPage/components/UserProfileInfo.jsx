const UserProfileInfo = (props) => {
    const { avatar, info } = props
    return (
        <div className="my-account-profile-section">
            <div className="my-account-avatar-section">
                <img src={avatar || "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"}
                    className="my-account-avatar"  alt="Avatar"/>
                <button className="my-account-edit-photo">
                    <i className="fa-solid fa-camera"></i>
                </button>
            </div>

            <div className="my-account-info">
                <h2 className="my-account-name">
                    {info && info.firstName && info.lastName ? `${info.firstName} ${info.lastName}` : 'Đang tải...'}
                </h2>
                <p className="my-account-friends-count">576 người bạn</p>
                <button className="my-account-edit-profile-btn">Chỉnh sửa trang cá nhân</button>
            </div>
        </div>
    );
}

export default UserProfileInfo;