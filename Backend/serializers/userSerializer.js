const userSerializer = (user) => {
    return serialize(user, { exclude: ['password', '__v'] });
};

module.exports = userSerializer;