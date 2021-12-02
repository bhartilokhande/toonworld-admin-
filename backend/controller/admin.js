const FAQ = require("../model/FAQ")
const CMS = require('../model/cms')
const Admin = require('../model/admin')
const Contact = require('../model/contactus')
const Social = require('../model/social')

var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
// const localstorage = require('node-localstorage').LocalStorage;



var express = require("express");
var app = express();

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))


async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}
async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}



exports.adminSignup = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            Image
        } = req.body
        const hashedPassword = await hashPassword(password);
        const newUser = new Admin({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedPassword, 
            Image: Image,
            role:1          
        });

        var adminData = await Admin.find({email:req.body.email})
        if(adminData.length >0){
            return res.json({statusCode: 400, message: "Email alerady exist"})
        }
        let response = new Admin(newUser)
        response.save()
        .then((result)=>{
           return res.json({statusCode:"200",statusMsj:"Successfuly Register", data:result})
        }).catch((err)=>{
            console.log(err)
           return res.send(err)
        })
    } catch (error) {
        console.log(error)
        return res.send(error)
    }
}


exports.adminlogin = async (req, res, next) => {
    try {
        var email = req.body.email;
        var password = req.body.password;
        const admin = await Admin.findOne({email:email});

        if(!admin){
             return res.json({statusCode:401, statusMsj:"Enter valid Email"})
        }
        else{
            const validPassword = await validatePassword(password, admin.password); 
            if (!validPassword) {
                 return res.json({statusCode:402, statusMsj:"Password mismatch"})
            }
            else{
                const accessToken = jwt.sign({
                    adminId: admin._id
                }, 'bulbul', {
                    expiresIn: "1d"
                });
                await Admin.findByIdAndUpdate(admin._id, {
                    accessToken
                })
                console.log(accessToken)
                return res.json({statusCode:200, statusMsj:"login sussessfully", access:accessToken})
            }
        }        
    } catch (error) {
        console.log(error);
        return res.json({statusCode:400,message:"login failed"})
    }
}


exports.update_cms_contents = async (req,res)=>{
    var cms_id = req.query.cms_id;
    var description = req.body.editor1;

    console.log(cms_id)
    console.log(description)
    var cmsData = await CMS.findById({_id:cms_id})
    if(!cmsData){
        return res.status(201).json({message:"CMS Not Found"})
    }
    CMS.updateOne({_id:cms_id},{$set:{description:description}}).then(result=>{
        // return res.status(200).json({message: "Contents  Updated"})
        if(cmsData.Name == "AboutUs"){
            return res.redirect("http://127.0.0.1:5501/frontend/page.html")
            // return res.redirect("http://127.0.0.1:5501/page.html")
        }
        if(cmsData.Name == "ContactUs"){
            return res.redirect("http://127.0.0.1:5501/frontend/contactus.html")
            // return res.redirect("http://127.0.0.1:5501/contactus.html")

        }
        if(cmsData.Name == "T&C"){
            return res.redirect("http://127.0.0.1:5501/frontend/t&c.html")
            // return res.redirect("http://127.0.0.1:5501/t&c.html")

        }
        if(cmsData.Name == "PrivacyPolicy"){
            return res.redirect("http://127.0.0.1:5501/frontend/privacy_policy.html")
            // return res.redirect("http://127.0.0.1:5501/privacy_policy.html")

        }
        if(cmsData.Name == "Story"){
            return res.redirect("http://127.0.0.1:5501/frontend/story.html")
            // return res.redirect("http://127.0.0.1:5501/story.html")

        }
       
        
    }).catch(err=>{
        return res.status(500).json(err)
    })
}

exports.addFAQ = async(req,res)=>{
    try{
        const{
            question,
            editor1
        }=req.body
        const newcms = new FAQ({
            question:question,
            answer:editor1   
        });

        let response = new FAQ(newcms)
        response.save()
        .then((result)=>{
            // res.json({statusCode:"200",statusMsj:"Successfuly Add FAQ Question", data:result})
            res.redirect("http://127.0.0.1:5501/frontend/faq.html")
            // res.redirect("http://127.0.0.1:5501/faq.html")

        }).catch((err)=>{
            console.log(err);
            return res.send(err);
        })


    }catch(err){
        return res.send(err)
    }
}

