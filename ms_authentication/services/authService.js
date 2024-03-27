const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
    handleError,
    successReturn,
    errorReturn,
    createError,
} = require("../shared/lib/apiHandling");
const redis = require("../shared/config/redis");
const User = require('../shared/models/userModel');


exports.login = async (data) =>
{
    try
    {
        console.log("Login Data: ", data);
        let user = await redis.fetchByUserName( {user_name: data.user_name });
        if (!user)
        {
            return {success: false, data: 'User does not exist'};
        }
        // Compare the plaintext password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch)
        {
            return {success: false, data: 'Invalid Credentials'};
        }

        const token = jwt.sign({ userId: user._id, user_name: user.user_name, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
        if (!token)
        {
            return {success: false, data:'error creating token'};
        }
        return {success: true, data: token };
    } catch (error)
    {
        console.error(error);
        throw createError("Error Logging In");
    }
};

exports.register = async (data) =>
{
    try
    {
        const existingUser = await redis.fetchByUserName({user_name: data.user_name });

        if (existingUser)
        {
            console.log('user already exists', existingUser.user_name);
            return 'User already exists';
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
        let hashedPassword = await bcrypt.hash(data.password, saltRounds);

        const newUser = await new User({ user_name: data.user_name, password: hashedPassword, name: data.name });
        await redis.createUser(newUser);

    } catch (error)
    {
        console.error(error);
        throw createError("Error Registering User");
    }
}

