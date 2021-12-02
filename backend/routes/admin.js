const express = require('express');
const router = express.Router();


const {
   
    adminSignup,
    adminlogin,
    update_cms_contents, 
    addFAQ,
    getFAQ,
    getCMS,
    update_FAQ,
    delete_FAQ,
    getFAQById,
    forgotPassword,
    verify_otp,
    change_password,
    contact,
    addSocail,
    getSocial,
    update_social,
    delete_social
    // logout,
   
}
=require('../controller/admin');
router.post("/signup",adminSignup),
router.post("/login",adminlogin),
router.post("/update_cms_contents", update_cms_contents)
router.post("/addFAQ", addFAQ);
router.post("/update_FAQ", update_FAQ);
router.get("/getFAQ", getFAQ)
router.post("/getCMS/:name", getCMS);
router.get("/delete_FAQ",delete_FAQ);
router.get("/getFAQById", getFAQById);
router.post("/forgotPassword",forgotPassword);
router.post("/verify_otp",verify_otp);
router.post("/change_password",change_password);
router.post("/contact",contact);
router.post("/addsocail",addSocail);
router.get("/getSocial",getSocial)
router.post("/update_social",update_social)
router.get("/delete_social",delete_social)
// router.get("/logout",logout)



module.exports = router;