export const getMyInfo = async (token) => {
    const response = await fetch(`http://localhost:8080/api/v1/my-info`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    return response.json();
}

export const getPointsByCurrentLogin = async (token) => {
    const response = await fetch(`http://localhost:8080/api/v1/get-points-user-current`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) throw new Error('Failed to get points');

    return response.json();
}

export const sendOtp = async (email) => {
    const response = await fetch(`http://localhost:8080/api/v1/send-otp?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return response.json();
}

export const verifyOtp = async (email, otp) => {
    const response = await fetch(`http://localhost:8080/api/v1/verify-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            otp: otp,
        })
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify OTP');
    }

    return response.json();
}

export const resetPassword = async (email, otp, newPassword) => {

    const response = await fetch(`http://localhost:8080/api/v1/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPassword })
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unable to reset password');
    }

    return response.json();
}

export const checkUserExists = async (email) => {
    const response = await fetch(`http://localhost:8080/api/v1/check-exists-user?email=${email}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message)
    }
    return response.json();

}

export const sendOtpRegister = async (email) => {
    const response = await fetch(`http://localhost:8080/api/v1/send-otp-register?email=${email}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        throw new Error("Error sending OTP");
    }
    return response.json();
};

export const registerUser = async (otp, userData) => {
    const response = await fetch(`http://localhost:8080/api/v1/register?otp=${otp}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error("Error during registration");
    }
    return response.json();
};

export const registerTeacher = async (token, formDataToSend) => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/register-teacher`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formDataToSend
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Đã xảy ra lỗi trong quá trình đăng ký.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in registerTeacher API:', error);
        throw error; 
    }
};

export const createPasswordForFirst = async (token, createPassword) => {
    const response =  await fetch(`http://localhost:8080/api/v1/create-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createPassword)
    })

    if(! response.ok){
        const errorData = await response.json();
        throw new Error('Fail to create password')
    }

    return response.json();
}
