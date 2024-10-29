import React, { useEffect, useState } from 'react';

const OnlineUsersList = (socket) => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const { type, userId, isOnline } = JSON.parse(event.data);
                if (type === 'userStatus') {
                    handleUserStatusUpdate(userId, isOnline);
                }
            };
        }
    }, [socket]);

    const handleUserStatusUpdate = (userId, isOnline) => {
        console.log(`User ${userId} is now ${isOnline ? 'online' : 'offline'}`);
        setOnlineUsers((prev) => {
            if (isOnline) {
                return [...prev, userId]; 
            } else {
                return prev.filter((id) => id !== userId);
            }
        });
    };

};

export default OnlineUsersList;