exports.update_FAQ = async (req,res)=>{
    var faq_id = req.query.faq_id;
    var question = req.body.question;
    var answer = req.body.editor1;

    if(question == "" || answer == ""){
        return res.status(201).json({message:"empty field not allowed"})
    }
    
    var cmsData = await FAQ.findById({_id:faq_id})
    if(!cmsData){
        return res.status(201).json({message:"CMS Not Found"})
    }
    FAQ.updateOne({_id:faq_id},{$set:{question:question, answer:answer}}).then(result=>{
        // return res.status(200).json({message: "Contents  Updated"})
        return res.redirect("http://127.0.0.1:5501/frontend/faq.html")
        // return res.redirect("http://127.0.0.1:5501/faq.html")

    }).catch(err=>{
        return res.status(500).json(err)
    })
}

exports.delete_FAQ = async (req, res)=>{
    var faq_id = req.query.faq_id
    var faq_data = await FAQ.findById({_id:faq_id});
    if(!faq_data){
        return res.send({statusCode:400, message:"FAQ not found"})
    }
    var delete_FAQ_Data = await FAQ.updateOne({_id:faq_id}, {$set:{isDelete:true}})
    // console.log("delete_FAQ_Data",delete_FAQ_Data)
    res.redirect("http://127.0.0.1:5501/frontend/faq.html")
    // res.redirect("http://127.0.0.1:5501/faq.html")

}

exports.getFAQ = async(req,res)=>{
    FAQ.find({isDelete:false}).then(result=>{
        return res.send({statusCode:200, data:result})
    }).catch(err=>{
        return res.send(err)
    })
}

exports.getFAQById = async(req, res)=>{
    FAQ.findById({_id:req.query.faq_id}).then(result=>{
        // return res.send(result);
        return res.send(result)

    }).catch(err=>{
        return res.send(err);
    })
}

exports.getCMS = async (req, res)=>{

    CMS.findOne({Name:req.params.name})
    .then(result =>{
        return res.json({status:200, data:result})
    })
    .catch(err=>{
        return res.send(err)
    })
}

exports.forgotPassword = async(req, res)=>{
    var email = req.body.EMAIL
    var otp = Math.floor(Math.random() * 11111)
    console.log(otp)

    var add_otp = await Admin.updateOne({email:req.body.EMAIL},{$set:{otp:otp}})

    let transporter = nodemailer.createTransport(
        {
            service: "gmail",
            secure: false, 
            auth: {
                user: "bulbul.infograins@gmail.com", 
                pass: "BulBul@123"    
            },
            tls: { rejectUnauthorized: false }
        }
    );
    let mailOptions = {
        from: email,
        to: "bulbulbagwan918@gmail.com", 
        subject: "Your OTP", 
        html:"OTP - "+otp 
    };

    transporter.sendMail(mailOptions, function (error, success) {
        if (error) {
            res.send(error);
            console.log(error);
        }
        else {
            console.log("Server is ready to take our messages");
            return res.redirect("http://127.0.0.1:5501/frontend/forgot_password.html?email="+email)
            // return res.redirect("http://127.0.0.1:5501/forgot_password.html?email="+email)

        }
    });
}

exports.verify_otp = async (req, res)=>{
    var otp = req.body.otp;
    var email = req.query.email;
    var new_password = req.body.new_password;
    var confirm_password = req.body.confirm_password;

    var admin_data = await Admin.findOne({email:email}) 

    if(admin_data.otp != otp){
        return res.json({statusCode:401, statusMsj: "Wrong OTP"})
    }
    if(new_password != confirm_password){
        return res.json({statusCode:402, statusMsj: "Password mismatch"})
    }

    const hashedPassword = await hashPassword(new_password);

    var reset_password = await Admin.updateOne({email:email},{$set:{password:hashedPassword,otp:null}})
    console.log(reset_password)

    // res.json("Password reset successfully!")
    // return res.redirect("http://127.0.0.1:5500/frontend/page-login.html")
    return res.json({statusCode:200, statusMsj: "Password Changed"})


}

