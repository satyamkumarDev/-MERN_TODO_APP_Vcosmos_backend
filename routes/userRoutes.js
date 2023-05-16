import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { generateToken, isAuth } from '../middleware.js';
const userRouter=express.Router();


userRouter.post('/signin', expressAsyncHandler(async (req, res)=>{
    const user=await User.findOne({email: req.body.email});
    if(user){
        if(bcrypt.compareSync(req.body.password, user.password)){
            res.send({
                _id:user._id,
                userName:user.userName,
                email:user.email,
                token: generateToken(user)
            })
            return;
        }
    }
    res.status(401).send({message: 'Invalid email or password'});
}));

userRouter.post('/register', expressAsyncHandler(async(req, res)=>{
    const user= new User({userName:req.body.userName, email:req.body.email, password:bcrypt.hashSync(req.body.password, 8)});
    const createdUser=await user.save();
    res.send({
        _id:createdUser._id,
        userName:createdUser.userName,
        email:createdUser.email,
        token:generateToken(createdUser),
    })

})
)

userRouter.get('/:id', expressAsyncHandler(async (req, res)=>{
    const user =await User.findById(req.params.id);
    if(user){
        res.send(user);
    }else{
        res.status(404).send({message:'User Not Found'});
    }
}))


export default userRouter;