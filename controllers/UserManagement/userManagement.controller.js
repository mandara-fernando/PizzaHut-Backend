const  express=require("express");
var router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserManagement=require("../../models/UserManagementModel");
const AuthenticationModel = require("../../models/AuthenticationModel");




const AddUser = async (req, res) => {

   var FirstName =req.body.FirstName;
   var LastName =req.body.LastName;
   var Email =req.body.Email;
   var Contact = req.body.Contact;
   var Role =req.body.Role;
   var Branch =req.body.Branch;
   var Password =req.body.Password;
   var Profile = req.file.filename;
   var Address= ' ';
   
   console.log(
    FirstName,
    LastName,
    Email,
    Contact,
    Password,
    Role,
    Branch,
    Profile
  );

   if(!FirstName || !LastName ||!Email || !Contact ||!Password ||!Profile || !Role || !Branch)
    return res
    .status(400)
    .json({errorMessage: "Please enter all required fields"});

    const salt = await bcrypt.genSalt();
    const PasswordHash= await bcrypt.hash(Password, salt);


    const UserManage= new  UserManagement({
        FirstName,
        LastName,
        Email,
        Contact,
        Role,
        Branch,
        PasswordHash,
        Profile
    });

    await UserManage.save().then(()=>{
        const newUser = new AuthenticationModel({
            FirstName,LastName, Email,Contact, Address,Role,Branch, PasswordHash
        });
            const saveUser = newUser.save();
                const token=jwt.sign({
                    user:saveUser._id
                }, process.env.JWT_SECRET);
                
        res.cookie("token", token, {
            httpOnly: true
        });
          res.json({status:"Add a new user to the system"});
          
    }).catch((err) =>{
        console.log("User adding error");
        console.log(err);
    });
}



const DisplayUser = async (req, res) => {
    await UserManagement.find().then((UserManagement) => {
        if (UserManagement) {
            res.json(UserManagement); 
        } else {
            res.json({UserManagement:null}); 
       }
    }).catch((err)=>{
        console.log(err);
    });
};




const getOneUser = async (req, res) => {
    
    const _id =  req.params.id;

   await UserManagement.findById(_id,(err, UserManagement)=>{
        console.log(UserManagement);
        return res.status(200).json({
            success:true,
            UserManagement
        });
     
    }).catch((err)=>{
        console.log(err);
    });
};




const UpdateUser = async  (req, res) => {
    
    const _id = req.params.id;
    var FirstName =req.body.FirstName;
    var LastName =req.body.LastName;
    var Email =req.body.Email;
    var Contact = req.body.Contact;
    var Role =req.body.Role;

    const data = {
        FirstName,
        LastName,
        Email,
        Contact,
        Role
    }
    const update  = await UserManagement.findByIdAndUpdate(_id,data)
        .then(() => {
            console.log("Updated");
    res.status(200).send({status:"updated", user:update});
   }).catch((err)=>{
        console.log(err);
        res.status(500).send({status:"Update Error"});
   });
};




const DeleteUser =  async (req, res) => {
    const _id = req.params.id;
    await UserManagement.findByIdAndDelete(_id).then((sellers) => {
            res.json({
                status:"Success"
            })
    }).catch((err)=>{
        console.log(err);
    });

};





const ContactUser = async (req, res) => {    
    const _id =  req.params.id;
    await UserManagement.findById(_id, (err, UserManagement) => {
        return res.status(200).json({
            success:true,
            UserManagement
        });
    }).catch((err)=>{
        console.log(err);
    });
};



module.exports = {
    AddUser,
    DisplayUser,
    getOneUser,
    UpdateUser,
    DeleteUser,
    ContactUser
}