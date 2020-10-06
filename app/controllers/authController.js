const User = require('../models/User');
const jwt = require('jsonwebtoken');
const generateToken  = require('../helpers/generateToken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../helpers/validation');
const { successMessage, errorMessage, status } = require('../helpers/status');

const createUser = async (req,res) => {
    //Validate data
    const {error} = registerValidation(req.body);
    if(error) { 
        errorMessage.error = error.details[0].message;
        return res.status(status.bad).send(errorMessage);
    }

    //Checking if the user is already in the database
    const emailExist = await User.findOne({where: {email: req.body.email}});
    if(emailExist) { 
        errorMessage.error = "Email already exists";
        return res.status(400).send(errorMessage);
    }

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Create user
    const user = User.build({ 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        login: req.body.login,
        email: req.body.email,
        password: hashPassword
     });

    try {
        const {dataValues} = await user.save();
        delete dataValues.password;
        successMessage.result = dataValues;
        res.status(status.created).send(successMessage);
    } catch(err) {
        res.status(status.conflict).send(err);
    }  
}

const signIn = async (req,res) => {
    //LETS VALIDATE THE DATA BEFORE WE A USER
    const {error} = loginValidation(req.body);
    if(error) { 
        errorMessage.error = error.details[0].message;
        return res.status(status.bad).send(errorMessage);
    }

    //Checking if the email exists
    const user = await User.findOne({where: {email: req.body.email}});
    if(!user) { 
        errorMessage.error = "Email is not found";
        return res.status(status.bad).send(errorMessage);
    }

    //Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) {
        errorMessage.error = 'Invalid password';
        return res.status(status.bad).send(errorMessage);
    }

    //Create and assign a token
    const token = jwt.sign({id: user.id}, process.env.TOKEN_SECRET);
    const expiration = process.env.DB_ENV === 'testing' ? 100 : 604800000;
    res.cookie('token', token, {
        expires: new Date(Date.now() + expiration),
        secure: false, // set to true if your using https
        httpOnly: true,
      });
    successMessage.result = {token: token};
    res.header('auth-token', token).status(status.success).send(successMessage);
};

const logout = async (req,res) => {
    res.clearCookie('token');

    return res.sendStatus(200);
};

module.exports.createUser = createUser;
module.exports.signIn = signIn;
module.exports.logout = logout;