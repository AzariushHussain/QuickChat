import React, { useEffect, useState } from 'react'
import { getUsers } from '../api/user' 
import { ChatIcon } from '@heroicons/react/solid'
import { useSelector } from 'react-redux'


const UserList = ({ onClose, onSelectUser }) => {
  const [users, setUsers] = useState([])
  const token = useSelector((state) => state.auth.token);


  useEffect(() => {
    async function fetchUsers() {
      const userList = await getUsers(token)
      setUsers(userList.users)
    }
    fetchUsers()
  }, [])

  return (
    <div className="bg-white p-4 rounded shadow-lg w-1/3">
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-bold">Select a user to chat</h3>
        <button onClick={onClose}>X</button>
      </div>
      <ul>
        {console.log('users:', users)}
        {users.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center border-b p-2 hover:bg-gray-100 cursor-pointer"
          >
            <span>{user.name?user.name:user.phone}</span>
            <button onClick={() => onSelectUser(user)}>
              <ChatIcon className="h-5 w-5 text-blue-500" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserList
