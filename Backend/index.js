const express = require('express');
const cors =  require('cors') ;
const {PrismaClient} = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const authmiddleware = require('./authmiddleware');


const app = express(); 
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET;


// new user sign up 
app.post('/api/signup' , async(req, res) => {
    const {name , email , password} = req.body ;

    try {
        const existingUser = await prisma.user.findUnique({
            where : {
                
              email :  email
            
            } 
        }) ;

        if(existingUser) {
            return res.status(400).json({message :'user already exists'})
        }

        const hashedPassword = await bcrypt.hash(password , 10) ;
     
        const newUser = await prisma.user.create({
            data : {
                name , email , password :hashedPassword,
            }
        }) ;


        res.status(201).json({user: { id :newUser.id , name : newUser.name , email: newUser.email}});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message : 'Internal Server error'});
    }
} ) ;

// existing user login 
app.post('/api/login' , async(req, res) => {

    const {email , password} = req.body ; 

    try {
        const user = await prisma.user.findUnique({
            where : {
                email : email
            } ,
        }) ;

        if(!user){
            return res.status(400).json({message : 'Invalid email or password'});           
        }

        // check for password validity to identify the user

        const isUser = await bcrypt.compare(password , user.password) ;

        if(!isUser) {
            return res.status(400).json({message : "Invalid password"});

        }

        const token = jwt.sign({userId : user.id} , JWT_SECRET, {expiresIn : '2h'}); 

        res.status(200).json({token, user: {id : user.id , email : user.email}});
    } catch(error) {
        console.error(error) ;
        res.status(500).json({message : 'Internal server error'}) ;
    }

} ) ;


// retrieve  stored tasks 

app.get('/api/tasks' , authmiddleware , async(req , res) =>{

    try {
  const tasks =  await prisma.task.findMany({
    where : {
        userId : req.userId 
    } , 
  })
  
res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching tasks' });
      }

});

// create tasks 

app.post('/api/tasks' , authmiddleware,  async(req , res) =>{
 try{ 
    const {title , description , priority, status} = req.body  ;


    if(!title || !description || !priority||!status) {
        return res.status(400).json({message : "Title , description , and status are required"});
    }
    const createTask = await prisma.task.create ({

        data :  {
            title , description ,priority, status , userId : req.userId , 
        }
    }) ;

    res.status(201).json(createTask);
} catch (err) {
    res.status(500).json({message : "error creating task" });
}
    
});

app.delete('/api/delete' , authmiddleware , async(req , res) => {

    const {id} = req.body ;

    if(!id) {
        return res.status(400).json({message : "Task id is required"})
    }
    try {

        const deleteTask = await prisma.task.delete (
            { 
                where :
                  {
                 id : id ,
             } , 
            
            }
        )
      
        res.status(200).json({message :  "task deleted successfully"});
      
    } catch(error) {
        console.error("Error deleting task:", error);
        res.status(500).json({message : "error deleting the task"}) ;
    }
})


app.listen(5000 , ()=>{
    console.log("Server running on port 5000");
}) 


