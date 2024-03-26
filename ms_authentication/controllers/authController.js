
const {
    handleError,
    successReturn,
    errorReturn,
} = require("../shared/lib/apiHandling");
const authService = require('../services/authService')

exports.register = async (req, res, next) =>
{
    try
    {
        console.log("Registering ---------------------------------")
        const registerDetails =
        {
            user_name: req.body.user_name,
            password: req.body.password,
            name: req.body.name
        };

        console.log(registerDetails);

        const error = await authService.register(registerDetails);

        if(error)
        {
            return errorReturn(res, error);
        }
        return successReturn(res);

    } catch (error)
    {
        return handleError(error, res, next);
    }
};

exports.login = async (req, res, next) =>
{
    try
    {
        const userDetails =
        {
            user_name: req.body.user_name,
            password: req.body.password
        };
        const result = await authService.login(userDetails);

        return result.success ? successReturn(res, {token: result.data}) : errorReturn(res, result.data);

    } catch (error)
    {
        return handleError(error, res, next);
    }
};

