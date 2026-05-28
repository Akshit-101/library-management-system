const express = require('express')  
const router = express.Router();
const {getAllMembers,getMember,postMember,updateMember} = require('../controllers/member.js')

router.get("/", getAllMembers)    
router.get("/:id",  getMember)        
router.post("/",  postMember)      
router.patch("/:id",  updateMember)     

module.exports = router