import React, { useState, useEffect, useRef } from 'react';
import { Button, Input } from './ui';
import { useSelector } from 'react-redux';
import useSocketIO from '../hooks/useWebSocket'; 
import { fetchMessages } from '../api/chat';
import { sendMessage } from '../api/chat';

export default function MessageWindow({ chat }) {
  const [newMessage, setNewMessage] = useState('');
  const token = useSelector((state) => state.auth.token);
  const userid = useSelector((state) => state.auth.user._id);
  const { sendMessageViaSocket, messages, setMessages, sendTypingStatus, isTyping, userStatus } = useSocketIO();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const fetchedMessages = await fetchMessages(chat._id, token);
        setMessages(fetchedMessages.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    loadMessages();
  }, [chat._id, token, setMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const messageData = {
      message: {
        type: 'text',
        message: newMessage
      },
      chatId: chat._id,
    };

    const sentMessage = await sendMessage(messageData, token);
    sendMessageViaSocket(sentMessage);
    setMessages((messages) => [...messages, sentMessage]);
    setNewMessage('');
  };

  const [typing, setTyping] = useState(false);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    sendTypingStatus(true);
    setTyping(true);
  };

  const otherUser = chat.users.filter((user) => user._id !== userid);
  
  // Get the online status for the other user
  const otherUserId = otherUser.length > 0 ? otherUser[0]._id : null;
  const isOnline = otherUserId ? userStatus[otherUserId] : false;

  return (
    <div className="flex flex-col h-full">
      <div className="font-semibold p-4 border-b flex items-center">
        {isOnline ? (
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2" /> // Green dot
        ) : (
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-2" /> // Red dot
        )}
        {otherUser.length === 0 ? (
          chat.users.find((user) => user._id === userid).phone
        ) : (
          chat.name || otherUser[0].phone
        )}
      </div>
      
      {/* Typing indicator */}
      {isTyping && (
        <div className="text-gray-500 italic text-center">
          {/* {`${otherUser.length === 0 ? (
            chat.users.find((user) => user._id === userid).phone
          ) : (
            chat.name || otherUser[0].phone
          )} is typing...`} */}
          {
          //@ToDO: Fix the typing status for a group  chat
          `Typing...`
          }
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`max-w-[30%] p-2 rounded-lg ${
                message.user._id === userid
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.data}
            </div>
          ))
        )}

        {/* Reference to ensure the view scrolls to the bottom */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="p-4 border-t flex">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTyping}
          className="flex-1 mr-2"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
