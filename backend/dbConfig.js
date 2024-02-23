const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');

mongoose.connect(MONGO_URI).then(() => {
    console.log('Database connected');
}).catch((error) => {
    console.log(error);
});

module.exports = mongoose;