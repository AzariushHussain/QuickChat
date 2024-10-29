import axios from 'axios';



const API_URL = `${process.env.REACT_APP_API_URL}chat`;


export const getChats = async (token) => {
    const response = await axios.get(`${API_URL}/connected-users`, {
        headers: {
            Authorization: `JWT ${token}`,
        }
})
console.log('response:', response.data.data);
    return response.data.data;
};

export const createChat = async (userId, token) => {
    console.log('userId:', userId);
    const response = await axios.post(`${API_URL}/create-chat`,  {users: [userId]} ,{
        headers: {
            Authorization: `JWT ${token}`,
        }
    });
    return response.data;
};

export const sendMessage = async (messageData, token) => {
    const response = await axios.post(`${API_URL}/send-message`, messageData,{
        headers: {
            Authorization: `JWT ${token}`,
        }
    });
    return response.data.data;
};

export const fetchMessages = async (contactId, token) => {
    const response = await axios.get(`${API_URL}/messages/`,{
        headers: {
            Authorization: `JWT ${token}`,
        },
        params: {
            contactId,  
        },
    });
    console.log('response messages:', response.data);
    return response.data;
};

