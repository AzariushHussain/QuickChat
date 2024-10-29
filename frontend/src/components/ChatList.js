import React, { useEffect, useState } from 'react';
import { Button } from './ui';
import { useSelector } from 'react-redux';

export default function ChatList({ chats, onSelectChat }) {
  const token = useSelector((state) => state.auth.token);
  const userid = useSelector((state) => state.auth.user._id);

  return (
    <div className="space-y-2">
      {
        console.log('chats:', chats)
      }
      {
        chats.length === 0 ? (
          <div className="text-gray-500 text-center">Select people to chat</div>
        ) : (
          chats.map((chat) => {
            const otherUser = chat.users.filter((user) => user._id !== userid);
            let chatName;
            let userPicture;

            if (otherUser.length === 0) {
              // If no other user, display the logged-in user's phone
              chatName = chat.users.find((user) => user._id === userid).phone;
              userPicture = chat.users.find((user) => user._id === userid).picture; // Assuming picture exists
            } else {
              // Otherwise, use the first other user's information
              const user = otherUser[0];
              chatName = chat.name || user.phone;
              console.log('user picture:', user.picture);
              userPicture = user.picture; // Assuming picture exists
            }

            return (
              <Button
                key={chat._id}
                className="w-full justify-start text-left"
                variant="ghost"
                onClick={() => onSelectChat(chat)}
              >
                <div className="flex items-center space-x-2">
                  {userPicture && (
                    <img 
                      src={userPicture} 
                      alt={`${chatName}'s profile`} 
                      className="w-10 h-10 rounded-full" // Adjust size and styling as needed
                    />
                  )}
                  <div>
                    <div className="font-semibold">{chatName}</div>
                    <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
                  </div>
                </div>
              </Button>
            );
          })
        )}
    </div>
  );
}
