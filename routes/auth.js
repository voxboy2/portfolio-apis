const router = require('express').Router();
const {check} = require('express-validator');
const Password = require('../controllers/password');
const validate = require('../middlewares/validate');

// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation');




// validation
router.post('/register', async(req,res) => {

    // we have to validate the data
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //  we check if user exists

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists,kindly choose new email')


    // password is hashed 
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(req.body.password, salt);


    //  user is created
    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});


// our login routes
router.post('/login', async(req,res) => {

    // we have to validate the data
   const { error } = loginValidation(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   //  we check if user exists
   const user = await User.findOne({email: req.body.email});
   if (!user) return res.status(400).send('Email or password is wrong');
    
   //  check if password is correct
   const validPass = await bcrypt.compare(req.body.password, user.password)

   if(!validPass) return res.status(400).send("Invalid password")
   
    
    //    create a token for user and also assign
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token)

})



//Password RESET
router.post('/recover', [
    check('email').isEmail().withMessage('Enter a valid email address'),
], validate, Password.recover);

router.get('/reset/:token', Password.reset);

router.post('/reset/:token', [
    check('password').not().isEmpty().isLength({min: 6}).withMessage('Must be at least 6 chars long'),
    check('confirmPassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
], validate, Password.resetPassword);






module.exports = router