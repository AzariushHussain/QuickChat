const { ChatModel, MessageModel } = require('./schemaLoader'); // Import models from schemaLoader

const getChatsForUser = async (userId) => {
    return await ChatModel.find({ users: userId }).populate('users').exec();
};

const createChat = async (users, name, type) => {
    const chat = new ChatModel({
        users,
        name,
        type,
    });
    return await chat.save();
};

const findChat = async (criteria) => {
    return await ChatModel.findOne(criteria).populate('users', 'username').exec();
};

const updateChat = async (chatId, data) => {
    return await ChatModel.findByIdAndUpdate(chatId, data, { new: true }).exec();
};

const deleteChat = async (chatId) => {
    return await ChatModel.findByIdAndDelete(chatId).exec();
};

const getMessagesForChat = async (chatId) => {
    return await MessageModel.find({ chat: chatId }).populate('user').exec();
};

const createMessage = async (messageData) => {
    const message = new MessageModel(messageData);
    return await message.save();
};

const deleteMessage = async (messageId) => {
    return await MessageModel.findByIdAndDelete(messageId).exec();
};

module.exports = {
    getChatsForUser,
    createChat,
    findChat,
    updateChat,
    deleteChat,
    getMessagesForChat,
    createMessage,
    deleteMessage,
};
