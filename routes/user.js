const express = require('express');
const connection = require("../connection");
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer');
require('dotenv').config();

router.post('/signup', function (req, res) {
    let user = req.body;
    query = "select email,password,role,status from user where email=?"
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')"
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Successfully registered" });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "Email Already Exists" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })

});


router.post('/login', function (req, res) {
    const user = req.body;
    query = "select email,password,roll,status from user where email=?";
    connections.query(query, [user.email], (err, results) => {
        if (!err) {
            if (result.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "Incorrect Username or password" });
            }
            else if (results[0].status === 'false') {
                return res.status(401).json({ message: "Wait for admin approval " });
            }
            else if (results[0].password == user.password) {
                const response = { email: results[0].email, role: results[0].role };
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                res.status(200).json({ token: accessToken });
            }
            else {
                return res.status(400).json({ message: "Something went wrong please try again later" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
});


var transport=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})

router.post('/forgotpassword', function(req,res){
    const user=req.body;
    query="select email,password from user where email=?";
    connection.query(query,[user.email],(err,results)=>{
        if(!err){
            if(results.length<=0){
                return res.status(200).json({message:"Password sent successfully to your email."});
            }
            else{
                var mailOptions={
                    from:process.env.EMAIL,
                    to:results[0].email,
                    subject:'Password by Cafe Management System',
                    html:'<p><b>Your Login Details for Cafe Managament System </b><br><b>Email: </b>'+results[0].email+'<br><b>Password: </b>'+results[0].password+'<br><a href="http://localhost:4200/">Click here to login</a></p>'
                };
                transport.sendMail(mailOptions,function(error,info){
                    if(error){
                        console.log(err);
                    }
                    else{
                        console.log('Email sent: '+info.response);
                    }
                });
                return res.status(200).json({message:"Password sent successfully to your email."});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
})


router.get('/get', function(req,res){
    var query="select id,name,email,contactNumber,status from user where role='user'";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', function(req,res){
    let user=req.body;
    var query="update user set status=? where id=?";
    connection.query(query,[user.status,user.id],(err,results)=>{
        if(!err){
            if(results.affectedRows==0){
                return res.status(404).json({message:"User id does not exist"});
            }
            return res.status(200).json({message:"User Updated Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})


router.get('/checkToken', function(req,res){
    return req.status(200).json({message:"true"});
})

router.post('/changePassword', function(req,res){
   // const
})


module.exports = router;