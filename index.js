import express from  'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';

dotenv.config();
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const PORT=process.env.PORT || 8000;



mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/todo',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);


app.get('/', (req,res) =>{
    res.send('server is ready!');
});


app.use((err, req, res, next)=>{
    res.status(500).send({message:err.message});
})

app.listen(PORT,()=>{
    console.log(`Todo app running at https://localhost:${PORT}`)
})