exports.change_password = async(req,res)=>{

    // const {
    //     email,
    //     oldPassword,
    //     new_password,
    //     confirm_password,
    //     }=req.body;
    var email = req.body.email
    var oldPassword = req.body.old_password
    var new_password = req.body.new_password
    var confirm_password = req.body.confirm_password

    var admin_Data = await Admin.findOne({email:email})
    if(!admin_Data){
        return res.json({statusCode:400, statusMsj:"Email not exist"})
    }
    var hash = admin_Data.password

    bcrypt.compare(oldPassword, hash, async (error, isMatch)=> {
        if (error) {
          throw error
        } else if (!isMatch) {
            return res.json({statusCode:401, message:"Password Not matched"});
        } else {
            if(new_password == confirm_password){
                const hash_new_passwoed = await hashPassword(new_password);
                Admin.updateOne({password:hash},{$set:{password:hash_new_passwoed}})
                .then(result =>{
                    return res.json({statusCode:200,statusMsj:"Successfuly Update", data:result})
                    // return res.redirect('http://127.0.0.1:5500/frontend/page-login.html')
                 }).catch(err =>{
                    console.log(err)
                    return res.send(err)
                    // return res.redirect("index.html")
                 })
            }else{
                return res.json({statusCode:402, statusMsj:"Password Mismatch"})
            }
        }
    })
}

// var userData = {       
//     name: req.body.FNAME,
//     email: req.body.EMAIL,
//     subject:  req.body.MMERGE6,
//     message:   req.body.MMERGE3
// }
exports.contact = async(req, res)=>{
    var userData = {       
        name: req.body.name,
        email: req.body.email,
        subject:  req.body.subject,
        message:   req.body.message
    }
    const newccontact = new Contact({
        name: userData.name,
        email: userData.email,
        subject: userData.subject,
        message:  userData.message
    });

    let response = new Contact(newccontact)
    var contactData = await response.save()
   console.log(contactData)

    let transporter = nodemailer.createTransport(
        {
            // service: "gmail",
            host: "smtp.gmail.com",
            port:465 ,
            secure: false, 
            connectionTimeout: 60000,
            // sendmail: true,
            // auth: {
            //     user: "bulbul.infograins@gmail.com", 
            //     pass: "BulBul@123"    
            // },
            tls: { rejectUnauthorized: false }
        }
    );

    let mailOptions = {
        from: "ndmap24@gmail.com",
        // to: "bulbulbagwan918@gmail.com", 
        to: "support@alture.world",
        subject: userData.subject, 
        html: userData.message
    };
    transporter.sendMail(mailOptions, function (error, success) {
        if (error) {
            res.send(error);
            console.log(error);
        }
        else {
            console.log("Server is ready to take our messages");
            transporter.close();
            return res.redirect("http://www.toonworld.io/contact.html")
            
            // return res.redirect("http://127.0.0.1:5501/forgot_password.html?email="+email)

        }
    });
    
}

exports.addSocail = async (req,res) => {
    try{
        const {
            name,
            url
        } = req.body
        const newsocail = new Social({
            name:name,
            url:url
        });

        // let response = new Social()
        
        newsocail.save()
         .then((result) => {
            //  res.json({
            //      status:"200",
            //      msg:"successfuly add socail name",
            //      data:result
            //  })
            res.redirect("http://127.0.0.1:5500/frontend/social.html")
         }).catch((err) => {
             console.log(err);
             return res.send(err);
         })

    }catch(err) {
        return res.send(err)
    }
}

exports.getSocial = async(req,res) => {

    Social.find({isDelete:false})
    .then(result => {
        return res.json({
            status:200,
            data:result
        })
    })
    .catch(err => {
        return res.send(err)
    })
} 

exports.update_social = async(req,res) => {
    var social_id = req.query.social_id;
    var name = req.body.name;
    var url = req.body.url;

    if(name == "" || url =="")
    {
        return res.status(201).json({
            msg:"empty field not allowed"
        })
    }

    var socialData = await Social.findById({_id:social_id})

    if(!socialData){
        return res.status(201).json({
            msg:"Socail not found"
        })
    }

    Social.updateOne({_id:social_id},{$set:{name:name,url:url}})
    .then(result => {
        return res.redirect("http://127.0.0.1:5500/frontend/social.html")
        // res.status(200).json({
        //     msg:"content updated",
        //     data:result
        // })
    }).catch(err =>{
        return res.status(500).json({
            err
        })
    })

}

exports.delete_social = async(req,res) => {
     var social_id = req.query.social_id;
     var social_data = await Social.findById({_id:social_id});

     if(!social_data){
          return res.send({
              status : 400,
              msg : "socailId not found"
          })
     }

     var delete_social_data = await Social.updateOne({_id:social_id},{$set:{isDelete:true}})
    //  .then(result => {
    //      return res.json({
    //          msg:"data deleted"
    //      })
    //  }).catch(err => {
    //      return res.json({err})
    //  })

    //  console.log("delet_social_data",delete_social_data)
    res.redirect("http://127.0.0.1:5500/frontend/social.html")

}



        
    