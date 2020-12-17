import express from 'express';
import nodemon from 'nodemon';
import connectDatabase from './config/db';
import {check, validationResult} from 'express-validator';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from './models/User';
import Post from './models/Post';
import auth from './middleware/Auth';
import { cast } from 'mongoose';


//Initialize express application
const app = express();

//connect database
connectDatabase();

//configure middleware
app.use(express.json({extended:false}));
app.use(
    cors({
        origin: 'http://localhost:3000'
    })
);

//api endpoints
/**
* @route GET /
* @desc Test endpoint
*/

app.get('/',(req, res) =>
    res.send('http get request sent to root api endpoint')
);

/**
 * @route POST api/users
 * @desc Register user
 */

app.post(
    '/api/users',
    [
        check('name','Please enter your name')
         .not()
         .isEmpty(),
        check('email', 'Please enter your email').isEmail(),
        check(
            'password',
            'Please enter a password with 6 or more characters')
            .isLength({ min:6 })
    ],
    async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) { 
        return res.status(422).json({errors:errors.array() });
    } else {
    const {name, email, password} = req.body;
    try{
        //check if user exists
        let User = await User.findOne({email:email});
        if (User){
            return res
            .status(400)
            .json({errors:[{msg:'User already exists'}]});
        }

        //create a new user
        User = new User({
            name: name,
            email:email,
            password:password
        });
    
        //encrypt the password
        const salt =await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        //save to the db and return
        await User.save();

        //Generate and return a JWT token
        

        //res.send('User successfully registered');
        returnToken(User, res);
    }catch(error){
        res.send(500).send('Server error');
    }
    }
        
   }
 );

//connection listener
const port = 5000;
app.listen (5000, () => console.log('Express server running on port 5000'));

/**
 * @route GET api/auth
 * @desc Authenticate user
 */

app.get('/api/auth',auth, async(req, res) =>{
    try{
        const User = await User.findById(req.User.id);
        res.status(200).json(User);
    }catch(error){
        res.status(500).send('Unknown server error');
    }
});

/**
 * @route POST api/login
 * @desc Login user
 */

 app.post(
     'api/login',
     [
         check ('email', 'Please enter a valid email').isEmail(),
         check('password', 'A password is required').exists()
     ],
     async(req, res) => {
         const errors = validationResult(req);
         if(!errors.isEmpty()){
             return res.status(422).json({errors: errors.array()});
         }else{
             const {email, password} = req.body;
                try{
                    //check user exists
                    let User = await User.findOne({email:email});
                    if(!User){
                        return res
                        .status(400)
                        .json({errors:[{msg:'Invalid email or password'}]});
                    }

                     //check password
                     const match = await bcrypt.compare(password, User.password);
                    if(!match){
                        return res
                        .status(400)
                        .json({errors:[{msg: 'Invalid email or password'}]});
                    }

                   //Generate and return a JWT token
                   returnToken = (User, res) => {
                       const payload = {
                           User:{
                               id: User.id
                           }
                       };

                       jwt.sign(
                           payload,
                           config.get('jwtSecret'),
                           {expiresIn: '10hr'},
                           (err, token) => {
                               if(err) throw err;
                               res.json({token:token});
                           }
                       );
                    };
                }catch(error)
                {
                    res.status(500).send('server error');
                }
            }        
    }            
 );

 //Post endpoints
 /**
  * @route POST api/posts
  * @desc Create post
  */

  app.post(
   '/api/posts',
    [
        auth,
        [
            check('title', 'Title text is required')
            .not()
            .isEmpty(),
            check('body', 'Body text is required')
            .not()
            .isEmpty(),
            check('statnum', 'numbers are required')
            .not()
            .isEmpty(),
            check('stattotalnum', 'total numbers input are required')
            .not()
            .isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({errors: errors.array});
        } else{
            const {title, body, statnum, stattotalnum} = req.body;
            try{
                //get the user who created the post
                const User = await User.findById(req.User.id);

                const post = new Post({
                    User: User.id,
                    title: title,
                    body: body,
                    statnum:statnum,
                    stattotalnum:stattotalnum
                });

                //save to the db and return
                await post.save();

            }catch{
                console.error(error);
                res.status(500).send('Server Error');

            }
        }
    }
  );

  /**
   * @route GET api/posts
   * @desc GET posts
   */

   app.get('/api/posts', auth, async(req, res)=>{
       try{
           const posts = await Post.find().sort({date: -1});
           res.json(posts);
       }catch(error){
           console.error(error);
           res.status(500).send('Server error');

       }
   });

   /**
    * @route GET api/posts/:id
    * @desc GET post
    * 
    */
   app.get('/api/posts/:id', auth, async(req, res) => {
       try{
           const post = await Post.findById(req.params.id);

           //make sure the post was found
           if(!post){
               return res.status(404).json({msg:'Post not found'});
           }

           res.json(post);

       }catch(error){
           console.error(error);
           res.status(500).send('Server error');
       }
   });


   /**
    * @route DELETE api/posts/:id
    * @desc Delete a post
    */

    app.delete('/api/posts/:id', auth, async(req, res) => {
        try{
            const post = await Post.findById(req.param.id);

            //make sure the post was found
            if(!post){
                return res.status(404).json({msg:'Post not found'});
            }
            
            //Make sure the request user created the post
            if(post.User.toString() !== req.User.id){
                return res.status(401).json({msg:'User not authorized'});

            }
            await post.remove();

            res.json({ msg: 'Post removed'});
        }catch(error){
            console.error(error);
            res.status(500).send('Server error');

        }
    });


/**
 * @route PUT api/posts/:id
 * @desc Update a post
 */

 app.put('/api/posts/:id', auth, async(req, res) =>{
     try{
         const{title, body, statnum, stattotalnum} = req.body;
         const post = await Post.findById(req.params.id);

         //Make sure the post was found
         if(!post){
             return res.status(404).json({msg: 'Post not found'});
         }

         //Make sure the request user created the post
         if(post.user.toString() !== req.User.id){
             return res.status(401).json({msg:'User not Authorized'});
         }

         //update the post and return
         post.title = title || post.title;
         post.body = body || post.body;
         post.statnum = statnum || post.statnum;
         post.stattotalnum = stattotalnum || post.stattotalnum;

         await post.save();

         res.json(post);

     }catch(error){
         console.error(error);
         res.status(500).send('Server error');
     }
 });
