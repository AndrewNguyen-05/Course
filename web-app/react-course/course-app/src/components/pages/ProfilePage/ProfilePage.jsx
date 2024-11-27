import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getProfileInfo, removeAvatar, updateAvatar, updateProfile } from "../../../service/ProfileService";
import avatarDefault from '../../../img/avatar-default.jpg'

import { FromUpdateProfile } from "./components/FromUpdateProfile";

export const Profile = () => {
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    dob: "",
    address: "",
    description: "",
    courseLevel: "",
  });

  useEffect(() => {
    document.title = "Frofile";
  });

  useEffect(() => {
    getProfileInfo()
      .then((data) => {
        if (data.result) {
          setProfileData({
            avatar: data.result.avatar || "",
            firstName: data.result.firstName || "",
            lastName: data.result.lastName || "",
            gender: data.result.gender || "",
            phone: data.result.phone || "",
            dob: data.result.dob || "",
            address: data.result.address || "",
            description: data.result.description || "",
            courseLevel: data.result.courseLevel || "",
          });
          setSelectedImage(
            data.result.avatar ||
            avatarDefault
          );
        }
      })
      .catch((error) => {
        console.log("Get Info User Fail ", error);
      });
  }, []);

  const handleUpdateAvatar = (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("url-update-avatar");
    const file = fileInput.files[0];

    if (!file) {
      toast.error("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUpdatingAvatar(true);

    updateAvatar(formData)
      .then((response) => {
        if (response && response.message === "Profile updated successfully") {
          toast.success(response.message);
        } else {
          toast.error("Avatar update failed");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update avatar");
      })
      .finally(() => {
        setIsUpdatingAvatar(false);
      });
  };

  const handleRemoveAvatar = () => {
    setIsRemovingAvatar(true);

    removeAvatar()
      .then(() => {
        setSelectedImage(
          avatarDefault
        );
        toast.success("Avatar removed successfully!");
      })
      .catch((error) => {
        toast.error("Failed to remove avatar");
        console.error(error);
      })
      .finally(() => {
        setIsRemovingAvatar(false);
      });
  };

  const handleUpdateProfile = async () => {
    const filteredData = {};
    Object.keys(profileData).forEach((key) => {
      if (profileData[key] !== null && profileData[key] !== "") {
        filteredData[key] = profileData[key];
      }
    });

    try {
      const data = await updateProfile(filteredData);
      if (data.code === 200) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleOnChangeAvatar = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="content-profile">
      <FromUpdateProfile
        handleUpdateProfile={handleUpdateProfile}
        selectedImage={selectedImage}
        handleOnChangeAvatar={handleOnChangeAvatar}
        handleUpdateAvatar={handleUpdateAvatar}
        isUpdatingAvatar={isUpdatingAvatar}
        isRemovingAvatar={isRemovingAvatar}
        handleRemoveAvatar={handleRemoveAvatar}
        handleInputChange={handleInputChange}
        profileData={profileData}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        className="custom-toast-container"
      />
    </div>
  );
};
