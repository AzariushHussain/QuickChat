import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  chats: [],
  selectedChat: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload
    },
    addMessage(state, action) {
      const { chatId, message } = action.payload;
      const chat = state.chats.find(chat => chat.id === chatId);
      if (chat) {
          chat.messages.push(message);
      }
  },
  },
})

export const { setChats, setSelectedChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer