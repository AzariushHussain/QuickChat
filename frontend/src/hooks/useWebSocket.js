import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const useSocketIO = () => {
  const WS_URL = process.env.REACT_APP_WS_URL;  
  const WS_USER_STATUS = process.env.REACT_APP_WS_USER_STATUS;
  const WS_SEND_MESSAGE = process.env.REACT_APP_WS_SEND_MESSAGE;
  const WS_RECEIVE_MESSAGE = process.env.REACT_APP_WS_RECEIVE_MESSAGE;
  const WS_TYPING = process.env.REACT_APP_WS_TYPING;

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userStatus, setUserStatus] = useState({});
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?._id); // Ensure userId is safely accessed

  useEffect(() => {
    if (!token) {
      // If there's no token, return early to avoid creating a socket connection
      return;
    }

    const socketConnection = io(WS_URL, {
      transports: ['websocket'],
      query: { token },
    });

    setSocket(socketConnection);

    socketConnection.on('connect', () => {
      console.log('Socket.IO connection established');
      socketConnection.emit(WS_USER_STATUS, JSON.stringify({ userId, online: true }));
    });

    socketConnection.on(WS_RECEIVE_MESSAGE, (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socketConnection.on(WS_TYPING, (data) => {
      console.log('Typing data:', data); 
      if (data.userId !== userId) {
        setIsTyping(data.typing);
      }
    });

    socketConnection.on(WS_USER_STATUS, (status) => {
      setUserStatus((prevStatus) => ({
        ...prevStatus,
        [status.userId]: status.online,
      }));
    });

    socketConnection.on('disconnect', () => {
      console.log('Socket.IO connection closed');
    });

    socketConnection.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
      setError(err);
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        socketConnection.emit(WS_USER_STATUS, { userId, online: true });
      } else {
        socketConnection.emit(WS_USER_STATUS, { userId, online: false });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      socketConnection.disconnect();
    };
  }, [WS_URL, WS_RECEIVE_MESSAGE, WS_TYPING, token, userId]); // Re-run effect when token or userId changes

  const sendMessageViaSocket = (message) => {
    if (socket && socket.connected) {
      socket.emit(WS_SEND_MESSAGE, message);
    } else {
      console.log('Socket.IO connection is not open');
    }
  };

  const sendTypingStatus = (isTyping) => {
    if (socket && socket.connected) {
      socket.emit(WS_TYPING, { userId, typing: isTyping });
    }
  };

  return { socket, messages, setMessages, error, sendMessageViaSocket, sendTypingStatus, isTyping, userStatus };
};

export default useSocketIO;
