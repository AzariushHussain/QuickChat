import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}auth`;

export const loginUser = async (phone) => {
    console.log('phone:', phone);
    const response = await axios.post(`${API_URL}/login`, phone);
    return response.data.message;
};

export const verifyOTP = async (phone, otp) => {
    const data = {
        "code":otp,
        "phone": phone
    };
    const response = await axios.post(`${API_URL}/verify-otp`, data);
    return response.data.data;
}

export const getUsers = async (token) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}user/`,{
        headers: {
            Authorization: `JWT ${token}`,
        },
    } );
    console.log('returned users:', response.data.data);
    return response.data.data;
};

export const getUserById = async (token, participantId) => {
    console.log('Getting user:', participantId);
    console.log('With token:', token);

    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}user/`, {
            params: {
                id: participantId,
            },
            headers: {
                Authorization: `JWT ${token}`,
            },
        });
        console.log('Returned users:', response.data.data.user);
        return response.data.data.user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};
