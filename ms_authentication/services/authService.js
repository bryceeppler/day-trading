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
const { STATUS_CODE } = require("../shared/lib/enums");


exports.login = async (data) =>
{
    try
    {
        let user = await redis.fetchByUserName(data.user_name);
        if (!user)
        {
            return createError('User does not exist', STATUS_CODE.OK);
        }
        // Compare the plaintext password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch)
        {
            return createError('Invalid Credentials', STATUS_CODE.OK);
        }

        const token = jwt.sign({ userId: user._id, user_name: user.user_name, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
        if (!token)
        {
            return createError('error creating token');
        }
        return token;
    } catch (error)
    {
        console.error(error);
        return createError("Error Logging In");
    }
};

exports.register = async (data) =>
{
    try
    {
        const existingUser = await redis.fetchByUserName(data.user_name);

        if (existingUser)
        {
            console.log('user already exists', existingUser.user_name);
            return createError('User already exists', STATUS_CODE.OK);
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
        let hashedPassword = await bcrypt.hash(data.password, saltRounds);

        const newUser = new User({ user_name: data.user_name, password: hashedPassword, name: data.name });
        await redis.createUser(newUser)

    } catch (error)
    {
        console.error(error);
        return createError("Error Registering User");
    }
}

