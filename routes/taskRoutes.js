import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../middleware.js';
import Task from '../models/taskModel.js';

const taskRouter=express.Router();

taskRouter.get('/task/get', isAuth, expressAsyncHandler(async (req, res)=>{
    const tasks = await Task.find({user:req.user._id})
    res.send(tasks)
}))

taskRouter.post('/task/add', isAuth, expressAsyncHandler(async(req, res)=>{
   
        const task=new Task({
            title:req.body.title,
            description: req.body.description,
            user:req.user._id
        });
        const createdTask= await task.save();
        res.status(201).send({message: 'Task Created successfully', task: createdTask})
    
}))

taskRouter.get('/details/:id', isAuth, expressAsyncHandler(async(req, res)=>{
    const task=await Task.findById(req.params.id);
    if(task){
        res.send(task)
    }else{
        res.status(404).send({message: 'Task Not Found'});
    }
}))

taskRouter.delete('/delete/:id', isAuth, expressAsyncHandler(async(req, res)=>{
    const task=await Task.deleteOne({_id:req.params.id});
    if(task){
        res.send({message: 'Deleted Successfully'})
    }else{
        res.status(404).send({message: 'Task Not Found'});
    }
}))

taskRouter.put('/task/update',isAuth, expressAsyncHandler(async(req, res)=>{
    const task= await Task.findOne({_id: req.body._id})
    if(task){
            task.title=req.body.title,
            task.description= req.body.description
            task.save()
            res.send({task:task})    

    }else{
        res.send({message:'Users Not Found'})
    }
}))


export default taskRouter