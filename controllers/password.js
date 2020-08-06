const User = require('../models/User');
const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
       user: '4dc9bdf9c6eb7e',
       pass: '0f9f2ef9a4c7b0'
    }
});


exports.recover =  async(req,res) => {

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(401).json({message: 'The email address ' + req.body.email +  ' is not associated with any account. Double-check your email address and try again.'});
            
            user.generatePasswordReset();

            user.save()
                .then(user => {
                    let link = "http://" + req.headers.host + "/api/user/reset/" + user.resetPasswordToken;
                    const message = {
                        to : user.email,
                        from: 'ebieroma323@gmail.com',
                        subject: "Password change request",
                        text: `Hi ${user.first_name} \n
                      Please click on the following link ${link} to reset your password. \n\n 
                        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
                    };
                    
                    transport.sendMail(message, (error, result) => {
                        if (error) return res.status(500).json({message: error.message});

                        res.status(200).json({message: 'A reset email has been sent to ' + user.email + '.'});
                    });
                })
                .catch(err => res.status(500).json({message: err.message}));
        
};

exports.reset = (req, res) => {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})
        .then((user) => {
            if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});

            //Redirect user to form with the email address
            res.render('reset', {user});
        })
        .catch(err => res.status(500).json({message: err.message}));
};




exports.resetPassword = async(req,res) => {

    const user = await User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})         
            
             if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});
             
             user.password = req.body.password;
             user.resetPasswordToken = undefined;
             user.resetPasswordExpires = undefined;

         

         
         user.save((err) => {
            if (err) return res.status(500).json({message: err.message});

            // send email
            const message = {
                to : user.email,
                from: 'ebieroma323@gmail.com',
                subject: "Password change request",
                text: `Hi ${user.first_name} \n
            this is  a confirmation that the password your ${user.email} has been changed`,
            };
            
            transport.sendMail(message, (error, result) => {
                if (error) return res.status(500).json({message: error.message});

                res.status(200).json({message: 'password of ' + user.email + 'changed successfully' });
            });
        });
    };

  