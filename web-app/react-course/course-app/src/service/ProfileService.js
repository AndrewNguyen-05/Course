export const getProfileInfo = async (token) => {

    const response = await fetch(`http://localhost:8080/api/v1/info-user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    return response.json();
}

export const updateAvatar = async (formData, token) => {
    const response = await fetch(`http://localhost:8080/api/v1/update-avatar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    return response.json();
};


export const removeAvatar = async(token) => {
    const response = await fetch(`http://localhost:8080/api/v1/remove-avatar`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.json();
}

export const updateProfile = async (profileData, token) => {
    const response = await fetch('http://localhost:8080/api/v1/update-profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
    });
    return response.json();
};