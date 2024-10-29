const { publishEvent } = require("./redis");


const registerSocket = (io) => 
    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);
    
        // Notify others that the user is online
        socket.on('user_status', (userStatus) => {
            console.log('websocket user_status :', userStatus)
            const { userId } =  userStatus
            socket.userId = userId;
            socket.broadcast.emit('user_status', userStatus);
            publishEvent('USER_STATUS', {
                userStatus,
                event: 'user_status'
            });
        })
    
        // When a client sends a message
        socket.on('send_message', (message) => {
            // Broadcast the message to all clients except the sender
            console.log('websocket message :', message)
            socket.broadcast.emit('receive_message', message);
            publishEvent('SEND_MESSAGE', message);
    
            console.log(`Message from ${socket.userId}: ${message.data}`);
        });
    
        // Handle typing event
        socket.on('user_typing', () => {
            console.log(`User ${socket.userId} is typing`);
            // Broadcast typing status to other clients in the same chat
            socket.broadcast.emit('user_typing', {
                userId: socket.userId,
                typing: true, // Indicate that the user is typing
            });
            publishEvent('TYPING', {
                event: 'user_typing',
                userId: socket.userId,
                typing: true, // Indicate that the user is typing
            });
    
            // Optionally indicate when typing stops
            setTimeout(() => {
                socket.broadcast.emit('user_typing', {
                    userId: socket.userId,
                    typing: false, // Indicate that the user has stopped typing
                });
                publishEvent('TYPING', {
                    event: 'user_typing',
                    userId: socket.userId,
                    typing: false, 
                });
            }, 3000); // Example timeout of 3 seconds
        });
    
        // Handle disconnect event
        socket.on('disconnect', () => {
            console.log(`User ${socket.userId} disconnected`);
            // Notify others that the user is offline
            socket.broadcast.emit('user_offline', { userId: socket.userId });
        });
    });
    


module.exports = { registerSocket };