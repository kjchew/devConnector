const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../../config/keys').secretOrKey;
const passport = require ('passport');

//Load User model
const User = require('../../models/User');

// @route   GET /api/users/test
// @desc    Test for Users
// @access  Public
router.get('/test', (req, res) => res.json({msg: "Users works!"}))


// @route   GET /api/users/register
// @desc    Register for Users
// @access  Public
router.post('/register', (req, res) => {
    const validateRegisterInput = require('../../validation/register');
    const {errors, isValid } = validateRegisterInput(req.body);

    if (!isValid)
      return res.status(400).json(errors);
      
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                errors.email = "Email already exist"
                return res.status (400).json(errors);
            }else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash)=> {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                               .then(user => res.json(user))
                               .catch(err => console.log(err));
                    });
                });
            }
        })
       
})

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', 
            passport.authenticate('jwt', {session: false}), 
            (req, res)=>{
                res.json({
                    id: req.user.id,
                    name: req.user.name,
                    email: req.user.email
                });
            }        
        );


// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  
    const validateLoginInput = require('../../validation/login');
    const { errors, isValid } = validateLoginInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
  
    // Find user by email
    User.findOne({ email }).then(user => {
      // Check for user
      if (!user) {
        const errors = {email: 'User not found'};
        return res.status(404).json(errors);
      }
  
      // Check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User Matched
          const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
          }
          // Sign
          const jwtToken = jwt.sign(payload, secret, {expiresIn: 36000}, (err, token) => {
            res.json({
                success:true,
                token: 'Bearer ' + token
            });
          });
        } else {
          const errors = {password : 'Password incorrect'};
          return res.status(400).json(errors);
        }
      });
    });
  });
module.exports = router;
