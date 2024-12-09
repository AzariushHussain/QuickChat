const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoute');
const chatRoutes = require('./chatRoute');
const authRoutes = require('./authRoute');

router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);  

module.exports = router;