const mongoose = require('mongoose');

const connectDB = async (dbURI) =>
{
    await mongoose.connect(
        dbURI,
        { authSource: 'admin' }
    )
        .then(() =>
        {
            console.log("Mongo DB - Connected")
            console.log("         - Port: 27017")
            console.log("         - Database: db")
        })
        .catch((error) => 
        {
            console.error('Error connecting to MongoDB:', error);
            process.exit(1);
        });
};

module.exports = connectDB;
