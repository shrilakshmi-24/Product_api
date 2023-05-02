const db = require('../models');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "PRODUCTAPI";
const logger=require('../middlewares/logger')

const User = db.users;
const Login=db.Login


//create user or signUp
const addUser = async (req, res) => {
 
  const { id, u_name, password, role } = req.body;
  
  console.log(req.body);




  
  console.log(Login)
  try {
    const existingUser = await User.findOne({where:{ u_name: u_name }});
    if (existingUser) {
      logger.info("Signup with existing user")
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const newUser = await User.create({
      id: id,
      u_name: u_name,
      password: hashedPassword,
      role: role,
    });
    
    res.status(201).json({
      user: newUser,
      message:"created user/admin"
      // token: token,
    });
    logger.info("user created successfully")
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
    logger.error(error.message)
  }
};

const signIn=async (req,res)=>{
  const {u_name,password}=req.body
  console.log(req.body)
  try{
    const existUser=await User.findOne({where:{u_name:u_name}})
    console.log(existUser)
    if(!existUser){
      logger.info("Invalid user id provided")
      return res.status(404).json({message:"User not exist:("})
    }
    const matchPassword=await bcrypt.compare(password,existUser.password)
      if(!matchPassword){
        logger.info("Invalid passwoed provided")
        return res.status(400).json({message:"invalid password"})
      }
      const token = jwt.sign(
        { u_name: existUser.u_name, id: existUser.id },SECRET_KEY
      );
        res.status(201).json({
          userName: existUser.u_name,
          message:"Successfully Logged in",
          token: token,
  
        });
        logger.info("signed in succesfully")
      // }).catch(err=>{
      //   console.log(err)
      //   res.status(500).send("There was a error logging in")
      // })

  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
    logger.error(error.message)
  }
}




//get all users

const getAllUsers=(async(req,res)=>{
  try{
    let users=await User.findAll({})
    res.status(200).send(users)
    logger.info("Fetch all the user")
  }
  catch(err){
    logger.error(err.message)
  }
    
})


//gew single user by id
const getSingleUser=(async(req,res)=>{
  try{
    let id=req.params.id
    let user=await User.findOne({where:{id:id}})
    res.status(200).send(user)
  }
  catch(err){
    logger.error(err.message)
  }
    
})


//update user
const updateUser=(async(req,res)=>{
  try{
    let id=req.params.id
    let user=await User.update(req.body,{where:{id:id}})
    res.status(200).send(user)
    logger.info(`updated user with id ${id}`)

  }
  catch(err){
    logger.error(err.message)
  }
   
})


//delete product by id
const deleteUser=(async(req,res)=>{
   try{
    let id=req.params.id
    await User.destroy({where:{id:id}})
    res.status(200).send(`user ${id} deleted` )
    logger.info(`user ${id} deleted` )
   }
   catch(err){
    logger.error(err.message)
  }
})


//adding user details to csv

const createUsersCsv = async (req, res) => {
  const createCsvWriter = require("csv-writer").createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: "user.csv",
    header: [
      { id: "id", title: "ID" },
      { id: "u_name", title: "Name" },
      {id:"password",title:"Password"},
      { id: "role", title: "Role" },
      { id: "createdAt", title: "Created At" },
      { id: "updatedAt", title: "Updated At" },
    ],
  });

  const data = await User.findAll({});
  csvWriter
    .writeRecords(data)
    .then(() => {
      console.log("CSV file written successfully");
      res.download("user.csv");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
};



module.exports={
  addUser,getAllUsers,updateUser,deleteUser,getSingleUser,signIn,createUsersCsv
    
}

