const express = require('express');
var user = express.Router();
user.use(express.json());
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const {addcms
} = require('../controller/cms');
router.post("/addcms",addcms );


module.exports = router
