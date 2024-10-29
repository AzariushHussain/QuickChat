import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setChats, setSelectedChat } from '../store/chatSlice'
import { Card, CardHeader, CardTitle, CardContent } from './ui'
import ChatList from './ChatList'
import { getChats, createChat } from '../api/chat' // Assume createChat is an API function
import MessageWindow from './MessageWindow'
import UserList from './userList' // New component for showing users
import { PlusIcon } from '@heroicons/react/solid' // Assuming you use heroicons
import { getUsers } from '../api/user'

export default function ChatPanel() {
  const dispatch = useDispatch()
  const { chats, selectedChat } = useSelector((state) => state.chat)
  const [showUserList, setShowUserList] = useState(false)
  const [users, setUsers] = useState([]) // State to hold fetched users
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getChats(token)
        console.log('Fetched chats:', data)
        dispatch(setChats(data))
      } catch (error) {
        console.error('Error fetching chats:', error)
      }
    }
    fetchChats();
      
  }, [dispatch, token]) 

  const handleSelectChat = (chat) => {
    dispatch(setSelectedChat(chat))
  }

  const handleCreateChat = async (user) => {
    const newChat = await createChat(user._id, token) 
    console.log('New chat:', newChat.data)
    if (newChat) {
      dispatch(setChats([...chats, newChat.data]))
      setShowUserList(false)
    }
  }

  const handleShowUserList = async () => {
    try {
      const fetchedUsers = await getUsers(token) // Fetch users from backend
      console.log('Fetched users:', fetchedUsers.users)
      setUsers(fetchedUsers.users) // Update state with fetched users
      setShowUserList(true) // Show user list
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Card className="w-1/3 h-full overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Chats</CardTitle>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={handleShowUserList} // Update to use the new function
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="h-full overflow-y-auto">
          <ChatList chats={chats} onSelectChat={handleSelectChat} />
        </CardContent>
      </Card>
      <Card className="w-2/3 h-full overflow-hidden">
        <CardContent className="h-full">
          {selectedChat ? (
            <MessageWindow chat={selectedChat} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </CardContent>
      </Card>

      {/* User List Modal/Dropdown */}
      {showUserList && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <UserList 
            users={users} // Pass fetched users to UserList component
            onClose={() => setShowUserList(false)} 
            onSelectUser={handleCreateChat} 
          />
        </div>
      )}
    </div>
  )
}
