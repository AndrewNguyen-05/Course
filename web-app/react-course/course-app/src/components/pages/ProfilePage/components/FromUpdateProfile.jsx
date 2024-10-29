export const FromUpdateProfile = (props) => {
  const {
    handleUpdateProfile,
    selectedImage,
    handleOnChangeAvatar,
    handleUpdateAvatar,
    isUpdatingAvatar,
    isRemovingAvatar,
    handleRemoveAvatar,
    handleInputChange,
    profileData,
  } = props;
  return (
    <div className="container">
      <div className="row gutters">
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
          <div className="card h-100">
            <div className="card-body">
              <div className="account-settings">
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <div className="user-avatar">
                    <img
                      src={selectedImage}
                      alt="User Avatar"
                      id="avatar-preview"
                      className="rounded-circle"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        border: "3px solid #007bff",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        document.getElementById("url-update-avatar").click()
                      } // Kích hoạt input ẩn khi nhấp vào ảnh
                    />
                  </div>
                  <div className="account-title mt-3">
                    <input
                      type="file"
                      className="form-control"
                      id="url-update-avatar"
                      name="file"
                      accept="image/*"
                      hidden
                      onChange={handleOnChangeAvatar}
                    />
                  </div>
                  <br />
                  <div className="d-flex mt-2">
                    {/* Nút Update Avatar hoặc Spinner */}
                    {isUpdatingAvatar ? (
                      <button className="btn btn-primary btn-sm me-2" disabled>
                        <i className="fas fa-spinner fa-spin me-1"></i>{" "}
                        Updating...
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm me-2"
                        onClick={handleUpdateAvatar}
                      >
                        <i className="fas fa-upload me-1"></i> Update
                      </button>
                    )}

                    {/* Nút Remove Avatar hoặc Spinner */}
                    {isRemovingAvatar ? (
                      <button className="btn btn-danger btn-sm" disabled>
                        <i className="fas fa-spinner fa-spin me-1"></i>{" "}
                        Removing...
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={handleRemoveAvatar}
                      >
                        <i className="fas fa-trash-alt me-1"></i> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
          <div className="card h-100">
            <div className="card-body">
              <div className="row gutters">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label
                      htmlFor="firstname"
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#333",
                      }}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstname"
                      name="firstName"
                      placeholder="Enter FirstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label
                      htmlFor="lastname"
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#333",
                      }}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastname"
                      name="lastName"
                      placeholder="Enter LastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label
                      htmlFor="gender"
                      className="form-label"
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#333",
                      }}
                    >
                      Gender:
                    </label>
                    <select
                      className="form-control"
                      id="gender"
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Choice</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label
                      htmlFor="phone"
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#333",
                      }}
                    >
                      Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      placeholder="Enter phone number"
                      value={profileData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label
                      htmlFor="birthday"
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#333",
                      }}
                    >
                      Date Of Birth
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="birthday"
                      name="dob"
                      placeholder="Date Of Birth"
                      value={profileData.dob}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label
                      htmlFor="skillLevel"
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#333",
                      }}
                    >
                      Current Skill Level
                    </label>
                    <select
                      className="form-control"
                      id="skillLevel"
                      name="courseLevel"
                      value={profileData.courseLevel}
                      onChange={handleInputChange}
                    >
                      <option value="">Select your skill level</option>
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label
                      htmlFor="Street"
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#333",
                      }}
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Street"
                      name="address"
                      placeholder="Enter Address"
                      value={profileData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label
                      htmlFor="ciTy"
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#333",
                      }}
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="ciTy"
                      name="description"
                      placeholder="Enter Description"
                      value={profileData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="text-right">
                    <button
                      type="button"
                      name="submit"
                      className="btn btn-secondary"
                      style={{
                        marginRight: "10px",
                        padding: "8px 15px",
                        borderRadius: "5px",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      name="submit"
                      className="btn btn-primary"
                      style={{
                        padding: "8px 15px",
                        borderRadius: "5px",
                        backgroundColor: "#007bff",
                        borderColor: "#007bff",
                      }}
                      onClick={handleUpdateProfile}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
