import avatarDefault from '../../../../img/avatar-default.jpg'

const UserProfileInfo = (props) => {
    const { avatar, info } = props
    return (
        <div className="my-account-profile-section">
            <div className="my-account-avatar-section">
                <img src={avatar || avatarDefault}
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